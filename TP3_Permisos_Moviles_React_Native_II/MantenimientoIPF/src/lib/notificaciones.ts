import * as Notifications from 'expo-notifications';
import {
  AndroidImportance,
  SchedulableTriggerInputTypes,
} from 'expo-notifications';
import { Platform } from 'react-native';

import {
  agregarAviso,
  obtenerPermisoSimulado,
  obtenerPreferenciaNotificaciones,
} from './store';
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
  const simulado = obtenerPermisoSimulado('notificaciones');
  const tienePermiso = simulado
    ? simulado === 'concedido'
    : (await Notifications.getPermissionsAsync()).granted;

  if (tienePermiso && obtenerPreferenciaNotificaciones()) {
    if (Platform.OS === 'web') {
      if (
        typeof window !== 'undefined' &&
        'Notification' in window &&
        window.Notification.permission === 'granted'
      ) {
        setTimeout(() => {
          try {
            new window.Notification('Reporte resuelto', { body: mensaje });
          } catch {
            agregarAviso(reporte.id, mensaje);
          }
        }, 10_000);
        return 'notificacion';
      }
      agregarAviso(reporte.id, mensaje);
      return 'bandeja';
    }

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
