import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

import {
  consultarPermiso,
  solicitarPermiso,
  type InfoPermiso,
} from '@/lib/permisos';
import {
  establecerPermisoSimulado,
  obtenerPermisoSimulado,
  suscribirCambioPermisos,
} from '@/lib/store';
import type { EstadoPermiso, RecursoPermiso } from '@/lib/tipos';

export interface ResultadoPermiso {
  estado: EstadoPermiso;
  parcial: boolean;
  matiz?: string;
  pedir: () => Promise<EstadoPermiso>;
  abrirAjustes: () => Promise<void>;
}

export function usePermiso(recurso: RecursoPermiso): ResultadoPermiso {
  const [info, setInfo] = useState<InfoPermiso>(() => {
    const simulado = obtenerPermisoSimulado(recurso);
    return simulado
      ? { estado: simulado, parcial: false }
      : { estado: 'cargando', parcial: false };
  });

  const actualizar = useCallback(() => {
    const simulado = obtenerPermisoSimulado(recurso);
    if (simulado) {
      setInfo({ estado: simulado, parcial: false });
      return;
    }
    consultarPermiso(recurso).then(setInfo);
  }, [recurso]);

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      const simulado = obtenerPermisoSimulado(recurso);
      if (simulado) {
        if (activo) setInfo({ estado: simulado, parcial: false });
      } else {
        consultarPermiso(recurso).then((resultado) => {
          if (activo) setInfo(resultado);
        });
      }
      return () => {
        activo = false;
      };
    }, [recurso]),
  );

  useEffect(() => {
    return suscribirCambioPermisos(actualizar);
  }, [actualizar]);

  useEffect(() => {
    let anterior = AppState.currentState;
    const suscripcion = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior === 'background' || anterior === 'inactive';
      anterior = nuevo;
      if (estabaAfuera && nuevo === 'active') {
        actualizar();
      }
    });
    return () => suscripcion.remove();
  }, [actualizar]);

  const pedir = useCallback(async () => {
    establecerPermisoSimulado(recurso, undefined);
    const resultado = await solicitarPermiso(recurso);
    setInfo(resultado);
    return resultado.estado;
  }, [recurso]);

  const abrirAjustes = useCallback(() => Linking.openSettings(), []);

  return {
    estado: info.estado,
    parcial: info.parcial,
    matiz: info.matiz,
    pedir,
    abrirAjustes,
  };
}
