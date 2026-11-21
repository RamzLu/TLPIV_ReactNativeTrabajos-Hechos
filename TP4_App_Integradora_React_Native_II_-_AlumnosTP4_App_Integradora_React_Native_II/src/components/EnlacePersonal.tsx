import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { MIN_AREA_TACTIL, colores, espaciado, pesosTexto, tamanosTexto } from '../constants/tema';
import { useBiblioteca } from '../hooks/useBiblioteca';

export function EnlacePersonal() {
  const { esPersonal } = useBiblioteca();

  return (
    <Link
      href={esPersonal ? '/mostrador' : '/login'}
      accessibilityRole="button"
      accessibilityLabel="Ir al área del personal"
      style={estilos.enlace}
    >
      Personal
    </Link>
  );
}

const estilos = StyleSheet.create({
  enlace: {
    minHeight: MIN_AREA_TACTIL,
    minWidth: MIN_AREA_TACTIL,
    textAlignVertical: 'center',
    paddingHorizontal: espaciado.s,
    lineHeight: MIN_AREA_TACTIL,
    fontSize: tamanosTexto.normal,
    fontWeight: pesosTexto.medio,
    color: colores.primario,
  },
});
