import { FlatList, StyleSheet, View } from 'react-native';

import { AccesosCatalogo } from '../../../components/AccesosCatalogo';
import { EstadoLista } from '../../../components/EstadoLista';
import { FilaLibro } from '../../../components/FilaLibro';
import { LibrosRecientes } from '../../../components/LibrosRecientes';
import { colores, espaciado } from '../../../constants/tema';
import { useBiblioteca } from '../../../hooks/useBiblioteca';
import { useLibros } from '../../../hooks/useLibros';

export default function PantallaCatalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { vistosRecientemente } = useBiblioteca();

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={estilos.lista}
      contentContainerStyle={estilos.contenido}
      data={libros}
      keyExtractor={(libro) => libro.isbn}
      renderItem={({ item }) => <FilaLibro libro={item} />}
      ListHeaderComponent={
        <View style={estilos.encabezado}>
          <AccesosCatalogo />
          <LibrosRecientes libros={vistosRecientemente} />
        </View>
      }
      ListEmptyComponent={
        <EstadoLista
          cargando={cargando}
          error={error}
          onReintentar={reintentar}
          textoCarga="Cargando el catálogo…"
          tituloVacio="El catálogo está vacío"
          mensajeVacio="Todavía no hay libros para mostrar."
        />
      }
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    backgroundColor: colores.fondo,
  },
  contenido: {
    paddingBottom: espaciado.xl,
  },
  encabezado: {
    gap: espaciado.xl,
    padding: espaciado.l,
  },
});
