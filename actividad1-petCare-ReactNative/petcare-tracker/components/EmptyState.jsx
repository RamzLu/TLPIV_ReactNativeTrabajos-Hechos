import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Componente EmptyState
 * @param {Object} props
 * @param {string} [props.iconName='file-tray-outline'] - Nombre del icono de Ionicons.
 * @param {string} props.title - Título principal del estado vacío.
 * @param {string} props.description - Explicación secundaria del estado vacío.
 * @param {string} [props.actionLabel] - Texto del botón de acción (opcional).
 * @param {Function} [props.onActionPress] - Función que se dispara al pulsar el botón.
 */
export default function EmptyState({
  iconName = "file-tray-outline",
  title = "No hay datos disponibles",
  description = "Aún no se ha registrado información en esta sección.",
  actionLabel,
  onActionPress,
}) {
  return (
    // Contenedor centrado para presentar el mensaje de lista vacía
    <View style={styles.container}>
      {/* Icono temático ilustrativo */}
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={54} color="#9CA3AF" />
      </View>

      {/* Título y descripción textual */}
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.descriptionText}>{description}</Text>

      {/* Botón de acción opcional (se muestra solo si se pasan actionLabel y onActionPress) */}
      {actionLabel && onActionPress && (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={onActionPress}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#F9FAFB",
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
