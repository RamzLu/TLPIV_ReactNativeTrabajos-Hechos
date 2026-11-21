import { useCallback, useEffect, useState } from 'react';

import { MS_ESPERA_BUSQUEDA } from '../constants/config';
import { buscarLibros } from '../lib/api';
import type { Libro } from '../types';

type ResultadoBusqueda = {
  resultados: Libro[];
  buscando: boolean;
  error: string | null;
  reintentar: () => void;
};

type Respuesta = {
  texto: string;
  resultados: Libro[];
  error: string | null;
};

export function useBusqueda(texto: string): ResultadoBusqueda {
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const [intento, setIntento] = useState(0);
  const consulta = texto.trim();

  useEffect(() => {
    if (consulta === '') {
      return;
    }
    // La limpieza descarta tanto el temporizador pendiente como cualquier
    // respuesta que llegue tarde de una búsqueda anterior.
    let descartada = false;
    const temporizador = setTimeout(async () => {
      try {
        const resultados = await buscarLibros(consulta);
        if (!descartada) {
          setRespuesta({ texto: consulta, resultados, error: null });
        }
      } catch {
        if (!descartada) {
          setRespuesta({
            texto: consulta,
            resultados: [],
            error: 'No pudimos buscar en este momento. Intentá de nuevo.',
          });
        }
      }
    }, MS_ESPERA_BUSQUEDA);

    return () => {
      descartada = true;
      clearTimeout(temporizador);
    };
  }, [consulta, intento]);

  const reintentar = useCallback(() => {
    setRespuesta(null);
    setIntento((anterior) => anterior + 1);
  }, []);

  if (consulta === '') {
    return { resultados: [], buscando: false, error: null, reintentar };
  }
  // Mientras no haya respuesta para el texto actual, se está buscando.
  const vigente = respuesta?.texto === consulta ? respuesta : null;
  return {
    resultados: vigente?.resultados ?? [],
    buscando: vigente === null,
    error: vigente?.error ?? null,
    reintentar,
  };
}
