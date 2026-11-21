import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import type { RecursoPermiso } from '../types';

type TextosPermiso = {
  icono: ComponentProps<typeof Ionicons>['name'];
  titulo: string;
  beneficio: string;
};

export const RECURSOS_PERMISO: RecursoPermiso[] = ['camara', 'notificaciones'];

export const TEXTOS_PERMISO: Record<RecursoPermiso, TextosPermiso> = {
  camara: {
    icono: 'camera-outline',
    titulo: 'Usar la cámara',
    beneficio: 'Usamos tu cámara para leer el código de barras del libro y abrirlo al instante.',
  },
  notificaciones: {
    icono: 'notifications-outline',
    titulo: 'Recibir recordatorios',
    beneficio: 'Usamos las notificaciones para avisarte antes de que venza la devolución de tu libro.',
  },
};
