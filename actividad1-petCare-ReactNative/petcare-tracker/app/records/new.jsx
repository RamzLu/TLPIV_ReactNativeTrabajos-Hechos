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
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Importamos los servicios necesarios
import { addRecord } from "../../services/recordService";
import { getPets } from "../../services/petService";

const TYPE_OPTIONS = ["Vacuna", "Desparasitación", "Consulta", "Control"];
const STATUS_OPTIONS = ["Pendiente", "Realizado"];

export default function NewRecordScreen() {
  const router = useRouter();

  // Estados de datos base
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Estados del formulario
  const [selectedPet, setSelectedPet] = useState(null);
  const [type, setType] = useState("Consulta");
  const [status, setStatus] = useState("Realizado");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [appliedProduct, setAppliedProduct] = useState("");
  const [costValue, setCostValue] = useState("");
  const [notes, setNotes] = useState("");

  // Control de UI
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Al montar, cargamos las mascotas para el selector
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getPets();
        setPets(data);
        if (data.length > 0) {
          setSelectedPet(data[0]); // Selecciona la primera por defecto
        }
      } catch (error) {
        console.error("Error al cargar mascotas:", error);
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPets();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedPet) newErrors.pet = "Debes tener al menos una mascota registrada.";
    if (!title.trim()) newErrors.title = "El motivo o título es obligatorio.";
    if (!date.trim()) newErrors.date = "La fecha es obligatoria (Ej: 2026-09-15).";
    
    if (costValue.trim() && isNaN(Number(costValue))) {
      newErrors.cost = "El costo debe ser un número válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const newRecordData = {
        petId: selectedPet.id,
        petName: selectedPet.name,
        type: type,
        status: status,
        title: title.trim(),
        date: date.trim(), // En una app real, usaríamos un DatePicker nativo
        veterinarian: veterinarian.trim() || "No especificado",
        appliedProduct: appliedProduct.trim() || "N/A",
        cost: costValue ? Number(costValue) : 0,
        notes: notes.trim(),
      };

      await addRecord(newRecordData);

      Alert.alert(
        "¡Registro Guardado!",
        `El historial de ${selectedPet.name} fue actualizado.`,
        [{ text: "Aceptar", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error al guardar la atención:", error);
      Alert.alert("Error", "Ocurrió un problema al guardar el registro.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPets) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Stack.Screen options={{ title: "Nueva Atención" }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formTitle}>Registrar Atención</Text>
        <Text style={styles.formSubtitle}>
          Agrega una nueva vacuna, consulta o desparasitación al historial.
        </Text>

        {/* Selector de Mascota */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            ¿Para qué mascota es? <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainerHorizontal}>
            {pets.map((pet) => {
              const isSelected = selectedPet?.id === pet.id;
              return (
                <Pressable
                  key={pet.id}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => {
                    setSelectedPet(pet);
                    if (errors.pet) setErrors((prev) => ({ ...prev, pet: null }));
                  }}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {pet.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          {Boolean(errors.pet) && <Text style={styles.errorText}>{errors.pet}</Text>}
        </View>

        {/* Selector de Tipo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Atención <Text style={styles.required}>*</Text></Text>
          <View style={styles.chipsContainer}>
            {TYPE_OPTIONS.map((item) => {
              const isSelected = type === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setType(item)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Título / Motivo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Motivo o Título <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Ej: Vacuna Antirrábica Anual"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
          />
          {Boolean(errors.title) && <Text style={styles.errorText}>{errors.title}</Text>}
        </View>

        {/* Fecha */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fecha (YYYY-MM-DD) <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, errors.date && styles.inputError]}
            placeholder="Ej: 2026-10-15"
            placeholderTextColor="#9CA3AF"
            value={date}
            onChangeText={(text) => {
              setDate(text);
              if (errors.date) setErrors((prev) => ({ ...prev, date: null }));
            }}
          />
          {Boolean(errors.date) && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        {/* Estado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado de la atención</Text>
          <View style={styles.chipsContainer}>
            {STATUS_OPTIONS.map((item) => {
              const isSelected = status === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setStatus(item)}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Veterinario / Clínica */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Veterinario / Clínica (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Dra. Sofía Martínez"
            placeholderTextColor="#9CA3AF"
            value={veterinarian}
            onChangeText={setVeterinarian}
          />
        </View>

        {/* Producto Aplicado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Producto o Dosis (Opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Rabisin 1ml"
            placeholderTextColor="#9CA3AF"
            value={appliedProduct}
            onChangeText={setAppliedProduct}
          />
        </View>

        {/* Costo */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Costo (Opcional)</Text>
          <View style={styles.inputWithPrefix}>
            <View style={styles.prefixContainer}>
              <Text style={styles.prefixText}>$</Text>
            </View>
            <TextInput
              style={[styles.inputFieldPrefix, errors.cost && styles.inputError]}
              placeholder="Ej: 15000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={costValue}
              onChangeText={(text) => {
                setCostValue(text.replace(/[^0-9]/g, ""));
                if (errors.cost) setErrors((prev) => ({ ...prev, cost: null }));
              }}
            />
          </View>
          {Boolean(errors.cost) && <Text style={styles.errorText}>{errors.cost}</Text>}
        </View>

        {/* Notas */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notas adicionales (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observaciones de la visita..."
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Botón Guardar */}
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
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Guardar Registro</Text>
            </View>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
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
    marginBottom: 24,
    lineHeight: 20,
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
  textArea: {
    minHeight: 100,
    paddingTop: 12,
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
  chipsContainerHorizontal: {
    gap: 8,
    paddingVertical: 4,
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
    backgroundColor: "#007AFF", 
    borderColor: "#007AFF",
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
  inputWithPrefix: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    overflow: "hidden",
  },
  prefixContainer: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  prefixText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
  },
  inputFieldPrefix: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  submitButton: {
    backgroundColor: "#007AFF",
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
    backgroundColor: "#8AB4F8",
  },
  submitButtonPressed: {
    backgroundColor: "#005BB5",
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