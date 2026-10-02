import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { platos } from '../../../data/platos';
import { useGlobalContext } from '../../../context/GlobalContext';

export default function DetallePlato() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const { agregarAlCarrito } = useGlobalContext();

  const platoId = parseInt(id, 10);
  const plato = platos.find((p) => p.id === platoId);

  useEffect(() => {
    if (plato) {
      navigation.setOptions({ title: plato.nombre });
    }
  }, [plato, navigation]);

  if (!plato) {
    return (
      <View style={estilos.contenedor}>
        <Text style={estilos.error}>Lo sentimos, el plato solicitado no existe.</Text>
      </View>
    );
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.nombre}>{plato.nombre}</Text>
      <Text style={estilos.categoria}>{plato.categoria.toUpperCase()}</Text>
      <Text style={estilos.precio}>${plato.precio}</Text>
      <Text style={estilos.descripcion}>{plato.descripcion}</Text>

      <Pressable
        style={estilos.boton}
        onPress={() => agregarAlCarrito(plato)}
      >
        <Text style={estilos.textoBoton}>Agregar al carrito</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  categoria: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  precio: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 16,
  },
  descripcion: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
  },
  error: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 40,
  },
  boton: {
    backgroundColor: '#1976d2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});