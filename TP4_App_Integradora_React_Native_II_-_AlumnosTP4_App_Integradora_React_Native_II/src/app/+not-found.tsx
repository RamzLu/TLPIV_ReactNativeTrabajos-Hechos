import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { MensajeEstado } from '../components/MensajeEstado';
import { colores, espaciado, pesosTexto, tamanosTexto } from '../constants/tema';

export default function NoEncontrada() {
  const ruta = usePathname();

  return (
    <View style={estilos.pantalla}>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />
      <MensajeEstado
        icono="alert-circle-outline"
        titulo="No encontramos esa página"
        mensaje={`La dirección ${ruta} no existe en la app.`}
      />
      <Link href="/" accessibilityRole="button" style={estilos.enlace}>
        Ir al Catálogo
      </Link>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaciado.m,
    padding: espaciado.l,
    backgroundColor: colores.fondo,
  },
  enlace: {
    padding: espaciado.m,
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.medio,
    color: colores.primario,
  },
});
