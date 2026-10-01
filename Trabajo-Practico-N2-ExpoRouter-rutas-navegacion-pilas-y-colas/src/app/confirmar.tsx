import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'expo-router';

export default function ConfirmarPedido() {
  const [nota, setNota] = useState('');
  const { confirmarPedido, carrito } = useGlobalContext();
  const router = useRouter();

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  const handleConfirmar = () => {
    const idTurno = confirmarPedido(nota);
    router.replace(`/turno/${idTurno}`);
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Confirmar Pedido</Text>
      <Text style={estilos.subtitulo}>Total a pagar: ${total}</Text>

      <Text style={estilos.label}>Aclaraciones para la cocina:</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ej: Sin cebolla, pan tostado..."
        placeholderTextColor="#888"
        value={nota}
        onChangeText={setNota}
        multiline
      />

      <Pressable style={estilos.boton} onPress={handleConfirmar}>
        <Text style={estilos.textoBoton}>Enviar a Cocina</Text>
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#2e7d32',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#2e7d32',
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