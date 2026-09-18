import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* Pestañas principales */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* Formulario de Alta de Mascota (Modal) */}
      <Stack.Screen
        name="pets/new"
        options={{
          title: "Registrar Mascota",
          presentation: "modal",
          headerBackTitle: "Cancelar",
        }}
      />

      {/* Formulario de Edición de Mascota (Modal) */}
      <Stack.Screen
        name="pets/[id]/edit"
        options={{
          title: "Editar Mascota",
          presentation: "modal",
          headerBackTitle: "Cancelar",
        }}
      />

      {/* Detalle de Ficha Médica / Registro */}
      <Stack.Screen
        name="records/[id]"
        options={{
          title: "Detalle de Registro",
          headerBackTitle: "Atrás",
        }}
      />

      {/* Formulario de Nuevo Registro / Turno (Modal) */}
      <Stack.Screen
        name="records/new"
        options={{
          title: "Nuevo Registro",
          presentation: "modal",
          headerBackTitle: "Cancelar",
        }}
      />
    </Stack>
  );
}
