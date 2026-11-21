import { NOMBRE_USUARIO } from '../constants/config';
import {
  crearEstadoInicial,
  devolverLibro,
  ejemplaresDisponibles,
  entregarAlSiguiente,
  estadoDeReserva,
  posicionEnEspera,
  registrarVisto,
  reservarLibro,
} from '../lib/biblioteca';
import { buscarLibroPorIsbn } from '../lib/catalogo';

const CON_EJEMPLARES = '9789505001002'; // El Principito: 5 ejemplares
const SIN_EJEMPLARES_Y_CON_ESPERA = '9789505003747'; // Rayuela: 0 ejemplares, 2 personas esperando
const SIN_EJEMPLARES_Y_SIN_ESPERA = '9789505006489'; // Cien años de soledad: 0 ejemplares
const AHORA = 1_700_000_000_000;

function libro(isbn: string) {
  const encontrado = buscarLibroPorIsbn(isbn);
  if (!encontrado) {
    throw new Error(`Falta el libro ${isbn} en los datos de prueba`);
  }
  return encontrado;
}

describe('reservarLibro', () => {
  it('presta el libro por 7 días si hay ejemplares', () => {
    const { estado, resultado } = reservarLibro(crearEstadoInicial(), CON_EJEMPLARES, AHORA);
    expect(resultado).toEqual({ tipo: 'prestamo', fechaDevolucion: AHORA + 7 * 24 * 60 * 60 * 1000 });
    expect(estadoDeReserva(estado, CON_EJEMPLARES)).toBe('prestado');
    expect(ejemplaresDisponibles(estado, libro(CON_EJEMPLARES))).toBe(4);
  });

  it('encola a la persona al final si no hay ejemplares y muestra su posición', () => {
    const { estado, resultado } = reservarLibro(
      crearEstadoInicial(),
      SIN_EJEMPLARES_Y_CON_ESPERA,
      AHORA,
    );
    expect(resultado).toEqual({ tipo: 'espera', posicion: 3 });
    expect(posicionEnEspera(estado, SIN_EJEMPLARES_Y_CON_ESPERA)).toBe(3);
  });

  it('no permite reservar dos veces el mismo libro', () => {
    const primera = reservarLibro(crearEstadoInicial(), CON_EJEMPLARES, AHORA);
    const segunda = reservarLibro(primera.estado, CON_EJEMPLARES, AHORA);
    expect(segunda.resultado).toEqual({ tipo: 'rechazada', motivo: 'ya-reservado' });
    expect(segunda.estado).toBe(primera.estado);
  });

  it('rechaza un ISBN que no existe', () => {
    const { resultado } = reservarLibro(crearEstadoInicial(), '0000000000000', AHORA);
    expect(resultado).toEqual({ tipo: 'rechazada', motivo: 'no-existe' });
  });

  it('no modifica el estado anterior: devuelve colas nuevas', () => {
    const inicial = crearEstadoInicial();
    const { estado } = reservarLibro(inicial, SIN_EJEMPLARES_Y_CON_ESPERA, AHORA);
    expect(inicial.esperas[SIN_EJEMPLARES_Y_CON_ESPERA]?.tamanio).toBe(2);
    expect(estado.esperas[SIN_EJEMPLARES_Y_CON_ESPERA]).not.toBe(
      inicial.esperas[SIN_EJEMPLARES_Y_CON_ESPERA],
    );
  });
});

describe('devolverLibro', () => {
  it('libera el ejemplar', () => {
    const prestado = reservarLibro(crearEstadoInicial(), CON_EJEMPLARES, AHORA).estado;
    const devuelto = devolverLibro(prestado, CON_EJEMPLARES);
    expect(estadoDeReserva(devuelto, CON_EJEMPLARES)).toBe('ninguna');
    expect(ejemplaresDisponibles(devuelto, libro(CON_EJEMPLARES))).toBe(5);
  });
});

describe('entregarAlSiguiente', () => {
  it('desencola a la persona del frente', () => {
    const { estado, entregadoA } = entregarAlSiguiente(
      crearEstadoInicial(),
      SIN_EJEMPLARES_Y_CON_ESPERA,
      AHORA,
    );
    expect(entregadoA).toBe('Marcos Díaz');
    expect(estado.esperas[SIN_EJEMPLARES_Y_CON_ESPERA]?.tamanio).toBe(1);
  });

  it('no hace nada con la lista de espera vacía', () => {
    const inicial = crearEstadoInicial();
    const { estado, entregadoA } = entregarAlSiguiente(inicial, SIN_EJEMPLARES_Y_SIN_ESPERA, AHORA);
    expect(entregadoA).toBeNull();
    expect(estado).toBe(inicial);
  });

  it('si la persona sos vos, se convierte en préstamo y la posición avanza', () => {
    let estado = reservarLibro(crearEstadoInicial(), SIN_EJEMPLARES_Y_CON_ESPERA, AHORA).estado;
    estado = entregarAlSiguiente(estado, SIN_EJEMPLARES_Y_CON_ESPERA, AHORA).estado;
    expect(posicionEnEspera(estado, SIN_EJEMPLARES_Y_CON_ESPERA)).toBe(2);
    const ultimo = entregarAlSiguiente(estado, SIN_EJEMPLARES_Y_CON_ESPERA, AHORA);
    expect(ultimo.entregadoA).toBe('Lucía Fernández');
    const tuyo = entregarAlSiguiente(ultimo.estado, SIN_EJEMPLARES_Y_CON_ESPERA, AHORA);
    expect(tuyo.entregadoA).toBe(NOMBRE_USUARIO);
    expect(estadoDeReserva(tuyo.estado, SIN_EJEMPLARES_Y_CON_ESPERA)).toBe('prestado');
    expect(ejemplaresDisponibles(tuyo.estado, libro(SIN_EJEMPLARES_Y_CON_ESPERA))).toBe(0);
  });

  it('al devolver un libro entregado por el mostrador, el ejemplar vuelve al estante', () => {
    let estado = reservarLibro(crearEstadoInicial(), SIN_EJEMPLARES_Y_SIN_ESPERA, AHORA).estado;
    estado = entregarAlSiguiente(estado, SIN_EJEMPLARES_Y_SIN_ESPERA, AHORA).estado;
    estado = devolverLibro(estado, SIN_EJEMPLARES_Y_SIN_ESPERA);
    expect(ejemplaresDisponibles(estado, libro(SIN_EJEMPLARES_Y_SIN_ESPERA))).toBe(1);
  });
});

describe('registrarVisto', () => {
  it('no apila de nuevo el libro que ya está en el tope', () => {
    const principito = libro(CON_EJEMPLARES);
    const una = registrarVisto(crearEstadoInicial(), principito);
    const dos = registrarVisto(una, principito);
    expect(dos).toBe(una);
    expect(dos.recientes.tamanio).toBe(1);
  });

  it('apila libros distintos', () => {
    let estado = registrarVisto(crearEstadoInicial(), libro(CON_EJEMPLARES));
    estado = registrarVisto(estado, libro(SIN_EJEMPLARES_Y_CON_ESPERA));
    expect(estado.recientes.aArray().map((l) => l.isbn)).toEqual([
      CON_EJEMPLARES,
      SIN_EJEMPLARES_Y_CON_ESPERA,
    ]);
  });
});
