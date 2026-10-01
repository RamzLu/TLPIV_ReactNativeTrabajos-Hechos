import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { platos } from '../../../../src/data/platos';

export default function ListaMenu() {
  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={platos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={`/(tabs)/menu/${item.id}`} asChild>
            <Pressable style={estilos.tarjeta}>
              <View>
                <Text style={estilos.nombre}>{item.nombre}</Text>
                <Text style={estilos.categoria}>{item.categoria.toUpperCase()}</Text>
              </View>
              <Text style={estilos.precio}>${item.precio}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoria: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  precio: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
});