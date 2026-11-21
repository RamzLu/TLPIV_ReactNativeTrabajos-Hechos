import type { Libro } from '../types';

// Los ISBN son de ejemplo (dígito verificador válido). Los dos primeros se usan
// para probar el escáner: reemplazalos por el ISBN real de dos libros que tengas a mano.
export const LIBROS: Libro[] = [
  { isbn: '9789505001002', titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', anio: 1943, ejemplares: 5 },
  { isbn: '9789505002375', titulo: 'Martín Fierro', autor: 'José Hernández', anio: 1872, ejemplares: 4 },
  { isbn: '9789505003747', titulo: 'Rayuela', autor: 'Julio Cortázar', anio: 1963, ejemplares: 0 },
  { isbn: '9789505005116', titulo: 'Sobre héroes y tumbas', autor: 'Ernesto Sabato', anio: 1961, ejemplares: 0 },
  { isbn: '9789505006489', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, ejemplares: 0 },
  { isbn: '9789505007851', titulo: 'El Aleph', autor: 'Jorge Luis Borges', anio: 1949, ejemplares: 3 },
  { isbn: '9789505009220', titulo: 'Ficciones', autor: 'Jorge Luis Borges', anio: 1944, ejemplares: 2 },
  { isbn: '9789505010592', titulo: 'Bestiario', autor: 'Julio Cortázar', anio: 1951, ejemplares: 1 },
  { isbn: '9789505011964', titulo: 'El túnel', autor: 'Ernesto Sabato', anio: 1948, ejemplares: 2 },
  { isbn: '9789505013333', titulo: 'El amor en los tiempos del cólera', autor: 'Gabriel García Márquez', anio: 1985, ejemplares: 2 },
  { isbn: '9789505014705', titulo: 'La invención de Morel', autor: 'Adolfo Bioy Casares', anio: 1940, ejemplares: 1 },
  { isbn: '9789505016075', titulo: 'Operación Masacre', autor: 'Rodolfo Walsh', anio: 1957, ejemplares: 2 },
  { isbn: '9789505017447', titulo: 'Los siete locos', autor: 'Roberto Arlt', anio: 1929, ejemplares: 1 },
  { isbn: '9789505018819', titulo: 'Respiración artificial', autor: 'Ricardo Piglia', anio: 1980, ejemplares: 2 },
  { isbn: '9789505020188', titulo: 'La casa de los espíritus', autor: 'Isabel Allende', anio: 1982, ejemplares: 3 },
  { isbn: '9789505021550', titulo: 'Pedro Páramo', autor: 'Juan Rulfo', anio: 1955, ejemplares: 2 },
  { isbn: '9789505022922', titulo: 'Zama', autor: 'Antonio Di Benedetto', anio: 1956, ejemplares: 1 },
  { isbn: '9789505024292', titulo: 'Ensayo sobre la ceguera', autor: 'José Saramago', anio: 1995, ejemplares: 2 },
];

// Personas que ya esperan al iniciar la app (en orden: la primera está al frente).
export const ESPERA_INICIAL: Record<string, string[]> = {
  '9789505003747': ['Marcos Díaz', 'Lucía Fernández'],
  '9789505005116': ['Camila Rojas'],
};
