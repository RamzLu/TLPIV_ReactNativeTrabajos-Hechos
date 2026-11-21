export function formatearFecha(milisegundos: number): string {
  return new Date(milisegundos).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
  });
}
