import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useRouter } from 'expo-router';

export default function LoginPantalla() {
  const [nombre, setNombre] = useState('');
  const { iniciarSesion } = useGlobalContext();
  const router = useRouter();

  const handleLogin = () => {
    if (nombre.trim() === '') return;
    iniciarSesion(nombre.trim());
    router.replace('/cocina');
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Ingreso de Cocina</Text>
      <Text style={estilos.subtitulo}>Ingrese su nombre de operador para continuar</Text>

      <TextInput
        style={estilos.input}
        placeholder="Nombre de operador"
        placeholderTextColor="#888"
        value={nombre}
        onChangeText={setNombre}
      />

      <Pressable style={estilos.boton} onPress={handleLogin}>
        <Text style={estilos.textoBoton}>Iniciar Sesión</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
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