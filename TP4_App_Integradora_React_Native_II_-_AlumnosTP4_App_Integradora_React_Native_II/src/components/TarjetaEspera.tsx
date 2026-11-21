import { StyleSheet, Text, View } from 'react-native';

import {
  colores,
  espaciado,
  pesosTexto,
  radios,
  sombraTarjeta,
  tamanosTexto,
} from '../constants/tema';

type Props = {
  titulo: string;
  posicion: number;
  totalEnEspera: number;
};

export function TarjetaEspera({ titulo, posicion, totalEnEspera }: Props) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.detalle}>
        Estás en la posición {posicion} de {totalEnEspera} en la lista de espera.
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado.xs,
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
