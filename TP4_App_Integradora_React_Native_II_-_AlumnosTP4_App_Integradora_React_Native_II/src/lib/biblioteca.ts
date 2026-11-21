import { DIAS_PRESTAMO, MS_POR_DIA, NOMBRE_USUARIO } from '../constants/config';
import { ESPERA_INICIAL } from '../data/libros';
import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';
import type { Aviso, EstadoReserva, Libro, Prestamo, ResultadoReserva } from '../types';
import { buscarLibroPorIsbn } from './catalogo';

export type EstadoBiblioteca = {
  prestamos: Prestamo[];
  esperas: Record<string, Cola<string>>;
  recientes: Pila<Libro>;
  // Corrige los ejemplares cuando el mostrador entrega libros que no salieron de mis préstamos.
  ajusteEjemplares: Record<string, number>;
  esPersonal: boolean;
  avisos: Aviso[];
};

export function crearEstadoInicial(): EstadoBiblioteca {
  const esperas: Record<string, Cola<string>> = {};
  for (const [isbn, personas] of Object.entries(ESPERA_INICIAL)) {
    esperas[isbn] = Cola.desde(personas);
  }
  return {
    prestamos: [],
    esperas,
    recientes: new Pila<Libro>(),
    ajusteEjemplares: {},
    esPersonal: false,
    avisos: [],
  };
}

export function ejemplaresDisponibles(estado: EstadoBiblioteca, libro: Libro): number {
  const mios = estado.prestamos.filter((p) => p.isbn === libro.isbn).length;
  const ajuste = estado.ajusteEjemplares[libro.isbn] ?? 0;
  return Math.max(0, libro.ejemplares + ajuste - mios);
}

export function personasEnEspera(estado: EstadoBiblioteca, isbn: string): number {
  return estado.esperas[isbn]?.tamanio ?? 0;
}

export function posicionEnEspera(estado: EstadoBiblioteca, isbn: string): number | null {
  const indice = estado.esperas[isbn]?.aArray().indexOf(NOMBRE_USUARIO) ?? -1;
  return indice === -1 ? null : indice + 1;
}

export function estadoDeReserva(estado: EstadoBiblioteca, isbn: string): EstadoReserva {
  if (estado.prestamos.some((p) => p.isbn === isbn)) {
    return 'prestado';
  }
  return posicionEnEspera(estado, isbn) === null ? 'ninguna' : 'en-espera';
}

function nuevoPrestamo(isbn: string, ahora: number): Prestamo {
  return {
    isbn,
    fechaDevolucion: ahora + DIAS_PRESTAMO * MS_POR_DIA,
    recordatorioId: null,
  };
}

function copiarEsperaConPersona(estado: EstadoBiblioteca, isbn: string): Cola<string> {
  const copia = Cola.desde(estado.esperas[isbn]?.aArray() ?? []);
  copia.encolar(NOMBRE_USUARIO);
  return copia;
}

export function reservarLibro(
  estado: EstadoBiblioteca,
  isbn: string,
  ahora: number,
): { estado: EstadoBiblioteca; resultado: ResultadoReserva } {
  const libro = buscarLibroPorIsbn(isbn);
  if (!libro) {
    return { estado, resultado: { tipo: 'rechazada', motivo: 'no-existe' } };
  }
  if (estadoDeReserva(estado, isbn) !== 'ninguna') {
    return { estado, resultado: { tipo: 'rechazada', motivo: 'ya-reservado' } };
  }
  if (ejemplaresDisponibles(estado, libro) > 0 && personasEnEspera(estado, isbn) === 0) {
    const prestamo = nuevoPrestamo(isbn, ahora);
    return {
      estado: { ...estado, prestamos: [...estado.prestamos, prestamo] },
      resultado: { tipo: 'prestamo', fechaDevolucion: prestamo.fechaDevolucion },
    };
  }
  const espera = copiarEsperaConPersona(estado, isbn);
  return {
    estado: { ...estado, esperas: { ...estado.esperas, [isbn]: espera } },
    resultado: { tipo: 'espera', posicion: espera.tamanio },
  };
}

