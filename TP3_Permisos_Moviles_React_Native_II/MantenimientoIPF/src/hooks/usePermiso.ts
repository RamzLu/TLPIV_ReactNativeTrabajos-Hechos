import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking } from 'react-native';

import {
  consultarPermiso,
  solicitarPermiso,
  type InfoPermiso,
} from '@/lib/permisos';
import type { EstadoPermiso, RecursoPermiso } from '@/lib/tipos';

export interface ResultadoPermiso {
  estado: EstadoPermiso;
  parcial: boolean;
  matiz?: string;
  pedir: () => Promise<EstadoPermiso>;
  abrirAjustes: () => Promise<void>;
}

export function usePermiso(recurso: RecursoPermiso): ResultadoPermiso {
  const [info, setInfo] = useState<InfoPermiso>({ estado: 'cargando', parcial: false });

  useFocusEffect(
    useCallback(() => {
      let activo = true;
      consultarPermiso(recurso).then((resultado) => {
        if (activo) setInfo(resultado);
      });
      return () => {
        activo = false;
      };
    }, [recurso]),
  );

  useEffect(() => {
    let anterior = AppState.currentState;
    const suscripcion = AppState.addEventListener('change', (nuevo) => {
      const estabaAfuera = anterior === 'background' || anterior === 'inactive';
      anterior = nuevo;
      if (estabaAfuera && nuevo === 'active') {
        consultarPermiso(recurso).then(setInfo);
      }
    });
    return () => suscripcion.remove();
  }, [recurso]);

  const pedir = useCallback(async () => {
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
