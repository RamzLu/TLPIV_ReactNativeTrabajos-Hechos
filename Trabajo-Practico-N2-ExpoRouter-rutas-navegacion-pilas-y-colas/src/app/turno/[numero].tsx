import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function TurnoPantalla() {
  const { numero } = useLocalSearchParams<{ numero: string }>();
  const router = useRouter();

  const handleVolver = () => {
    router.dismissAll();
    router.replace('/(tabs)/menu');
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>Tu número de turno es</Text>
      <Text style={estilos.numero}>#{numero}</Text>
      <Text style={estilos.mensaje}>El pedido fue enviado a la cocina con éxito.</Text>

      <Pressable style={estilos.boton} onPress={handleVolver}>
        <Text style={estilos.textoBoton}>Volver al menú</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  etiqueta: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  numero: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 16,
  },
  mensaje: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 32,
  },
  boton: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});