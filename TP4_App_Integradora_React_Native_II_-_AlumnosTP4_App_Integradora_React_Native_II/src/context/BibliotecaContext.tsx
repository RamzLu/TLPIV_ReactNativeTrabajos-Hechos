import { createContext, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { ReactNode } from 'react';

import { CLAVE_PERSONAL, MAX_RECIENTES, NOMBRE_USUARIO, USUARIO_PERSONAL } from '../constants/config';
import { LIBROS } from '../data/libros';
import {
  crearEstadoInicial,
  ejemplaresDisponibles,
  entregarAlSiguiente as calcularEntrega,
  estadoDeReserva,
  personasEnEspera,
  posicionEnEspera,
  reducirBiblioteca,
  reservarLibro,
} from '../lib/biblioteca';
import { buscarLibroPorIsbn } from '../lib/catalogo';
import {
  cancelarRecordatorio,
  consultarPermisoNotificaciones,
  enviarAvisoDeEntrega,
  programarRecordatorio,
} from '../lib/notificaciones';
import type { Aviso, EstadoReserva, Libro, Prestamo, ResultadoReserva } from '../types';

export type LibroConEspera = {
  libro: Libro;
  frente: string;
  cantidad: number;
};

export type EsperaPropia = {
  libro: Libro;
  posicion: number;
  total: number;
};

export type ValorBiblioteca = {
  prestamos: Prestamo[];
  vistosRecientemente: Libro[];
  esPersonal: boolean;
  avisos: Aviso[];
  librosConEspera: LibroConEspera[];
  misEsperas: EsperaPropia[];
  disponibles: (libro: Libro) => number;
  enEspera: (isbn: string) => number;
  posicion: (isbn: string) => number | null;
  estadoReserva: (isbn: string) => EstadoReserva;
  simularReserva: (isbn: string) => ResultadoReserva;
  reservar: (isbn: string) => ResultadoReserva;
  devolver: (isbn: string) => Promise<void>;
  activarRecordatorio: (isbn: string) => Promise<void>;
  desactivarRecordatorio: (isbn: string) => Promise<void>;
  registrarVisto: (libro: Libro) => void;
  iniciarSesion: (usuario: string, clave: string) => boolean;
  cerrarSesion: () => void;
  entregarAlSiguiente: (isbn: string) => Promise<string | null>;
  descartarAviso: (id: string) => void;
};

export const BibliotecaContext = createContext<ValorBiblioteca | null>(null);

type Props = {
  children: ReactNode;
};

export function ProveedorBiblioteca({ children }: Props) {
  const [estado, despachar] = useReducer(reducirBiblioteca, undefined, crearEstadoInicial);
  const estadoActual = useRef(estado);
  const contadorAvisos = useRef(0);

  useEffect(() => {
    estadoActual.current = estado;
  }, [estado]);

  const agregarAviso = useCallback((mensaje: string) => {
    contadorAvisos.current += 1;
    despachar({
      tipo: 'agregar-aviso',
      aviso: { id: `aviso-${contadorAvisos.current}`, mensaje },
    });
  }, []);

  const descartarAviso = useCallback((id: string) => {
    despachar({ tipo: 'quitar-aviso', id });
  }, []);

  const simularReserva = useCallback(
    (isbn: string) => reservarLibro(estado, isbn, Date.now()).resultado,
    [estado],
  );

  const reservar = useCallback((isbn: string) => {
    const ahora = Date.now();
    const { resultado } = reservarLibro(estadoActual.current, isbn, ahora);
    if (resultado.tipo !== 'rechazada') {
      despachar({ tipo: 'reservar', isbn, ahora });
    }
    return resultado;
  }, []);

  const devolver = useCallback(async (isbn: string) => {
    const prestamo = estadoActual.current.prestamos.find((p) => p.isbn === isbn);
    despachar({ tipo: 'devolver', isbn });
    if (prestamo?.recordatorioId) {
      try {
        await cancelarRecordatorio(prestamo.recordatorioId);
      } catch {
        agregarAviso('No pudimos cancelar el recordatorio de ese libro.');
      }
    }
  }, [agregarAviso]);

  const activarRecordatorio = useCallback(async (isbn: string) => {
    const prestamo = estadoActual.current.prestamos.find((p) => p.isbn === isbn);
    const libro = buscarLibroPorIsbn(isbn);
    if (!prestamo || !libro || prestamo.recordatorioId !== null) {
      return;
    }
    try {
      const identificador = await programarRecordatorio(libro.titulo, prestamo.fechaDevolucion);
      const sigueVigente = estadoActual.current.prestamos.some(
        (p) => p.isbn === isbn && p.recordatorioId === null,
      );
      if (!sigueVigente) {
        await cancelarRecordatorio(identificador);
        return;
      }
      despachar({ tipo: 'guardar-recordatorio', isbn, recordatorioId: identificador });
    } catch {
      agregarAviso('No pudimos programar el recordatorio. Probá de nuevo en un momento.');
    }
  }, [agregarAviso]);

  const desactivarRecordatorio = useCallback(async (isbn: string) => {
    const prestamo = estadoActual.current.prestamos.find((p) => p.isbn === isbn);
    if (!prestamo || prestamo.recordatorioId === null) {
      return;
    }
    despachar({ tipo: 'guardar-recordatorio', isbn, recordatorioId: null });
    try {
      await cancelarRecordatorio(prestamo.recordatorioId);
    } catch {
      agregarAviso('No pudimos cancelar el recordatorio de ese libro.');
    }
  }, [agregarAviso]);

  const registrarVisto = useCallback((libro: Libro) => {
    despachar({ tipo: 'ver', libro });
  }, []);

  const iniciarSesion = useCallback((usuario: string, clave: string) => {
    const correcta = usuario.trim() === USUARIO_PERSONAL && clave === CLAVE_PERSONAL;
    if (correcta) {
      despachar({ tipo: 'cambiar-sesion', activa: true });
    }
    return correcta;
  }, []);

  const cerrarSesion = useCallback(() => {
    despachar({ tipo: 'cambiar-sesion', activa: false });
  }, []);

  const entregarAlSiguiente = useCallback(async (isbn: string) => {
    const ahora = Date.now();
    const { entregadoA } = calcularEntrega(estadoActual.current, isbn, ahora);
    if (entregadoA === null) {
      return null;
    }
    despachar({ tipo: 'entregar', isbn, ahora });
    if (entregadoA === NOMBRE_USUARIO) {
      const titulo = buscarLibroPorIsbn(isbn)?.titulo ?? 'tu libro';
      // Se consulta el permiso en este momento: un valor guardado podría estar viejo
      // si la persona cambió los ajustes del teléfono.
      const permiso = await consultarPermisoNotificaciones();
      if (permiso === 'concedido') {
        try {
          await enviarAvisoDeEntrega(titulo);
        } catch {
          agregarAviso(`Te entregaron "${titulo}" en el mostrador.`);
        }
      } else {
        agregarAviso(`Te entregaron "${titulo}" en el mostrador.`);
      }
    }
    return entregadoA;
  }, [agregarAviso]);

  const disponibles = useCallback((libro: Libro) => ejemplaresDisponibles(estado, libro), [estado]);
  const enEspera = useCallback((isbn: string) => personasEnEspera(estado, isbn), [estado]);
  const posicion = useCallback((isbn: string) => posicionEnEspera(estado, isbn), [estado]);
  const estadoReserva = useCallback((isbn: string) => estadoDeReserva(estado, isbn), [estado]);

  const vistosRecientemente = useMemo(
    () => estado.recientes.aArray().reverse().slice(0, MAX_RECIENTES),
    [estado.recientes],
  );

  const librosConEspera = useMemo(
    () =>
      LIBROS.flatMap((libro) => {
        const cola = estado.esperas[libro.isbn];
        return cola?.frente === undefined
          ? []
          : [{ libro, frente: cola.frente, cantidad: cola.tamanio }];
      }),
    [estado.esperas],
  );

  const misEsperas = useMemo(
    () =>
      LIBROS.flatMap((libro) => {
        const lugar = posicionEnEspera(estado, libro.isbn);
        return lugar === null
          ? []
          : [{ libro, posicion: lugar, total: personasEnEspera(estado, libro.isbn) }];
      }),
    [estado],
  );

  const valor = useMemo<ValorBiblioteca>(
    () => ({
      prestamos: estado.prestamos,
      vistosRecientemente,
      esPersonal: estado.esPersonal,
      avisos: estado.avisos,
      librosConEspera,
      misEsperas,
      disponibles,
      enEspera,
      posicion,
      estadoReserva,
      simularReserva,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      registrarVisto,
      iniciarSesion,
      cerrarSesion,
      entregarAlSiguiente,
      descartarAviso,
    }),
    [
      estado.prestamos,
      estado.esPersonal,
      estado.avisos,
      vistosRecientemente,
      librosConEspera,
      misEsperas,
      disponibles,
      enEspera,
      posicion,
      estadoReserva,
      simularReserva,
      reservar,
      devolver,
      activarRecordatorio,
      desactivarRecordatorio,
      registrarVisto,
      iniciarSesion,
      cerrarSesion,
      entregarAlSiguiente,
      descartarAviso,
    ],
  );

  return <BibliotecaContext.Provider value={valor}>{children}</BibliotecaContext.Provider>;
}
