import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Boton } from '../components/Boton';
import { MIN_AREA_TACTIL, colores, espaciado, radios, tamanosTexto } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';
import { useCerrarPantalla } from '../hooks/useCerrarPantalla';

export default function PantallaLogin() {
  const { iniciarSesion } = useBiblioteca();
  const cerrar = useCerrarPantalla();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Si las credenciales son correctas, el login deja de existir en el layout raíz
  // (Stack.Protected) y la app pasa sola al mostrador.
  function ingresar() {
    if (!iniciarSesion(usuario, clave)) {
      setError('El usuario o la clave no son correctos. Revisalos e intentá de nuevo.');
    }
  }

  return (
    <View style={estilos.pantalla}>
      <Text style={estilos.ayuda}>Esta sección es solo para el personal de la biblioteca.</Text>
      <TextInput
        value={usuario}
        onChangeText={setUsuario}
        placeholder="Usuario"
        placeholderTextColor={colores.textoSecundario}
        accessibilityLabel="Usuario"
        autoCapitalize="none"
        autoCorrect={false}
        style={estilos.campo}
      />
      <TextInput
        value={clave}
        onChangeText={setClave}
        placeholder="Clave"
        placeholderTextColor={colores.textoSecundario}
        accessibilityLabel="Clave"
        secureTextEntry
        autoCapitalize="none"
        onSubmitEditing={ingresar}
        style={estilos.campo}
      />
      {error ? (
        <Text style={estilos.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
      <Boton titulo="Ingresar" onPress={ingresar} />
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
  ayuda: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
  },
  campo: {
    minHeight: MIN_AREA_TACTIL,
    paddingHorizontal: espaciado.l,
    fontSize: tamanosTexto.mediano,
    color: colores.texto,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radios.m,
  },
  error: {
    fontSize: tamanosTexto.normal,
    color: colores.error,
  },
});
