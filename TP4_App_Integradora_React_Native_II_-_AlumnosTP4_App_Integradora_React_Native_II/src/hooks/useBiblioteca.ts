import { useContext } from 'react';

import { BibliotecaContext } from '../context/BibliotecaContext';
import type { ValorBiblioteca } from '../context/BibliotecaContext';

export function useBiblioteca(): ValorBiblioteca {
  const valor = useContext(BibliotecaContext);
  if (valor === null) {
    throw new Error('useBiblioteca se usa dentro de ProveedorBiblioteca.');
  }
  return valor;
}
