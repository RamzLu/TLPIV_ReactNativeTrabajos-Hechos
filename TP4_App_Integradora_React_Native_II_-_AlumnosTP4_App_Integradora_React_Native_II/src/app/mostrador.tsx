import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Boton } from '../components/Boton';
import { MensajeEstado } from '../components/MensajeEstado';
import { TarjetaMostrador } from '../components/TarjetaMostrador';
import { colores, espaciado, radios, tamanosTexto } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

export default function PantallaMostrador() {
  const router = useRouter();
  const { librosConEspera, entregarAlSiguiente, cerrarSesion } = useBiblioteca();
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function entregar(isbn: string, titulo: string) {
    const persona = await entregarAlSiguiente(isbn);
    setMensaje(
      persona === null
        ? 'Esa lista de espera ya estaba vacía.'
        : `Entregaste "${titulo}" a ${persona}.`,
    );
  }

  // Primero se vuelve al Catálogo, así el mostrador sale del historial antes de cerrar la sesión.
  function salir() {
    router.dismissTo('/');
    cerrarSesion();
  }

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={estilos.lista}
      contentContainerStyle={estilos.contenido}
      data={librosConEspera}
      keyExtractor={(item) => item.libro.isbn}
      renderItem={({ item }) => (
        <TarjetaMostrador
          titulo={item.libro.titulo}
          frente={item.frente}
          cantidad={item.cantidad}
          onEntregar={() => entregar(item.libro.isbn, item.libro.titulo)}
        />
      )}
      ListHeaderComponent={
        mensaje ? (
          <View style={estilos.mensaje} accessibilityLiveRegion="polite">
            <Text style={estilos.textoMensaje}>{mensaje}</Text>
          </View>
        ) : undefined
      }
      ListEmptyComponent={
        <MensajeEstado
          icono="checkmark-circle-outline"
          titulo="No hay listas de espera"
          mensaje="Todos los libros pedidos ya fueron entregados."
        />
      }
      ListFooterComponent={
        <View style={estilos.pie}>
          <Boton titulo="Cerrar sesión" variante="secundario" icono="log-out-outline" onPress={salir} />
        </View>
      }
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    backgroundColor: colores.fondo,
  },
  contenido: {
    paddingTop: espaciado.l,
    paddingBottom: espaciado.xl,
  },
  mensaje: {
    padding: espaciado.m,
    marginHorizontal: espaciado.l,
    marginBottom: espaciado.m,
    backgroundColor: colores.exitoClaro,
    borderRadius: radios.m,
  },
  textoMensaje: {
    fontSize: tamanosTexto.normal,
    color: colores.exito,
  },
  pie: {
    padding: espaciado.l,
  },
});
