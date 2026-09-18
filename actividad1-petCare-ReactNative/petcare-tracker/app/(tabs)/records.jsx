import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getRecords } from "../../services/recordService";
import { getPets } from "../../services/petService";
import RecordItem from "../../components/RecordItem";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

// Filtros predefinidos por tipo de atención
const TYPE_FILTERS = [
  "Todos",
  "Vacuna",
  "Desparasitación",
  "Consulta",
  "Control",
];

export default function RecordsScreen() {
  const router = useRouter();

  // Estados locales para los datos y la interfaz
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados de filtros activos
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedPetId, setSelectedPetId] = useState("ALL");

  /**
   * Carga asíncrona concurrente de registros y mascotas.
   * Usamos Promise.all para optimizar el tiempo de espera de red (simulada).
   */
  const loadData = useCallback(async () => {
    try {
      const [recordsData, petsData] = await Promise.all([
        getRecords(),
        getPets(),
      ]);

      // Orden cronológico: fechas más recientes o futuras primero
      const sortedRecords = (recordsData || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      setRecords(sortedRecords);
      setPets(petsData || []);
    } catch (error) {
      console.error("Error al cargar historial médico:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Efecto inicial para montar los datos
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Manejador del gesto pull-to-refresh para actualizar la lista manualmente
   */
  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  /**
   * Navegación al formulario de nuevo registro médico
   */
  const handleAddRecord = () => {
    router.push("/records/new");
  };

  /**
   * Navegación a la ficha detallada del registro (Tarea T09)
   */
  const handleRecordPress = (recordId) => {
    router.push(`/records/${recordId}`);
  };

  /**
   * Filtrado reactivo en memoria:
   * Evita llamadas redundantes a la base de datos evaluando los criterios localmente.
   */
  const filteredRecords = records.filter((item) => {
    const matchType = selectedType === "Todos" || item.type === selectedType;
    const matchPet = selectedPetId === "ALL" || item.petId === selectedPetId;
    return matchType && matchPet;
  });

  // 1. Estado de Carga (Loading)
  if (loading) {
    return <LoadingState message="Cargando historial médico..." />;
  }

  // 2. Estado Vacío Absoluto (La base de datos no tiene ningún registro)
  if (records.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          iconName="calendar-outline"
          title="No hay atenciones registradas"
          description="Aún no has cargado turnos, vacunas o consultas para tus mascotas."
          actionLabel="Agendar Turno / Vacuna"
          onActionPress={handleAddRecord}
        />
      </View>
    );
  }

  // 3. Renderizado principal
  return (
    <View style={styles.container}>
      {/* --- SECCIÓN DE FILTROS --- */}
      <View style={styles.filtersSection}>
        {/* Filtro horizontal por tipo de atención */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {TYPE_FILTERS.map((filter) => {
            const isSelected = selectedType === filter;
            return (
              <Pressable
                key={filter}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedType(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Filtro horizontal secundario por mascota (Renderiza solo si hay mascotas) */}
        {pets.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petFilterScrollContent}
          >
            <Pressable
              style={[
                styles.petFilterChip,
                selectedPetId === "ALL" && styles.petFilterChipSelected,
              ]}
              onPress={() => setSelectedPetId("ALL")}
            >
              <Text
                style={[
                  styles.petFilterChipText,
                  selectedPetId === "ALL" && styles.petFilterChipTextSelected,
                ]}
              >
                Todas las mascotas
              </Text>
            </Pressable>

            {pets.map((pet) => {
              const isSelected = selectedPetId === pet.id;
              return (
                <Pressable
                  key={pet.id}
                  style={[
                    styles.petFilterChip,
                    isSelected && styles.petFilterChipSelected,
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Ionicons
                    name="paw"
                    size={12}
                    color={isSelected ? "#2563EB" : "#6B7280"}
                  />
                  <Text
                    style={[
                      styles.petFilterChipText,
                      isSelected && styles.petFilterChipTextSelected,
                    ]}
                  >
                    {pet.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* --- SECCIÓN DE LISTA O ESTADO VACÍO RELATIVO --- */}
      {filteredRecords.length === 0 ? (
        // Estado vacío relativo (Hay registros, pero no coinciden con los filtros actuales)
        <EmptyState
          iconName="search-outline"
          title="Sin resultados para este filtro"
          description="No se encontraron registros médicos con los criterios seleccionados."
          actionLabel="Restablecer filtros"
          onActionPress={() => {
            setSelectedType("Todos");
            setSelectedPetId("ALL");
          }}
        />
      ) : (
        <FlatList
          data={filteredRecords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecordItem
              record={item}
              onPress={() => handleRecordPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
        />
      )}

      {/* --- BOTÓN FLOTANTE (FAB) PARA NUEVOS REGISTROS --- */}
      <Pressable
        style={({ pressed }) => [
          styles.fabButton,
          pressed && styles.fabButtonPressed,
        ]}
        onPress={handleAddRecord}
        accessibilityRole="button"
        accessibilityLabel="Agregar nuevo registro"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  filtersSection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextSelected: {
    color: "#FFFFFF",
  },
  petFilterScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  petFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    gap: 4,
  },
  petFilterChipSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  petFilterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
  petFilterChipTextSelected: {
    color: "#2563EB",
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 90,
  },
  fabButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  fabButtonPressed: {
    backgroundColor: "#1D4ED8",
    transform: [{ scale: 0.95 }],
  },
});
