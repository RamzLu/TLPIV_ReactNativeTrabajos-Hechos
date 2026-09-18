import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getPets, deletePet } from "../../services/petService";
import PetCard from "../../components/PetCard";
import LoadingState from "../../components/LoadingState";
import EmptyState from "../../components/EmptyState";

export default function PetsScreen() {
  const router = useRouter();

  // Estados para datos, carga inicial y refresco manual
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Carga la lista de mascotas desde el servicio mock
   */
  const loadPets = useCallback(async () => {
    try {
      const data = await getPets();
      setPets(data || []);
    } catch (error) {
      console.error("Error al cargar la lista de mascotas:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadPets();
  };

  const handleAddPet = () => {
    router.push("/pets/new");
  };

  const handleSelectPet = (petId) => {
    router.push("/records");
  };

  /**
   * Manejador para eliminar mascota y disparar la eliminación en cascada de sus registros
   * @param {string} petId - ID de la mascota a borrar
   */
  const handleDeletePet = (petId) => {
    const targetPet = pets.find((p) => p.id === petId);
    const petName = targetPet ? targetPet.name : "esta mascota";

    Alert.alert(
      "Eliminar Mascota",
      `¿Estás seguro de que deseas eliminar a ${petName}?\n\nEsta acción también eliminará todo su historial de turnos y vacunas.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              // Dispara la eliminación atómica en cascada (mascota + registros asociados)
              await deletePet(petId);

              // Actualizamos el estado local de forma reactiva
              setPets((prevPets) => prevPets.filter((p) => p.id !== petId));

              Alert.alert(
                "Éxito",
                `${petName} y sus registros fueron eliminados correctamente.`,
              );
            } catch (error) {
              console.error("Error al eliminar la mascota:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar la mascota. Intenta nuevamente.",
              );
            }
          },
        },
      ],
    );
  };

  // 1. Estado de Carga
  if (loading) {
    return <LoadingState message="Cargando tus mascotas..." />;
  }

  // 2. Estado Vacío
  if (pets.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          iconName="paw-outline"
          title="No tienes mascotas registradas"
          description="Añade a tus compañeros domésticos para comenzar a registrar sus vacunas, desparasitaciones y turnos."
          actionLabel="Agregar Mascota"
          onActionPress={handleAddPet}
        />
      </View>
    );
  }

  // 3. Renderizado de la lista
  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={() => handleSelectPet(item.id)}
            onDelete={handleDeletePet}
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
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.headerTitle}>Tus Compañeros</Text>
            <Text style={styles.headerSubtitle}>
              Administra o edita tus mascotas registradas.
            </Text>
          </View>
        }
      />

      {/* Botón flotante para agregar mascota */}
      <Pressable
        style={({ pressed }) => [
          styles.fabButton,
          pressed && styles.fabButtonPressed,
        ]}
        onPress={handleAddPet}
        accessibilityRole="button"
        accessibilityLabel="Agregar nueva mascota"
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  listHeader: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
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
