import { StyleSheet, Text, View } from 'react-native';

import type { EstadoReporte } from '@/lib/tipos';

const CONFIG: Record<
  EstadoReporte,
  { label: string; bg: string; text: string }
> = {
  pendiente: { label: 'Pendiente', bg: '#FEF3C7', text: '#92400E' },
  en_curso: { label: 'En curso', bg: '#DBEAFE', text: '#1E40AF' },
  resuelto: { label: 'Resuelto', bg: '#D1FAE5', text: '#065F46' },
};

interface Props {
  estado: EstadoReporte;
}

export function EstadoBadge({ estado }: Props) {
  const { label, bg, text } = CONFIG[estado];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
