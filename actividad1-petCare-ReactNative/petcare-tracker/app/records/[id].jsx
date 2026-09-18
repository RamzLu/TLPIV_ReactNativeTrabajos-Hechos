import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Importación de servicios y componentes reutilizables
import { getRecordById } from "../../services/recordService";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

export default function RecordDetailScreen() {
  // Captura el 'id' enviado desde la navegación (ej. /records/r1)
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Estados para manejar los datos y la latencia simulada
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efetua la consulta asíncrona al montar la pantalla o cambiar el ID
  useEffect(() => {
    fetchRecordDetail();
  }, [id]);

  const fetchRecordDetail = async () => {
    try {
      setLoading(true);
      const data = await getRecordById(id);
      setRecord(data);
    } catch (error) {
      console.error("Error al obtener la ficha médica:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Estado de Carga
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingState message="Cargando detalles de la ficha..." />
      </SafeAreaView>
    );
  }

  // 2. Estado cuando el registro no existe o no fue encontrado
  if (!record) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Registro No Encontrado" }} />
        <EmptyState
          icon="alert-circle-outline"
          title="Registro no disponible"
          message="No se encontró la ficha médica solicitada o fue eliminada."
          actionLabel="Volver al Historial"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  // Utilidad para formatear valores monetarios (ej. 15000 -> $15.000)
  const formatCost = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    return `$${amount.toLocaleString("es-AR")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Opciones del Header de Expo Router */}
      <Stack.Screen
        options={{
          title: "Detalle de Ficha Médica",
          headerBackTitle: "Atrás",
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabecera Principal */}
        <View style={styles.headerCard}>
          <View style={styles.badgeRow}>
            <StatusBadge type={record.type} status={record.status} />
          </View>

          <Text style={styles.title}>{record.title}</Text>

          <View style={styles.petMeta}>
            <Ionicons name="paw" size={18} color="#4A5568" />
            <Text style={styles.petName}>Mascota: {record.petName}</Text>
          </View>
        </View>

        {/* Sección de Detalles Principales */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Información de la Atención</Text>

          {/* Fecha */}
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Fecha</Text>
              <Text style={styles.detailValue}>{record.date}</Text>
            </View>
          </View>

          {/* Profesional / Clínica */}
          <View style={styles.detailRow}>
            <Ionicons name="medkit-outline" size={20} color="#007AFF" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Veterinario / Clínica</Text>
              <Text style={styles.detailValue}>
                {record.veterinarian || "No especificado"}
              </Text>
            </View>
          </View>

          {/* Producto / Dosis Aplicada */}
          <View style={styles.detailRow}>
            <Ionicons name="flask-outline" size={20} color="#007AFF" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Producto / Dosis</Text>
              <Text style={styles.detailValue}>
                {record.appliedProduct || "N/A"}
              </Text>
            </View>
          </View>

          {/* Costo */}
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={20} color="#007AFF" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Costo de Atención</Text>
              <Text style={styles.detailValue}>{formatCost(record.cost)}</Text>
            </View>
          </View>
        </View>

        {/* Sección de Observaciones o Notas */}
        {record.notes ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Notas y Observaciones</Text>
            <View style={styles.notesBox}>
              <Ionicons name="document-text-outline" size={20} color="#718096" />
              <Text style={styles.notesText}>{record.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Botón de retorno */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Volver al Historial</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 8,
  },
  petMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  petName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A5568",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3748",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
    paddingBottom: 8,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: "#2D3748",
    fontWeight: "600",
  },
  notesBox: {
    flexDirection: "row",
    backgroundColor: "#F7FAFC",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF", 
    gap: 10,
    alignItems: "flex-start",
  },
  notesText: {
    flex: 1,
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  backButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF", 
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});