import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '../../components/Boton';
import { MensajeEstado } from '../../components/MensajeEstado';
import { colores, espaciado, pesosTexto, tamanosTexto } from '../../constants/tema';
import { useBiblioteca } from '../../hooks/useBiblioteca';
import { useCerrarPantalla } from '../../hooks/useCerrarPantalla';
import { buscarLibroPorIsbn, esIsbnValido } from '../../lib/catalogo';
import { formatearFecha } from '../../lib/formato';
import { textoDeParametro } from '../../lib/rutas';

export default function PantallaReservar() {
  const { isbn: parametro } = useLocalSearchParams<{ isbn?: string | string[] }>();
  const isbn = textoDeParametro(parametro);
  const libro = esIsbnValido(isbn) ? buscarLibroPorIsbn(isbn) : undefined;
  const router = useRouter();
  const cerrar = useCerrarPantalla();
  const { simularReserva, reservar } = useBiblioteca();
  const confirmando = useRef(false);

  if (!libro) {
    return (
      <View style={estilos.pantalla}>
        <MensajeEstado
          icono="search-outline"
          titulo="No encontramos ese libro"
          mensaje="No se puede reservar un libro que no está en el catálogo."
          accionTitulo="Cerrar"
          onAccion={cerrar}
        />
      </View>
    );
  }

  const prevista = simularReserva(libro.isbn);

  if (prevista.tipo === 'rechazada') {
    return (
      <View style={estilos.pantalla}>
        <MensajeEstado
          icono="bookmark"
          titulo="Ya reservaste este libro"
          mensaje="Podés ver su estado en Mis reservas."
          accionTitulo="Ver mis reservas"
          onAccion={() => router.dismissTo('/reservas')}
        />
      </View>
    );
  }

  // dismissTo cierra este modal y deja Mis reservas como pantalla actual:
  // "atrás" ya no vuelve a la confirmación.
  function confirmar() {
    if (confirmando.current || !libro) {
      return;
    }
    confirmando.current = true;
    reservar(libro.isbn);
    router.dismissTo('/reservas');
  }

  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.titulo}>{libro.titulo}</Text>
      <Text style={estilos.autor}>{libro.autor}</Text>
      <Text style={estilos.descripcion}>
        {prevista.tipo === 'prestamo'
          ? `Hay ejemplares disponibles. Te lo prestamos por 7 días: tenés que devolverlo antes del ${formatearFecha(prevista.fechaDevolucion)}.`
          : `Ahora no quedan ejemplares. Si confirmás, entrás en la lista de espera en la posición ${prevista.posicion}.`}
      </Text>
      <Boton
        titulo={prevista.tipo === 'prestamo' ? 'Confirmar préstamo' : 'Anotarme en la lista'}
        onPress={confirmar}
      />
      <Boton titulo="Cancelar" variante="texto" onPress={cerrar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    gap: espaciado.m,
    padding: espaciado.l,
    backgroundColor: colores.fondo,
  },
  titulo: {
    fontSize: tamanosTexto.titulo,
    fontWeight: pesosTexto.fuerte,
    color: colores.texto,
  },
  autor: {
    fontSize: tamanosTexto.mediano,
    color: colores.textoSecundario,
  },
  descripcion: {
    marginVertical: espaciado.m,
    fontSize: tamanosTexto.mediano,
    color: colores.texto,
  },
});
