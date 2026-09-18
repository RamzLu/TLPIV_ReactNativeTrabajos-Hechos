import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "./StatusBadge";

/**
 * Formatea fechas ISO (YYYY-MM-DD) a formato legible local (DD/MM/YYYY)
 * @param {string} dateString
 * @returns {string} Fecha formateada
 */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
};

/**
 * Componente RecordItem
 * @param {Object} props
 * @param {Object} props.record - Objeto con datos del registro médico
 * @param {Function} props.onPress - Callback al pulsar la tarjeta para navegar al detalle
 */
export default function RecordItem({ record, onPress }) {
  const isPending = record.status === "Pendiente";

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${record.title} para ${record.petName}`}
    >
      {/* Columna lateral de Fecha */}
      <View
        style={[
          styles.dateColumn,
          isPending ? styles.datePending : styles.dateCompleted,
        ]}
      >
        <Ionicons
          name={isPending ? "calendar" : "checkmark-done"}
          size={16}
          color={isPending ? "#D97706" : "#059669"}
        />
        <Text
          style={[
            styles.dateText,
            isPending ? styles.dateTextPending : styles.dateTextCompleted,
          ]}
        >
          {formatDate(record.date)}
        </Text>
      </View>

      {/* Contenido principal del registro */}
      <View style={styles.infoContainer}>
        {/* Cabecera con Badges de Tipo y Estado */}
        <View style={styles.badgesRow}>
          <StatusBadge type={record.type} variant="type" />
          <StatusBadge status={record.status} variant="status" />
        </View>

        {/* Título de la atención médica */}
        <Text style={styles.recordTitle} numberOfLines={1}>
          {record.title}
        </Text>

        {/* Mascota asociada y profesional */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="paw-outline" size={13} color="#4B5563" />
            <Text style={styles.petNameText}>{record.petName}</Text>
          </View>

          {record.veterinarian ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color="#6B7280" />
              <Text style={styles.metaText} numberOfLines={1}>
                {record.veterinarian.split("-")[0].trim()}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Indicador de navegación a detalle */}
      <View style={styles.chevronContainer}>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  dateColumn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    minWidth: 78,
  },
  datePending: {
    backgroundColor: "#FEF3C7",
  },
  dateCompleted: {
    backgroundColor: "#ECFDF5",
  },
  dateText: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  dateTextPending: {
    color: "#B45309",
  },
  dateTextCompleted: {
    color: "#047857",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  recordTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },
  petNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
  chevronContainer: {
    paddingLeft: 6,
  },
});
