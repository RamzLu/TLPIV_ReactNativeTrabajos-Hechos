import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  MIN_AREA_TACTIL,
  colores,
  espaciado,
  pesosTexto,
  radios,
  sombraTarjeta,
  tamanosTexto,
} from '../constants/tema';
import type { Libro } from '../types';

type Props = {
  libro: Libro;
};

export function FilaLibro({ libro }: Props) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${libro.titulo}, de ${libro.autor}`}
      onPress={() => router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })}
      style={({ pressed }) => [estilos.fila, pressed && estilos.presionada]}
    >
      <View style={estilos.textos}>
        <Text style={estilos.titulo}>{libro.titulo}</Text>
        <Text style={estilos.autor}>
          {libro.autor} · {libro.anio}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.textoSecundario} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  fila: {
    minHeight: MIN_AREA_TACTIL,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.m,
    padding: espaciado.l,
    marginHorizontal: espaciado.l,
    marginBottom: espaciado.m,
    backgroundColor: colores.superficie,
    borderRadius: radios.m,
    ...sombraTarjeta,
  },
  presionada: {
    opacity: 0.8,
  },
  textos: {
    flex: 1,
    gap: espaciado.xs,
  },
  titulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.medio,
    color: colores.texto,
  },
  autor: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
  },
});
