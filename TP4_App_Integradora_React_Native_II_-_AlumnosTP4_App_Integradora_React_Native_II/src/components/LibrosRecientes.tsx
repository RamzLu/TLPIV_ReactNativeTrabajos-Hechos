import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  MIN_AREA_TACTIL,
  colores,
  espaciado,
  pesosTexto,
  radios,
  tamanosTexto,
} from '../constants/tema';
import type { Libro } from '../types';

type Props = {
  libros: Libro[];
};

export function LibrosRecientes({ libros }: Props) {
  const router = useRouter();

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.encabezado} accessibilityRole="header">
        Vistos recientemente
      </Text>
      {libros.length === 0 ? (
        <Text style={estilos.vacio}>Todavía no abriste ningún libro.</Text>
      ) : (
        <View style={estilos.lista}>
          {libros.map((libro) => (
            <Pressable
              key={libro.isbn}
              accessibilityRole="button"
              accessibilityLabel={`Volver a ver ${libro.titulo}`}
              onPress={() =>
                router.push({ pathname: '/libro/[isbn]', params: { isbn: libro.isbn } })
              }
              style={({ pressed }) => [estilos.chip, pressed && estilos.presionado]}
            >
              <Text style={estilos.textoChip} numberOfLines={1}>
                {libro.titulo}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.s,
  },
  encabezado: {
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.fuerte,
    color: colores.texto,
  },
  vacio: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
  },
  lista: {
    gap: espaciado.s,
  },
  chip: {
    minHeight: MIN_AREA_TACTIL,
    justifyContent: 'center',
    paddingHorizontal: espaciado.l,
    backgroundColor: colores.primarioClaro,
    borderRadius: radios.pildora,
  },
  presionado: {
    opacity: 0.8,
  },
  textoChip: {
    fontSize: tamanosTexto.normal,
    fontWeight: pesosTexto.medio,
    color: colores.primario,
  },
});
