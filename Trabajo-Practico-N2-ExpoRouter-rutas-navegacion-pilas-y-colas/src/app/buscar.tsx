import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { platos } from '../data/platos';
import { Link } from 'expo-router';

export default function BuscarPantalla() {
  const [busqueda, setBusqueda] = useState('');

  const platosFiltrados = platos.filter((plato) =>
    plato.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    plato.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={estilos.contenedor}>
      <TextInput
        style={estilos.input}
        placeholder="Buscar por nombre o categoría..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={platosFiltrados}
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
        ListEmptyComponent={<Text style={estilos.vacio}>No se encontraron platos</Text>}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  vacio: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});