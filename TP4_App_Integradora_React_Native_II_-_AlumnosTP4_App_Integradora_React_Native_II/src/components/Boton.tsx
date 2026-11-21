import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import {
  MIN_AREA_TACTIL,
  colores,
  espaciado,
  pesosTexto,
  radios,
  tamanosTexto,
} from '../constants/tema';

type Variante = 'primario' | 'secundario' | 'peligro' | 'texto';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  icono?: ComponentProps<typeof Ionicons>['name'];
  deshabilitado?: boolean;
  accessibilityLabel?: string;
};

export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  icono,
  deshabilitado = false,
  accessibilityLabel,
}: Props) {
  const colorTexto = colorDelTexto(variante);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? titulo}
      accessibilityState={{ disabled: deshabilitado }}
      disabled={deshabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        estilosVariante[variante],
        pressed && estilos.presionado,
        deshabilitado && estilos.deshabilitado,
      ]}
    >
      {icono ? <Ionicons name={icono} size={18} color={colorTexto} /> : null}
      <Text style={[estilos.texto, estilosTexto[variante]]}>{titulo}</Text>
    </Pressable>
  );
}

function colorDelTexto(variante: Variante): string {
  switch (variante) {
    case 'primario':
      return colores.textoSobrePrimario;
    case 'peligro':
      return colores.error;
    default:
      return colores.primario;
  }
}

const estilos = StyleSheet.create({
  base: {
    minHeight: MIN_AREA_TACTIL,
    minWidth: MIN_AREA_TACTIL,
    paddingHorizontal: espaciado.l,
    borderRadius: radios.pildora,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.s,
  },
  texto: {
    fontSize: tamanosTexto.normal,
    fontWeight: pesosTexto.medio,
  },
  presionado: {
    opacity: 0.8,
  },
  deshabilitado: {
    opacity: 0.45,
  },
});

const estilosTexto = StyleSheet.create({
  primario: {
    color: colores.textoSobrePrimario,
  },
  secundario: {
    color: colores.primario,
  },
  peligro: {
    color: colores.error,
  },
  texto: {
    color: colores.primario,
  },
});

const estilosVariante = StyleSheet.create({
  primario: {
    backgroundColor: colores.primario,
  },
  secundario: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.primario,
  },
  peligro: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.error,
  },
  texto: {
    backgroundColor: 'transparent',
  },
});
