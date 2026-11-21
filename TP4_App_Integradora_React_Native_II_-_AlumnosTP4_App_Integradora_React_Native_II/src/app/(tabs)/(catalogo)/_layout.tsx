import { Stack } from 'expo-router';

import { EnlacePersonal } from '../../../components/EnlacePersonal';
import { opcionesPila } from '../../../constants/navegacion';

export const unstable_settings = {
  anchor: 'index',
};

export default function LayoutCatalogo() {
  return (
    <Stack screenOptions={opcionesPila}>
      <Stack.Screen
        name="index"
        options={{ title: 'Catálogo', headerRight: () => <EnlacePersonal /> }}
      />
      <Stack.Screen name="libro/[isbn]" options={{ title: 'Libro' }} />
    </Stack>
  );
}
