import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function ImagePickerInput({ currentImage, onImageSelected, label = "Foto de la mascota" }) {
  const [image, setImage] = useState(currentImage || null);

  const pickImage = async () => {
    // 1. Solicitamos permiso para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso denegado", "Se requiere acceso a la galería para seleccionar una foto.");
      return;
    }

    // 2. Abrimos la galería de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Forzamos un recorte cuadrado ideal para fotos de perfil
      quality: 0.8,   // Reducimos un poco la calidad para optimizar el peso
    });

    // 3. Si el usuario no canceló, guardamos la URI y la pasamos al componente padre
    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      onImageSelected(selectedUri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.imageContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={32} color="#007AFF" />
            <Text style={styles.placeholderText}>Elegir foto</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 60, // Lo hace completamente redondo
    backgroundColor: '#F7FAFC',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  placeholderText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '500',
  },
});