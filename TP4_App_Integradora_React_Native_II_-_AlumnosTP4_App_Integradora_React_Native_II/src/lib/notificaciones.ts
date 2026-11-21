import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import {
  CANAL_PRESTAMOS,
  DIAS_ANTES_RECORDATORIO,
  DIAS_PRESTAMO,
  MODO_DEMOSTRACION,
  MS_POR_DIA,
  SEGUNDOS_RECORDATORIO_DEMO,
} from '../constants/config';
import type { EstadoPermiso } from '../types';
import { normalizarPermiso } from './permisos';

export function configurarNotificaciones(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

// En Android 13 o superior el canal tiene que existir antes de pedir el permiso.
export async function crearCanalPrestamos(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  await Notifications.setNotificationChannelAsync(CANAL_PRESTAMOS, {
    name: 'Préstamos y devoluciones',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function consultarPermisoNotificaciones(): Promise<EstadoPermiso> {
  return normalizarPermiso(await Notifications.getPermissionsAsync());
}

export async function pedirPermisoNotificaciones(): Promise<EstadoPermiso> {
  await crearCanalPrestamos();
  return normalizarPermiso(await Notifications.requestPermissionsAsync());
}

export async function programarRecordatorio(
  titulo: string,
  fechaDevolucion: number,
): Promise<string> {
  const trigger: Notifications.NotificationTriggerInput = MODO_DEMOSTRACION
    ? {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: SEGUNDOS_RECORDATORIO_DEMO,
        channelId: CANAL_PRESTAMOS,
      }
    : {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: fechaDevolucion - DIAS_ANTES_RECORDATORIO * MS_POR_DIA,
        channelId: CANAL_PRESTAMOS,
      };
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de devolución',
      body: `Se acerca la fecha de devolución de "${titulo}". Acordate de devolverlo.`,
    },
    trigger,
  });
}

export async function cancelarRecordatorio(identificador: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(identificador);
}

export async function enviarAvisoDeEntrega(titulo: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Tu libro está listo',
      body: `Te entregaron "${titulo}" en el mostrador. Tenés ${DIAS_PRESTAMO} días para devolverlo.`,
    },
    trigger: { channelId: CANAL_PRESTAMOS },
  });
}
