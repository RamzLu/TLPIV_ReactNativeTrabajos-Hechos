import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

/**
 * Componente LoadingState
 * @param {Object} props
 * @param {string} [props.message='Cargando información...'] - Texto descriptivo bajo el spinner.
 * @param {string} [props.color='#2563EB'] - Color del indicador de actividad.
 * @param {string} [props.size='large'] - Tamaño del spinner ('small' | 'large').
 */
export default function LoadingState({
  message = "Cargando información...",
  color = "#2563EB",
  size = "large",
}) {
  return (
    // Contenedor centrado que ocupa el espacio disponible de la vista padre
    <View style={styles.container}>
      {/* Indicador de actividad nativo de React Native */}
      <ActivityIndicator size={size} color={color} />

      {/* Mensaje descriptivo para guiar al usuario durante la espera */}
      {Boolean(message) && <Text style={styles.messageText}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  messageText: {
    marginTop: 12,
    fontSize: 15,
    color: "#4B5563",
    fontWeight: "500",
    textAlign: "center",
  },
});
