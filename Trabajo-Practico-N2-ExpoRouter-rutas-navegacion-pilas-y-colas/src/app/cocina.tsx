import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useGlobalContext, Pedido, Plato } from '../context/GlobalContext';
import { useRouter } from 'expo-router';

export default function CocinaPantalla() {
  const { colaPedidos, pilaAtendidos, atenderSiguiente, usuario, cerrarSesion } = useGlobalContext();
  const router = useRouter();

  const handleCerrarSesion = () => {
    cerrarSesion();
    router.replace('/(tabs)/menu');
  };

  const listaCola: Pedido[] = (colaPedidos as any).elementos || (colaPedidos as any).items || [];
  const listaAtendidos: Pedido[] = (pilaAtendidos as any).elementos || (pilaAtendidos as any).items || [];

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.header}>
        <Text style={estilos.titulo}>Panel de Cocina</Text>
        <Text style={estilos.usuario}>Operador: {usuario}</Text>
        <Pressable style={estilos.botonSalir} onPress={handleCerrarSesion}>
          <Text style={estilos.textoBotonSalir}>Cerrar sesión</Text>
        </Pressable>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.subtitulo}>Cola de Pedidos Entrantes ({colaPedidos.tamanio})</Text>
        <Pressable style={estilos.botonAtender} onPress={atenderSiguiente}>
          <Text style={estilos.textoBoton}>Atender siguiente pedido</Text>
        </Pressable>

        <FlatList
          data={listaCola}
          keyExtractor={(item) => item.idTurno.toString()}
          renderItem={({ item }) => (
            <View style={estilos.tarjetaPedido}>
              <Text style={estilos.turno}>Turno #{item.idTurno}</Text>
              <Text style={estilos.nota}>Nota: {item.nota || 'Sin notas'}</Text>
              <Text style={estilos.items}>Items: {item.items.map((p: Plato) => p.nombre).join(', ')}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={estilos.vacio}>No hay pedidos en cola</Text>}
        />
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.subtitulo}>Pila de Pedidos Atendidos ({pilaAtendidos.tamanio})</Text>
        <FlatList
          data={listaAtendidos}
          keyExtractor={(item, index) => `${item.idTurno}-${index}`}
          renderItem={({ item }) => (
            <View style={[estilos.tarjetaPedido, estilos.atendido]}>
              <Text style={estilos.turno}>Turno #{item.idTurno} (Entregado)</Text>
              <Text style={estilos.items}>{item.items.length} items procesados</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={estilos.vacio}>Ningún pedido atendido aún</Text>}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  usuario: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  botonSalir: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#d32f2f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  textoBotonSalir: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seccion: {
    flex: 1,
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#444',
  },
  botonAtender: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBoton: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tarjetaPedido: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  atendido: {
    borderLeftColor: '#2e7d32',
  },
  turno: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  nota: {
    color: '#666',
    marginVertical: 4,
  },
  items: {
    fontSize: 12,
    color: '#555',
  },
  vacio: {
    color: '#888',
    fontStyle: 'italic',
  },
});