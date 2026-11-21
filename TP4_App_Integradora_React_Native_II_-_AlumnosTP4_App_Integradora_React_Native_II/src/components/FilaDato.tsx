import { StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, pesosTexto, tamanosTexto } from '../constants/tema';

type Props = {
  etiqueta: string;
  valor: string;
};

export function FilaDato({ etiqueta, valor }: Props) {
  return (
    <View style={estilos.fila}>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: espaciado.l,
    paddingVertical: espaciado.m,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  etiqueta: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
  },
  valor: {
    flexShrink: 1,
    fontSize: tamanosTexto.normal,
    fontWeight: pesosTexto.medio,
    color: colores.texto,
    textAlign: 'right',
  },
});
