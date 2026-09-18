import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Mapeo de configuración visual según el tipo de atención
 */
const TYPE_CONFIG = {
  Vacuna: {
    backgroundColor: "#EFF6FF",
    textColor: "#1D4ED8",
    iconName: "medkit-outline",
  },
  Desparasitación: {
    backgroundColor: "#F0FDF4",
    textColor: "#15803D",
    iconName: "shield-checkmark-outline",
  },
  Consulta: {
    backgroundColor: "#FEF3C7",
    textColor: "#B45309",
    iconName: "fitness-outline",
  },
  Control: {
    backgroundColor: "#F3E8FF",
    textColor: "#6B21A8",
    iconName: "clipboard-outline",
  },
};

/**
 * Mapeo de configuración visual según el estado del turno
 */
const STATUS_CONFIG = {
  Pendiente: {
    backgroundColor: "#FFF7ED",
    textColor: "#C2410C",
    iconName: "time-outline",
  },
  Realizado: {
    backgroundColor: "#ECFDF5",
    textColor: "#047857",
    iconName: "checkmark-circle-outline",
  },
};

/**
 * Componente StatusBadge
 * @param {Object} props
 * @param {string} [props.type] - Tipo de atención ('Vacuna' | 'Desparasitación' | 'Consulta' | 'Control')
 * @param {string} [props.status] - Estado ('Pendiente' | 'Realizado')
 * @param {'type' | 'status'} [props.variant='type'] - Define si renderiza la insignia por tipo o por estado
 */
export default function StatusBadge({ type, status, variant = "type" }) {
  // Selección de paleta de colores e icono según la variante solicitada
  const isStatusVariant = variant === "status";
  const config = isStatusVariant
    ? STATUS_CONFIG[status] || STATUS_CONFIG.Pendiente
    : TYPE_CONFIG[type] || TYPE_CONFIG.Consulta;

  const label = isStatusVariant ? status : type;

  return (
    <View
      style={[
        styles.badgeContainer,
        { backgroundColor: config.backgroundColor },
      ]}
    >
      <Ionicons name={config.iconName} size={13} color={config.textColor} />
      <Text style={[styles.badgeText, { color: config.textColor }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