export function devolverLibro(estado: EstadoBiblioteca, isbn: string): EstadoBiblioteca {
  return { ...estado, prestamos: estado.prestamos.filter((p) => p.isbn !== isbn) };
}

export function guardarRecordatorio(
  estado: EstadoBiblioteca,
  isbn: string,
  recordatorioId: string | null,
): EstadoBiblioteca {
  return {
    ...estado,
    prestamos: estado.prestamos.map((p) => (p.isbn === isbn ? { ...p, recordatorioId } : p)),
  };
}

export function entregarAlSiguiente(
  estado: EstadoBiblioteca,
  isbn: string,
  ahora: number,
): { estado: EstadoBiblioteca; entregadoA: string | null } {
  const libro = buscarLibroPorIsbn(isbn);
  const espera = estado.esperas[isbn];
  if (!libro || !espera || espera.estaVacia()) {
    return { estado, entregadoA: null };
  }
  const copia = Cola.desde(espera.aArray());
  const persona = copia.desencolar() ?? null;
  const habiaEjemplarLibre = ejemplaresDisponibles(estado, libro) > 0;
  const ajuste = estado.ajusteEjemplares[isbn] ?? 0;
  const esperas = { ...estado.esperas, [isbn]: copia };

  if (persona === NOMBRE_USUARIO) {
    const yaLoTengo = estado.prestamos.some((p) => p.isbn === isbn);
    return {
      estado: {
        ...estado,
        esperas,
        prestamos: yaLoTengo ? estado.prestamos : [...estado.prestamos, nuevoPrestamo(isbn, ahora)],
        ajusteEjemplares: habiaEjemplarLibre
          ? estado.ajusteEjemplares
          : { ...estado.ajusteEjemplares, [isbn]: ajuste + 1 },
      },
      entregadoA: persona,
    };
  }
  return {
    estado: {
      ...estado,
      esperas,
      ajusteEjemplares: habiaEjemplarLibre
        ? { ...estado.ajusteEjemplares, [isbn]: ajuste - 1 }
        : estado.ajusteEjemplares,
    },
    entregadoA: persona,
  };
}

export function registrarVisto(estado: EstadoBiblioteca, libro: Libro): EstadoBiblioteca {
  if (estado.recientes.tope?.isbn === libro.isbn) {
    return estado;
  }
  const pila = Pila.desde(estado.recientes.aArray());
  pila.apilar(libro);
  return { ...estado, recientes: pila };
}

export type Accion =
  | { tipo: 'reservar'; isbn: string; ahora: number }
  | { tipo: 'devolver'; isbn: string }
  | { tipo: 'guardar-recordatorio'; isbn: string; recordatorioId: string | null }
  | { tipo: 'entregar'; isbn: string; ahora: number }
  | { tipo: 'ver'; libro: Libro }
  | { tipo: 'cambiar-sesion'; activa: boolean }
  | { tipo: 'agregar-aviso'; aviso: Aviso }
  | { tipo: 'quitar-aviso'; id: string };

// Reducer puro: cada acción devuelve un estado nuevo (con colas y pilas nuevas),
// así React siempre detecta el cambio y vuelve a renderizar.
export function reducirBiblioteca(estado: EstadoBiblioteca, accion: Accion): EstadoBiblioteca {
  switch (accion.tipo) {
    case 'reservar':
      return reservarLibro(estado, accion.isbn, accion.ahora).estado;
    case 'devolver':
      return devolverLibro(estado, accion.isbn);
    case 'guardar-recordatorio':
      return guardarRecordatorio(estado, accion.isbn, accion.recordatorioId);
    case 'entregar':
      return entregarAlSiguiente(estado, accion.isbn, accion.ahora).estado;
    case 'ver':
      return registrarVisto(estado, accion.libro);
    case 'cambiar-sesion':
      return { ...estado, esPersonal: accion.activa };
    case 'agregar-aviso':
      return { ...estado, avisos: [...estado.avisos, accion.aviso] };
    case 'quitar-aviso':
      return { ...estado, avisos: estado.avisos.filter((a) => a.id !== accion.id) };
  }
}
