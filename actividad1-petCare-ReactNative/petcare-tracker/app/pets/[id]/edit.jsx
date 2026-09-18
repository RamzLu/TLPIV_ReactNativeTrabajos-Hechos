import React, { useState, useEffect } from "react";
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
  Image,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getPetById, updatePet } from "../../../services/petService";
import LoadingState from "../../../components/LoadingState";

const SPECIES_OPTIONS = ["Perro", "Gato", "Ave", "Conejo", "Otro"];
const AGE_UNITS = ["Años", "Meses"];

export default function EditPetScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Estados de control de carga inicial y guardado
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estados de los campos del formulario
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("Perro");
  const [breed, setBreed] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [ageUnit, setAgeUnit] = useState("Años");
  const [weightValue, setWeightValue] = useState("");
  const [photoUri, setPhotoUri] = useState(null);

  // Errores de validación
  const [errors, setErrors] = useState({});

  /**
   * Helper para extraer número y unidad de edad (ej: "3 años" -> valor: "3", unidad: "Años")
   */
  const parseAge = (ageStr = "") => {
    const isMonths = ageStr.toLowerCase().includes("mes");
    const numericMatch = ageStr.match(/[\d.]+/);
    return {
      value: numericMatch ? numericMatch[0] : "",
      unit: isMonths ? "Meses" : "Años",
    };
  };

  /**
   * Helper para extraer el valor numérico del peso (ej: "30 kg" -> "30")
   */
  const parseWeight = (weightStr = "") => {
    const numericMatch = weightStr.match(/[\d.]+/);
    return numericMatch ? numericMatch[0] : "";
  };

  // Carga inicial de datos de la mascota a editar
  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const pet = await getPetById(id);
        if (!pet) {
          Alert.alert("Error", "Mascota no encontrada.", [
            { text: "Volver", onPress: () => router.back() },
          ]);
          return;
        }

        setName(pet.name || "");
        setSpecies(pet.species || "Perro");
        setBreed(pet.breed || "");
        setPhotoUri(pet.photoUri || null);

        // Parseo inteligente de los campos formateados
        const parsedAge = parseAge(pet.age);
        setAgeValue(parsedAge.value);
        setAgeUnit(parsedAge.unit);
        setWeightValue(parseWeight(pet.weight));
      } catch (error) {
        console.error("Error al obtener datos de la mascota:", error);
        Alert.alert("Error", "No se pudieron cargar los datos de la mascota.");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchPetData();
    }
  }, [id]);

  /**
   * Selector de foto con expo-image-picker
   */
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se requiere acceso a la galería para actualizar la foto.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  /**
   * Validación sincrónica
   */
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

  /**
   * Envío de datos actualizados al servicio mock
   */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Formateo inteligente antes de guardar
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

      const updatedPayload = {
        name: name.trim(),
        species: species.trim(),
        breed: breed.trim(),
        age: formattedAge,
        weight: formattedWeight,
        photoUri: photoUri,
      };

      await updatePet(id, updatedPayload);

      Alert.alert(
        "¡Cambios Guardados!",
        `Los datos de ${updatedPayload.name} han sido actualizados con éxito.`,
        [{ text: "Aceptar", onPress: () => router.back() }],
      );
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setSubmitting(false);
    }
  };

  if (initialLoading) {
    return <LoadingState message="Cargando datos de la mascota..." />;
  }

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
        <Text style={styles.formTitle}>Editar Mascota</Text>
        <Text style={styles.formSubtitle}>
          Actualiza los datos y medidas de salud de tu animal de compañía.
        </Text>

        {/* Sección de Foto */}
        <View style={styles.photoSection}>
          <Pressable
            style={({ pressed }) => [
              styles.imagePickerButton,
              pressed && styles.imagePickerButtonPressed,
            ]}
            onPress={pickImage}
          >
            {photoUri ? (
              <View style={styles.previewWrapper}>
                <Image
                  source={{ uri: photoUri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <View style={styles.changeBadge}>
                  <Ionicons name="camera" size={14} color="#FFFFFF" />
                  <Text style={styles.changeBadgeText}>Cambiar</Text>
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="image-outline" size={36} color="#6B7280" />
                <Text style={styles.placeholderTitle}>Seleccionar foto</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Nombre de la mascota <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
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

        {/* Edad Formateada Inteligente */}
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

        {/* Peso Formateado Inteligente */}
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

        {/* Botón Guardar Cambios */}
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
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.submitButtonText}>Guardar Cambios</Text>
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
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePickerButtonPressed: {
    opacity: 0.8,
  },
  placeholderContainer: {
    alignItems: "center",
    padding: 8,
  },
  placeholderTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginTop: 4,
  },
  previewWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  changeBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 4,
  },
  changeBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
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
