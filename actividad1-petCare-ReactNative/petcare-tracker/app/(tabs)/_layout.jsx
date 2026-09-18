import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    // Definición de las pestañas inferiores de la app
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563EB", // Color azul primario para la pestaña activa
        tabBarInactiveTintColor: "#6B7280", // Color gris para la pestaña inactiva
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      {/* Pestaña 1: Mis Mascotas (Pantalla principal / Home) */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Mis Mascotas",
          headerTitle: "PetCare Tracker",
          tabBarLabel: "Mascotas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
        }}
      />

      {/* Pestaña 2: Historial Médico / Turnos y Vacunas */}
      <Tabs.Screen
        name="records"
        options={{
          title: "Historial Médico",
          tabBarLabel: "Historial",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
