import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Boton } from '../../../../components/Boton';
import { FilaDato } from '../../../../components/FilaDato';
import { MensajeEstado } from '../../../../components/MensajeEstado';
import { colores, espaciado, pesosTexto, radios, tamanosTexto } from '../../../../constants/tema';
import { useBiblioteca } from '../../../../hooks/useBiblioteca';
import { buscarLibroPorIsbn, esIsbnValido } from '../../../../lib/catalogo';
import { textoDeParametro } from '../../../../lib/rutas';

export default function PantallaDetalle() {
  const { isbn: parametro } = useLocalSearchParams<{ isbn?: string | string[] }>();
  const isbn = textoDeParametro(parametro);
  const libro = esIsbnValido(isbn) ? buscarLibroPorIsbn(isbn) : undefined;
  const router = useRouter();
  const { registrarVisto, disponibles, enEspera, estadoReserva, posicion } = useBiblioteca();

  useEffect(() => {
    if (libro) {
      registrarVisto(libro);
    }
  }, [libro, registrarVisto]);

  if (!libro) {
    return (
      <View style={estilos.pantalla}>
        <Stack.Screen options={{ title: 'Libro no encontrado' }} />
        <MensajeEstado
          icono="search-outline"
          titulo="No encontramos ese libro"
          mensaje="El ISBN no corresponde a ningún libro del catálogo."
        />
        <Link href="/" accessibilityRole="button" style={estilos.enlace}>
          Volver al Catálogo
        </Link>
      </View>
    );
  }

  const estado = estadoReserva(libro.isbn);
  const lugar = posicion(libro.isbn);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={estilos.pantalla}
      contentContainerStyle={estilos.contenido}
    >
      <Stack.Screen options={{ title: libro.titulo }} />
      <Text style={estilos.titulo} accessibilityRole="header">
        {libro.titulo}
      </Text>
      <View>
        <FilaDato etiqueta="Autor" valor={libro.autor} />
        <FilaDato etiqueta="Año" valor={String(libro.anio)} />
        <FilaDato etiqueta="Ejemplares disponibles" valor={String(disponibles(libro))} />
        <FilaDato etiqueta="Personas en lista de espera" valor={String(enEspera(libro.isbn))} />
      </View>
      {estado === 'prestado' ? (
        <Text style={estilos.nota}>Ya tenés este libro prestado. Lo ves en Mis reservas.</Text>
      ) : null}
      {estado === 'en-espera' ? (
        <Text style={estilos.nota}>Estás en la lista de espera, en la posición {lugar}.</Text>
      ) : null}
      <Boton
        titulo="Reservar"
        icono="bookmark"
        deshabilitado={estado !== 'ninguna'}
        onPress={() => router.push({ pathname: '/reservar/[isbn]', params: { isbn: libro.isbn } })}
      />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    gap: espaciado.xl,
    padding: espaciado.l,
  },
  titulo: {
    fontSize: tamanosTexto.grande,
    fontWeight: pesosTexto.fuerte,
    color: colores.texto,
  },
  nota: {
    padding: espaciado.m,
    fontSize: tamanosTexto.normal,
    color: colores.primario,
    backgroundColor: colores.primarioClaro,
    borderRadius: radios.m,
  },
  enlace: {
    padding: espaciado.m,
    textAlign: 'center',
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.medio,
    color: colores.primario,
  },
});
