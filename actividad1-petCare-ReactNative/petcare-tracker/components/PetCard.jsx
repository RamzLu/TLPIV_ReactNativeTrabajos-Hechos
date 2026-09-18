import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

/**
 * Componente PetCard
 * @param {Object} props
 * @param {Object} props.pet - Objeto con la información de la mascota.
 * @param {Function} props.onPress - Callback al presionar el cuerpo de la tarjeta.
 * @param {Function} [props.onDelete] - Callback al presionar el botón de eliminar.
 */
export default function PetCard({ pet, onPress, onDelete }) {
  const router = useRouter();

  // Detiene la propagación del evento para navegar únicamente a la edición
  const handleEditPress = (e) => {
    e.stopPropagation?.();
    router.push(`/pets/${pet.id}/edit`);
  };

  // Detiene la propagación y delega la confirmación de borrado al componente padre
  const handleDeletePress = (e) => {
    e.stopPropagation?.();
    if (onDelete) {
      onDelete(pet.id);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver registros de ${pet.name}`}
    >
      {/* Imagen de la mascota */}
      <Image
        source={{ uri: pet.photoUri }}
        style={styles.petImage}
        resizeMode="cover"
      />

      {/* Bloque central de información */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{pet.species}</Text>
          </View>
        </View>

        <Text style={styles.breedText}>{pet.breed}</Text>

        <View style={styles.footerRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{pet.age}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="fitness-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{pet.weight}</Text>
          </View>
        </View>
      </View>

      {/* Contenedor lateral de acciones secundarias */}
      <View style={styles.actionsContainer}>
        {/* Botón para editar */}
        <Pressable
          style={({ pressed }) => [
            styles.actionIconButton,
            styles.editButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleEditPress}
          accessibilityRole="button"
          accessibilityLabel={`Editar datos de ${pet.name}`}
          hitSlop={6}
        >
          <Ionicons name="create-outline" size={18} color="#2563EB" />
        </Pressable>

        {/* Botón para eliminar */}
        <Pressable
          style={({ pressed }) => [
            styles.actionIconButton,
            styles.deleteButton,
            pressed && styles.actionButtonPressed,
          ]}
          onPress={handleDeletePress}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar mascota ${pet.name}`}
          hitSlop={6}
        >
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardPressed: {
    opacity: 0.95,
  },
  petImage: {
    width: 74,
    height: 74,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  petName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  speciesBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  speciesText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563EB",
  },
  breedText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "column",
    gap: 6,
    marginLeft: 8,
  },
  actionIconButton: {
    padding: 7,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#EFF6FF",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
  },
  actionButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },
});
