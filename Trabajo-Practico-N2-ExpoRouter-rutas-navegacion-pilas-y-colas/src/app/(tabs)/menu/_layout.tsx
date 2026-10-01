import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Menú del Comedor' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle del Plato' }} />
    </Stack>
  );
}