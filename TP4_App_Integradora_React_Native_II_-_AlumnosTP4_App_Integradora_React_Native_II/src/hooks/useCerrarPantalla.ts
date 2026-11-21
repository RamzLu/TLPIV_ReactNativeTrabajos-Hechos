import { useRouter } from 'expo-router';
import { useCallback } from 'react';

// Cierra una pantalla modal. Si se entró por un link directo no hay a dónde volver,
// así que se lleva a la persona al Catálogo en vez de dejarla sin salida.
export function useCerrarPantalla(): () => void {
  const router = useRouter();
  return useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router]);
}
