import { MensajeEstado } from './MensajeEstado';

type Props = {
  cargando: boolean;
  error: string | null;
  onReintentar: () => void;
  textoCarga: string;
  tituloVacio: string;
  mensajeVacio?: string;
};

export function EstadoLista({
  cargando,
  error,
  onReintentar,
  textoCarga,
  tituloVacio,
  mensajeVacio,
}: Props) {
  if (cargando) {
    return <MensajeEstado cargando titulo={textoCarga} />;
  }
  if (error) {
    return (
      <MensajeEstado
        icono="cloud-offline-outline"
        titulo="Algo salió mal"
        mensaje={error}
        accionTitulo="Reintentar"
        onAccion={onReintentar}
      />
    );
  }
  return <MensajeEstado icono="library-outline" titulo={tituloVacio} mensaje={mensajeVacio} />;
}
