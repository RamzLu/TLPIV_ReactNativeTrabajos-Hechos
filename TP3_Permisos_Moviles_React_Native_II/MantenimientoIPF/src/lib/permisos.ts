import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { IosAuthorizationStatus } from 'expo-notifications';

import { crearCanalReportes } from './notificaciones';
import type { EstadoPermiso, RecursoPermiso } from './tipos';

export interface InfoPermiso {
  estado: EstadoPermiso;
  parcial: boolean;
  matiz?: string;
}

function resolverEstado(granted: boolean, canAskAgain: boolean): EstadoPermiso {
  if (granted) return 'concedido';
  return canAskAgain ? 'preguntable' : 'bloqueado';
}

function infoUbicacion(res: Location.LocationPermissionResponse): InfoPermiso {
  const estado = resolverEstado(res.granted, res.canAskAgain);
  if (estado !== 'concedido') return { estado, parcial: false };

  const aproximada =
    res.ios?.accuracy === 'reduced' || res.android?.accuracy === 'coarse';
  return {
    estado,
    parcial: aproximada,
    matiz: aproximada
      ? 'accuracy: ubicación aproximada'
      : 'accuracy: ubicación precisa',
  };
}

function infoNotificaciones(
  res: Notifications.NotificationPermissionsStatus,
): InfoPermiso {
  const estado = resolverEstado(res.granted, res.canAskAgain);
  const provisional = res.ios?.status === IosAuthorizationStatus.PROVISIONAL;
  return {
    estado,
    parcial: estado === 'concedido' && provisional,
    matiz:
      estado === 'concedido' && provisional ? 'Autorización provisional' : undefined,
  };
}

export async function consultarPermiso(recurso: RecursoPermiso): Promise<InfoPermiso> {
  switch (recurso) {
    case 'camara': {
      const res = await Camera.getCameraPermissionsAsync();
      return { estado: resolverEstado(res.granted, res.canAskAgain), parcial: false };
    }
    case 'ubicacion':
      return infoUbicacion(await Location.getForegroundPermissionsAsync());
    case 'notificaciones':
      return infoNotificaciones(await Notifications.getPermissionsAsync());
  }
}

export async function solicitarPermiso(recurso: RecursoPermiso): Promise<InfoPermiso> {
  switch (recurso) {
    case 'camara': {
      const res = await Camera.requestCameraPermissionsAsync();
      return { estado: resolverEstado(res.granted, res.canAskAgain), parcial: false };
    }
    case 'ubicacion':
      return infoUbicacion(await Location.requestForegroundPermissionsAsync());
    case 'notificaciones':
      await crearCanalReportes();
      return infoNotificaciones(await Notifications.requestPermissionsAsync());
  }
}
