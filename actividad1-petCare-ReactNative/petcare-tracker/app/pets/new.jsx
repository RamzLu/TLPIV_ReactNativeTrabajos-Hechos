import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Importamos el componente reutilizable que creamos en la T10
import ImagePickerInput from "../../components/ImagePickerInput";
import { addPet } from "../../services/petService";

const SPECIES_OPTIONS = ["Perro", "Gato", "Ave", "Conejo", "Otro"];
const AGE_UNITS = ["Años", "Meses"];
const DEFAULT_PHOTO_URI =
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80";

export default function NewPetScreen() {
  const router = useRouter();

  // Estados de los campos
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Perro");
  const [breed, setBreed] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [ageUnit, setAgeUnit] = useState("Años");
  const [weightValue, setWeightValue] = useState("");
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  // Control de errores y envío
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!species.trim()) newErrors.species = "Selecciona una especie.";
    if (!breed.trim()) newErrors.breed = "La raza es obligatoria.";

    if (!ageValue.trim() || isNaN(Number(ageValue)) || Number(ageValue) <= 0) {
      newErrors.age = "Ingresa una edad numérica válida.";
    }

    if (
      !weightValue.trim() ||
      isNaN(Number(weightValue)) ||
      Number(weightValue) <= 0
    ) {
      newErrors.weight = "Ingresa un peso numérico válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Formateo automático de unidad y valor
      const unitLabel =
        Number(ageValue) === 1
          ? ageUnit === "Años"
            ? "año"
            : "mes"
          : ageUnit === "Años"
            ? "años"
            : "meses";

      const formattedAge = `${ageValue.trim()} ${unitLabel}`;
      const formattedWeight = `${weightValue.trim()} kg`;

      const newPetData = {
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim(),
        age: formattedAge,
        weight: formattedWeight,
        photoUri: selectedImageUri || DEFAULT_PHOTO_URI,
      };

      await addPet(newPetData);

      Alert.alert(
        "¡Mascota Registrada!",
        `${newPetData.name} se ha agregado a tu lista correctamente.`,
        [{ text: "Aceptar", onPress: () => router.back() }],
      );
    } catch (error) {
      console.error("Error al guardar la mascota:", error);
      Alert.alert("Error", "Ocurrió un problema al guardar la mascota.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formTitle}>Nueva Mascota</Text>
        <Text style={styles.formSubtitle}>
          Ingresa los datos y elige una foto para registrar a tu mascota.
        </Text>

        {/* Uso del componente ImagePickerInput */}
        <View style={styles.photoSection}>
          <ImagePickerInput
            label="Foto de perfil (Opcional)"
            currentImage={selectedImageUri}
            onImageSelected={(uri) => setSelectedImageUri(uri)}
          />
        </View>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Nombre de la mascota <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Ej: Milo, Luna, Coco..."
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
            }}
          />
          {Boolean(errors.name) && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
        </View>

        {/* Especie */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Especie <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.chipsContainer}>
            {SPECIES_OPTIONS.map((item) => {
              const isSelected = species === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => {
                    setSpecies(item);
                    if (errors.species)
                      setErrors((prev) => ({ ...prev, species: null }));
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Raza */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Raza / Cruza <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.breed && styles.inputError]}
            placeholder="Ej: Mestizo, Siamés, Labrador..."
            placeholderTextColor="#9CA3AF"
            value={breed}
            onChangeText={(text) => {
              setBreed(text);
              if (errors.breed) setErrors((prev) => ({ ...prev, breed: null }));
            }}
          />
          {Boolean(errors.breed) && (
            <Text style={styles.errorText}>{errors.breed}</Text>
          )}
        </View>

        {/* Edad Formateada */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Edad <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.rowInline}>
            <TextInput
              style={[
                styles.input,
                styles.flexInput,
                errors.age && styles.inputError,
              ]}
              placeholder="Ej: 3"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={ageValue}
              onChangeText={(text) => {
                setAgeValue(text.replace(/[^0-9]/g, ""));
                if (errors.age) setErrors((prev) => ({ ...prev, age: null }));
              }}
            />
            <View style={styles.unitSelector}>
              {AGE_UNITS.map((unit) => {
                const isSelected = ageUnit === unit;
                return (
                  <Pressable
                    key={unit}
                    style={[
                      styles.unitChip,
                      isSelected && styles.unitChipSelected,
                    ]}
                    onPress={() => setAgeUnit(unit)}
                  >
                    <Text
                      style={[
                        styles.unitChipText,
                        isSelected && styles.unitChipTextSelected,
                      ]}
                    >
                      {unit}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          {Boolean(errors.age) && (
            <Text style={styles.errorText}>{errors.age}</Text>
          )}
        </View>

        {/* Peso Formateado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Peso <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputWithSuffix}>
            <TextInput
              style={[
                styles.inputFieldSuffix,
                errors.weight && styles.inputError,
              ]}
              placeholder="Ej: 12.5"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              value={weightValue}
              onChangeText={(text) => {
                setWeightValue(text.replace(/[^0-9.]/g, ""));
                if (errors.weight)
                  setErrors((prev) => ({ ...prev, weight: null }));
              }}
            />
            <View style={styles.suffixContainer}>
              <Text style={styles.suffixText}>kg</Text>
            </View>
          </View>
          {Boolean(errors.weight) && (
            <Text style={styles.errorText}>{errors.weight}</Text>
          )}
        </View>

        {/* Botón Registrar */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
            pressed && !submitting && styles.submitButtonPressed,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <View style={styles.buttonContent}>
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Registrar Mascota</Text>
            </View>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  required: {
    color: "#DC2626",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
    fontWeight: "500",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  chipSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#4B5563",
  },
  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  rowInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flexInput: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    padding: 3,
  },
  unitChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  unitChipSelected: {
    backgroundColor: "#2563EB",
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  unitChipTextSelected: {
    color: "#FFFFFF",
  },
  inputWithSuffix: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    overflow: "hidden",
  },
  inputFieldSuffix: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  suffixContainer: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  suffixText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
  },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#93C5FD",
  },
  submitButtonPressed: {
    backgroundColor: "#1D4ED8",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});