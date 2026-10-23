import type {
  Aviso,
  CategoriaReporte,
  EstadoPermiso,
  RecursoPermiso,
  Reporte,
  Sector,
} from './tipos';

let reportes: Reporte[] = [
  {
    id: '1',
    titulo: 'Luz quemada en pasillo',
    descripcion: 'La luz del pasillo principal está apagada desde ayer.',
    aula: 'Pasillo principal',
    categoria: 'electricidad',
    sector: 'pasillo',
    estado: 'pendiente',
    creadoEn: new Date(Date.now() - 86400000).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    titulo: 'Canilla que pierde en baño',
    descripcion: 'La canilla del baño de planta baja gotea constantemente.',
    aula: 'Baño PB',
    categoria: 'agua',
    sector: 'baño',
    estado: 'en_curso',
    creadoEn: new Date(Date.now() - 172800000).toISOString(),
    actualizadoEn: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    titulo: 'Proyector del aula 3 sin imagen',
    descripcion: 'El proyector enciende pero no muestra imagen.',
    aula: 'Aula 3',
    categoria: 'equipos',
    estado: 'resuelto',
    creadoEn: new Date(Date.now() - 604800000).toISOString(),
    actualizadoEn: new Date(Date.now() - 86400000).toISOString(),
  },
];

let avisos: Aviso[] = [
  {
    id: 'a1',
    reporteId: '3',
    mensaje: 'Tu reporte "Proyector del aula 3 sin imagen" fue resuelto.',
    leido: false,
    creadoEn: new Date(Date.now() - 86400000).toISOString(),
  },
];

let siguienteId = 4;
let siguienteAviso = 2;
let notificacionesPreferidas = true;

export interface BorradorReporte {
  aula?: string;
  sector?: Sector;
  fotoUri?: string;
  coordenadas?: { latitud: number; longitud: number };
  ubicacionAproximada?: boolean;
}

let borrador: BorradorReporte = {};

export function obtenerBorrador(): BorradorReporte {
  return borrador;
}

export function actualizarBorrador(parcial: Partial<BorradorReporte>): BorradorReporte {
  borrador = { ...borrador, ...parcial };
  return borrador;
}

export function limpiarBorrador(): void {
  borrador = {};
}

export function obtenerPreferenciaNotificaciones(): boolean {
  return notificacionesPreferidas;
}

export function establecerPreferenciaNotificaciones(valor: boolean): void {
  notificacionesPreferidas = valor;
}

export function obtenerReportes(): Reporte[] {
  return [...reportes];
}

export function obtenerReportePorId(id: string): Reporte | undefined {
  return reportes.find((r) => r.id === id);
}

export interface NuevoReportePayload {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  sector?: Sector;
  fotoUri?: string;
  coordenadas?: { latitud: number; longitud: number };
  ubicacionAproximada?: boolean;
}

export function crearReporte(payload: NuevoReportePayload): Reporte {
  const ahora = new Date().toISOString();
  const nuevo: Reporte = {
    id: String(siguienteId++),
    estado: 'pendiente',
    creadoEn: ahora,
    actualizadoEn: ahora,
    ...payload,
  };
  reportes = [nuevo, ...reportes];
  return nuevo;
}

export function resolverReporte(id: string): Reporte | undefined {
  const idx = reportes.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;

  const actualizado: Reporte = {
    ...reportes[idx],
    estado: 'resuelto',
    actualizadoEn: new Date().toISOString(),
  };
  reportes = [...reportes.slice(0, idx), actualizado, ...reportes.slice(idx + 1)];
  return actualizado;
}

export function agregarAviso(reporteId: string, mensaje: string): Aviso {
  const aviso: Aviso = {
    id: `a${siguienteAviso++}`,
    reporteId,
    mensaje,
    leido: false,
    creadoEn: new Date().toISOString(),
  };
  avisos = [aviso, ...avisos];
  return aviso;
}

export function obtenerAvisos(): Aviso[] {
  return [...avisos];
}

export function marcarAvisoLeido(id: string): void {
  avisos = avisos.map((a) => (a.id === id ? { ...a, leido: true } : a));
}

export function contarAvisosNoLeidos(): number {
  return avisos.filter((a) => !a.leido).length;
}

type ListenerPermisos = () => void;
const listenersPermisos = new Set<ListenerPermisos>();

let permisosSimulados: Partial<Record<RecursoPermiso, EstadoPermiso>> = {};

export function suscribirCambioPermisos(fn: ListenerPermisos): () => void {
  listenersPermisos.add(fn);
  return () => {
    listenersPermisos.delete(fn);
  };
}

function notificarCambioPermisos(): void {
  listenersPermisos.forEach((fn) => fn());
}

export function obtenerPermisoSimulado(recurso: RecursoPermiso): EstadoPermiso | undefined {
  return permisosSimulados[recurso];
}

export function hayPermisosSimulados(): boolean {
  return Object.keys(permisosSimulados).length > 0;
}

export function establecerPermisoSimulado(
  recurso: RecursoPermiso,
  estado: EstadoPermiso | undefined,
): void {
  if (estado === undefined) {
    delete permisosSimulados[recurso];
  } else {
    permisosSimulados[recurso] = estado;
  }
  notificarCambioPermisos();
}

export function reiniciarPermisosSimulados(): void {
  permisosSimulados = {
    camara: 'preguntable',
    ubicacion: 'preguntable',
    notificaciones: 'preguntable',
  };
  notificarCambioPermisos();
}

export function limpiarSimulacionPermisos(): void {
  permisosSimulados = {};
  notificarCambioPermisos();
}
