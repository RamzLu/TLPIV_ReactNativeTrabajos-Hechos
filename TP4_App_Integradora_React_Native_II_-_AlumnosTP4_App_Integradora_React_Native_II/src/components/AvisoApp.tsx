import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  MIN_AREA_TACTIL,
  colores,
  espaciado,
  radios,
  tamanosTexto,
} from '../constants/tema';

type Props = {
  mensaje: string;
  onCerrar: () => void;
};

export function AvisoApp({ mensaje, onCerrar }: Props) {
  return (
    <View style={estilos.aviso} accessibilityRole="alert">
      <Ionicons name="notifications" size={20} color={colores.aviso} />
      <Text style={estilos.texto}>{mensaje}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar aviso"
        onPress={onCerrar}
        style={estilos.cerrar}
      >
        <Ionicons name="close" size={22} color={colores.aviso} />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.s,
    paddingLeft: espaciado.l,
    marginHorizontal: espaciado.l,
    marginBottom: espaciado.m,
    backgroundColor: colores.avisoClaro,
    borderRadius: radios.m,
  },
  texto: {
    flex: 1,
    paddingVertical: espaciado.m,
    fontSize: tamanosTexto.normal,
    color: colores.aviso,
  },
  cerrar: {
    minHeight: MIN_AREA_TACTIL,
    minWidth: MIN_AREA_TACTIL,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
