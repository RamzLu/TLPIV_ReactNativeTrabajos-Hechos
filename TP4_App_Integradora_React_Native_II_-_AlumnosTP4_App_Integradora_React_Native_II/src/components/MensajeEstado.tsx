import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colores, espaciado, pesosTexto, tamanosTexto } from '../constants/tema';
import { Boton } from './Boton';

type Props = {
  titulo: string;
  mensaje?: string;
  icono?: ComponentProps<typeof Ionicons>['name'];
  cargando?: boolean;
  accionTitulo?: string;
  onAccion?: () => void;
};

export function MensajeEstado({
  titulo,
  mensaje,
  icono,
  cargando = false,
  accionTitulo,
  onAccion,
}: Props) {
  return (
    <View style={estilos.contenedor} accessibilityLiveRegion="polite">
      {cargando ? <ActivityIndicator size="large" color={colores.primario} /> : null}
      {!cargando && icono ? <Ionicons name={icono} size={40} color={colores.primarioSuave} /> : null}
      <Text style={estilos.titulo}>{titulo}</Text>
      {mensaje ? <Text style={estilos.mensaje}>{mensaje}</Text> : null}
      {accionTitulo && onAccion ? (
        <Boton titulo={accionTitulo} onPress={onAccion} variante="secundario" />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    gap: espaciado.m,
    padding: espaciado.xl,
  },
  titulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.medio,
    color: colores.texto,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
    textAlign: 'center',
  },
});
