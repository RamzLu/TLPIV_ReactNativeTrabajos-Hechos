import { Tabs } from 'expo-router';

import { IconoPestana } from '../../components/IconoPestana';
import { opcionesPestanas } from '../../constants/navegacion';

export default function LayoutPestanas() {
  return (
    <Tabs screenOptions={opcionesPestanas}>
      <Tabs.Screen
        name="(catalogo)"
        options={{
          title: 'Catálogo',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <IconoPestana nombre="library-outline" color={color} tamanio={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Mis reservas',
          tabBarIcon: ({ color, size }) => (
            <IconoPestana nombre="bookmark-outline" color={color} tamanio={size} />
          ),
        }}
      />
    </Tabs>
  );
}
