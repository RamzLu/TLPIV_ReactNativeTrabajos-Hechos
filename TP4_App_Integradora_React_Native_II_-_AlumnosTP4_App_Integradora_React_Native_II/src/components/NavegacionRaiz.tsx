import { Stack } from 'expo-router';

import { opcionesPila } from '../constants/navegacion';
import { useBiblioteca } from '../hooks/useBiblioteca';

export function NavegacionRaiz() {
  const { esPersonal } = useBiblioteca();

  return (
    <Stack screenOptions={opcionesPila}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="buscar" options={{ title: 'Buscar' }} />
      <Stack.Screen name="escanear" options={{ title: 'Escanear libro' }} />
      <Stack.Screen
        name="reservar/[isbn]"
        options={{ presentation: 'modal', title: 'Confirmar reserva' }}
      />
      <Stack.Screen
        name="permisos/[recurso]"
        options={{ presentation: 'modal', title: 'Permiso necesario' }}
      />
      <Stack.Protected guard={!esPersonal} redirectTo="/mostrador">
        <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Ingreso del personal' }} />
      </Stack.Protected>
      <Stack.Protected guard={esPersonal} redirectTo="/login">
        <Stack.Screen name="mostrador" options={{ title: 'Mostrador' }} />
      </Stack.Protected>
    </Stack>
  );
}
