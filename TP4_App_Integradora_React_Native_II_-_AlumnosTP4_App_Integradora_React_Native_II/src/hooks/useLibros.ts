import { useCallback, useEffect, useState } from 'react';

import { obtenerLibros } from '../lib/api';
import type { Libro } from '../types';

export function useLibros() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      try {
        const datos = await obtenerLibros();
        if (!cancelado) {
          setLibros(datos);
          setError(null);
        }
      } catch {
        if (!cancelado) {
          setError('No pudimos cargar el catálogo. Revisá tu conexión e intentá de nuevo.');
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [intento]);

  // Cambiar `intento` es lo que vuelve a disparar el efecto.
  const reintentar = useCallback(() => {
    setError(null);
    setCargando(true);
    setIntento((anterior) => anterior + 1);
  }, []);

  return { libros, cargando, error, reintentar };
}
