import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';

import { EstadoLista } from '../components/EstadoLista';
import { FilaLibro } from '../components/FilaLibro';
import { MensajeEstado } from '../components/MensajeEstado';
import { MIN_AREA_TACTIL, colores, espaciado, radios, tamanosTexto } from '../constants/tema';
import { useBusqueda } from '../hooks/useBusqueda';
import { textoDeParametro } from '../lib/rutas';

export default function PantallaBuscar() {
  const { q } = useLocalSearchParams<{ q?: string | string[] }>();
  const router = useRouter();
  const texto = textoDeParametro(q);
  const { resultados, buscando, error, reintentar } = useBusqueda(texto);

  // setParams cambia la URL sin apilar pantallas: "atrás" sale de la búsqueda.
  function cambiarTexto(nuevoTexto: string) {
    router.setParams({ q: nuevoTexto === '' ? undefined : nuevoTexto });
  }

  return (
    <View style={estilos.pantalla}>
      <TextInput
        value={texto}
        onChangeText={cambiarTexto}
        placeholder="Buscar por título o autor"
        placeholderTextColor={colores.textoSecundario}
        accessibilityLabel="Buscar por título o autor"
        autoFocus
        autoCorrect={false}
        returnKeyType="search"
        style={estilos.campo}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={resultados}
        keyExtractor={(libro) => libro.isbn}
        renderItem={({ item }) => <FilaLibro libro={item} />}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={estilos.contenido}
        ListEmptyComponent={
          texto.trim() === '' ? (
            <MensajeEstado
              icono="search-outline"
              titulo="Buscá por título o autor"
              mensaje="Escribí al menos una letra para ver resultados."
            />
          ) : (
            <EstadoLista
              cargando={buscando}
              error={error}
              onReintentar={reintentar}
              textoCarga="Buscando…"
              tituloVacio="No encontramos libros"
              mensajeVacio={`No hay resultados para "${texto.trim()}".`}
            />
          )
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  campo: {
    minHeight: MIN_AREA_TACTIL,
    margin: espaciado.l,
    paddingHorizontal: espaciado.l,
    fontSize: tamanosTexto.mediano,
    color: colores.texto,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.pildora,
  },
  contenido: {
    paddingBottom: espaciado.xl,
  },
});
