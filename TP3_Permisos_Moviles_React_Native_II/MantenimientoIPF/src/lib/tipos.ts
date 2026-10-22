export type EstadoReporte = 'pendiente' | 'en_curso' | 'resuelto';

export type CategoriaReporte =
  | 'electricidad'
  | 'agua'
  | 'mobiliario'
  | 'equipos';

export type Sector =
  | 'aula'
  | 'patio'
  | 'estacionamiento'
  | 'pasillo'
  | 'baño'
  | 'otro';

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  sector?: Sector;
  fotoUri?: string;
  coordenadas?: { latitud: number; longitud: number };
  ubicacionAproximada?: boolean;
  estado: EstadoReporte;
  creadoEn: string;
  actualizadoEn: string;
}

export type RecursoPermiso = 'camara' | 'ubicacion' | 'notificaciones';

export type EstadoPermiso =
  | 'cargando'
  | 'concedido'
  | 'preguntable'
  | 'bloqueado';

export interface Aviso {
  id: string;
  reporteId: string;
  mensaje: string;
  leido: boolean;
  creadoEn: string;
}
