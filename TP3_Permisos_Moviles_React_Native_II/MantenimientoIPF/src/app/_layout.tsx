import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { configurarNotificaciones } from '@/lib/notificaciones';

if (Platform.OS !== 'web') {
  void SplashScreen.preventAutoHideAsync();
  configurarNotificaciones();
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="permisos/[recurso]" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
