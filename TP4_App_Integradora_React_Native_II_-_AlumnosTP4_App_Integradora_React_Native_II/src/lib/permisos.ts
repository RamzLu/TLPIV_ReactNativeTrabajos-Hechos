import type { PermissionResponse } from 'expo';
import { Linking } from 'react-native';

import type { EstadoPermiso } from '../types';

// Mirar solo `status` no alcanza: "denied" puede ser "todavía se puede preguntar"
// (Android, primera negativa) o "bloqueado" (ya no aparece el diálogo del sistema).
export function normalizarPermiso(respuesta: PermissionResponse | null): EstadoPermiso {
  if (respuesta === null) {
    return 'cargando';
  }
  if (respuesta.granted) {
    return 'concedido';
  }
  return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
}

export async function abrirAjustes(): Promise<void> {
  await Linking.openSettings();
}
