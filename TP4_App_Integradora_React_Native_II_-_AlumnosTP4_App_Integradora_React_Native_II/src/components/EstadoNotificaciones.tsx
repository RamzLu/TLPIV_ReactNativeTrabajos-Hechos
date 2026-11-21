import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, radios, tamanosTexto } from '../constants/tema';
import type { EstadoPermiso } from '../types';
import { Boton } from './Boton';

type Props = {
  estado: EstadoPermiso;
  onAbrirAjustes: () => void;
};

export function EstadoNotificaciones({ estado, onAbrirAjustes }: Props) {
  if (estado === 'cargando') {
    return null;
  }
  const permitidas = estado === 'concedido';

  return (
    <View style={[estilos.contenedor, permitidas ? estilos.permitidas : estilos.pendientes]}>
      <Text style={estilos.texto}>
        {permitidas
          ? 'Las notificaciones están permitidas.'
          : 'Las notificaciones no están permitidas: los avisos aparecerán acá, dentro de la app.'}
      </Text>
      {estado === 'bloqueado' ? (
        <Boton titulo="Abrir Ajustes" variante="texto" onPress={onAbrirAjustes} />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.xs,
    padding: espaciado.m,
    marginHorizontal: espaciado.l,
    marginBottom: espaciado.m,
    borderRadius: radios.m,
  },
  permitidas: {
    backgroundColor: colores.exitoClaro,
  },
  pendientes: {
    backgroundColor: colores.fondoSuave,
  },
  texto: {
    fontSize: tamanosTexto.chico,
    color: colores.texto,
  },
});
