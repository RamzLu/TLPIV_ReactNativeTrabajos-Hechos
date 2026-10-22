import * as Notifications from 'expo-notifications';
import {
  AndroidImportance,
  SchedulableTriggerInputTypes,
} from 'expo-notifications';
import { Platform } from 'react-native';

import { agregarAviso, obtenerPreferenciaNotificaciones } from './store';
import type { Reporte } from './tipos';

export const CANAL_REPORTES = 'reportes';

export function configurarNotificaciones(): void {
  if (Platform.OS === 'web') return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function crearCanalReportes(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CANAL_REPORTES, {
    name: 'Reportes resueltos',
    description: 'Avisos cuando se resuelve un reporte de mantenimiento.',
    importance: AndroidImportance.HIGH,
  });
}

export async function avisarResolucion(
  reporte: Reporte,
): Promise<'notificacion' | 'bandeja'> {
  const mensaje = `Tu reporte "${reporte.titulo}" fue resuelto.`;
  const permiso = await Notifications.getPermissionsAsync();

  if (permiso.granted && obtenerPreferenciaNotificaciones()) {
    await crearCanalReportes();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Reporte resuelto', body: mensaje },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        channelId: CANAL_REPORTES,
      },
    });
    return 'notificacion';
  }

  agregarAviso(reporte.id, mensaje);
  return 'bandeja';
}
