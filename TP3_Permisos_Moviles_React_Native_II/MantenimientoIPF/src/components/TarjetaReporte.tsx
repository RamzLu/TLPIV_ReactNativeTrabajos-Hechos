import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import type { CategoriaReporte, EstadoReporte } from '@/lib/tipos';

import { EstadoBadge } from './EstadoBadge';

const LABEL_CATEGORIA: Record<CategoriaReporte, string> = {
  electricidad: 'Electricidad',
  agua: 'Agua',
  mobiliario: 'Mobiliario',
  equipos: 'Equipos',
};

interface Props {
  id?: string;
  titulo: string;
  categoria: CategoriaReporte;
  aula: string;
  estado: EstadoReporte;
  creadoEn: string;
  onPress?: () => void;
}

export function TarjetaReporte({
  titulo,
  categoria,
  aula,
  estado,
  creadoEn,
  onPress,
}: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const fecha = new Date(creadoEn).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.backgroundElement },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Reporte: ${titulo}`}
    >
      <View style={styles.header}>
        <Text style={[styles.titulo, { color: colors.text }]} numberOfLines={2}>
          {titulo}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {aula} · {LABEL_CATEGORIA[categoria]} · {fecha}
        </Text>
        <EstadoBadge estado={estado} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  icono: {
    fontSize: 22,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 12,
  },
});
