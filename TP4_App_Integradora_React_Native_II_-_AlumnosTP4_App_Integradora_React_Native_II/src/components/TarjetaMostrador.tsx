import { StyleSheet, Text, View } from 'react-native';

import {
  colores,
  espaciado,
  pesosTexto,
  radios,
  sombraTarjeta,
  tamanosTexto,
} from '../constants/tema';
import { Boton } from './Boton';

type Props = {
  titulo: string;
  frente: string;
  cantidad: number;
  onEntregar: () => void;
};

export function TarjetaMostrador({ titulo, frente, cantidad, onEntregar }: Props) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.detalle}>Al frente: {frente}</Text>
      <Text style={estilos.detalle}>
        {cantidad === 1 ? 'Es la única persona en espera.' : `${cantidad} personas esperan este libro.`}
      </Text>
      <Boton titulo="Entregar al siguiente" icono="arrow-forward" onPress={onEntregar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado.s,
    padding: espaciado.l,
    marginHorizontal: espaciado.l,
    marginBottom: espaciado.m,
    backgroundColor: colores.superficie,
    borderRadius: radios.m,
    ...sombraTarjeta,
  },
  titulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.fuerte,
    color: colores.texto,
  },
  detalle: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
  },
});
