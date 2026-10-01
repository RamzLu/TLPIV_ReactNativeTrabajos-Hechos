import { Stack } from 'expo-router';
import { GlobalProvider, useGlobalContext } from '../context/GlobalContext';

function NavegacionRaiz() {
  const { usuario } = useGlobalContext();
  const conSesion = usuario !== null;

  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="categorias/[categoria]" />
      <Stack.Screen name="buscar" />
      <Stack.Screen name="confirmar" options={{ presentation: 'modal' }} />
      <Stack.Screen name="turno/[numero]" />
      <Stack.Screen name="ayuda" />
      <Stack.Screen name="pedido" />
      <Stack.Screen name="+not-found" options={{ title: 'No encontrado' }} />

      <Stack.Protected guard={conSesion}>
        <Stack.Screen name="cocina" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!conSesion}>
        <Stack.Screen name="login" options={{ presentation: 'modal' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function LayoutRaiz() {
  return (
    <GlobalProvider>
      <NavegacionRaiz />
    </GlobalProvider>
  );
}