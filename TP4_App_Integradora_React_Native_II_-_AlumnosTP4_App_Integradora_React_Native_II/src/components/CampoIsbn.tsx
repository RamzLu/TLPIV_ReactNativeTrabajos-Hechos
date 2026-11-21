import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { LARGO_ISBN } from '../constants/config';
import {
  MIN_AREA_TACTIL,
  colores,
  espaciado,
  radios,
  tamanosTexto,
} from '../constants/tema';
import { esIsbnValido } from '../lib/catalogo';
import { Boton } from './Boton';

type Props = {
  onConfirmar: (isbn: string) => void;
};

export function CampoIsbn({ onConfirmar }: Props) {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  function confirmar() {
    const isbn = texto.trim();
    if (!esIsbnValido(isbn)) {
      setMensaje(`El ISBN tiene ${LARGO_ISBN} números, sin guiones ni espacios.`);
      return;
    }
    setMensaje(null);
    onConfirmar(isbn);
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.etiqueta}>¿Preferís escribir el ISBN?</Text>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        keyboardType="number-pad"
        maxLength={LARGO_ISBN}
        placeholder="Los 13 números del código de barras"
        placeholderTextColor={colores.textoSecundario}
        accessibilityLabel="ISBN del libro"
        returnKeyType="search"
        onSubmitEditing={confirmar}
        style={estilos.campo}
      />
      {mensaje ? (
        <Text style={estilos.error} accessibilityLiveRegion="polite">
          {mensaje}
        </Text>
      ) : null}
      <Boton titulo="Buscar por ISBN" onPress={confirmar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    gap: espaciado.s,
  },
  etiqueta: {
    fontSize: tamanosTexto.normal,
    color: colores.texto,
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
    fontSize: tamanosTexto.chico,
    color: colores.error,
  },
});
