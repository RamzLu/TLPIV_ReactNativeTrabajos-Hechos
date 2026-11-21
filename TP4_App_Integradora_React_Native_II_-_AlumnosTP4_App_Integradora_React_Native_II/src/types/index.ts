export type Libro = {
  isbn: string; // 13 dígitos, sin guiones
  titulo: string;
  autor: string;
  anio: number;
  ejemplares: number; // ejemplares en el estante al iniciar la app
};

export type Prestamo = {
  isbn: string;
  fechaDevolucion: number;
  recordatorioId: string | null;
};

export type Aviso = {
  id: string;
  mensaje: string;
};

export type RecursoPermiso = 'camara' | 'notificaciones';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export type EstadoReserva = 'ninguna' | 'prestado' | 'en-espera';

export type ResultadoReserva =
  | { tipo: 'prestamo'; fechaDevolucion: number }
  | { tipo: 'espera'; posicion: number }
  | { tipo: 'rechazada'; motivo: 'ya-reservado' | 'no-existe' };
