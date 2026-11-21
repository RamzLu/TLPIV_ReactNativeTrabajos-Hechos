import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

// Vuelve a consultar cuando la pantalla recupera el foco (cambio de pestaña o
// regreso desde otra pantalla) y cuando la app vuelve a primer plano (por ejemplo,
// después de pasar por los Ajustes del teléfono).
export function useRefrescoAlVolver(refrescar: () => Promise<unknown>): void {
  useFocusEffect(
    useCallback(() => {
      refrescar();
    }, [refrescar]),
  );

  useEffect(() => {
    const suscripcion = AppState.addEventListener('change', (nuevoEstado) => {
      if (nuevoEstado === 'active') {
        refrescar();
      }
    });
    return () => suscripcion.remove();
  }, [refrescar]);
}
