import { useCameraPermissions } from 'expo-camera';
import { useCallback, useState } from 'react';

import { consultarPermisoNotificaciones, pedirPermisoNotificaciones } from '../lib/notificaciones';
import { abrirAjustes, normalizarPermiso } from '../lib/permisos';
import type { EstadoPermiso, RecursoPermiso } from '../types';
import { useRefrescoAlVolver } from './useRefrescoAlVolver';

export type UsoPermiso = {
  estado: EstadoPermiso;
  pedir: () => Promise<EstadoPermiso>;
  abrirAjustes: () => Promise<void>;
};

function usePermisoCamara(): UsoPermiso {
  const [permiso, solicitar, consultar] = useCameraPermissions();
  useRefrescoAlVolver(consultar);

  const pedir = useCallback(async () => normalizarPermiso(await solicitar()), [solicitar]);
  return { estado: normalizarPermiso(permiso), pedir, abrirAjustes };
}

function usePermisoNotificaciones(): UsoPermiso {
  const [estado, setEstado] = useState<EstadoPermiso>('cargando');

  const consultar = useCallback(async () => {
    setEstado(await consultarPermisoNotificaciones());
  }, []);
  useRefrescoAlVolver(consultar);

  const pedir = useCallback(async () => {
    const nuevoEstado = await pedirPermisoNotificaciones();
    setEstado(nuevoEstado);
    return nuevoEstado;
  }, []);
  return { estado, pedir, abrirAjustes };
}

export function usePermiso(recurso: RecursoPermiso): UsoPermiso {
  const camara = usePermisoCamara();
  const notificaciones = usePermisoNotificaciones();
  return recurso === 'camara' ? camara : notificaciones;
}
