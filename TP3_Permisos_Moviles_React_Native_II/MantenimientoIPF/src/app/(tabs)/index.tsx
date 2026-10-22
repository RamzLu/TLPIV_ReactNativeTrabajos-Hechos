import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TarjetaReporte } from '@/components/TarjetaReporte';
import { Colors, Spacing } from '@/constants/theme';
import { limpiarBorrador, obtenerReportes } from '@/lib/store';
import type { Reporte } from '@/lib/tipos';

export default function PantallaInicio() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [reportes, setReportes] = useState<Reporte[]>(() => obtenerReportes());

  const recargar = useCallback(() => {
    setReportes(obtenerReportes());
  }, []);

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

  const irADetalle = (id: string) => {
    router.push(`/reporte/${id}`);
  };

  const irANuevo = () => {
    limpiarBorrador();
    router.push('/reporte/nuevo');
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.titulo, { color: colors.text }]}>
            Mis Reportes
          </Text>
          <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
            {reportes.length} reporte{reportes.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <Pressable
          id="btn-nuevo-reporte"
          onPress={irANuevo}
          style={({ pressed }) => [styles.btnNuevo, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Nuevo reporte"
        >
          <Text style={styles.btnNuevoTexto}>+ Nuevo</Text>
        </Pressable>
      </View>

      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TarjetaReporte
            id={item.id}
            titulo={item.titulo}
            categoria={item.categoria}
            aula={item.aula}
            estado={item.estado}
            creadoEn={item.creadoEn}
            onPress={() => irADetalle(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={[styles.vacioTexto, { color: colors.textSecondary }]}>
              {`Aún no hay reportes.\nTocá "+ Nuevo" para crear uno.`}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 13,
    marginTop: 2,
  },
  btnNuevo: {
    backgroundColor: '#2563EB',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnNuevoTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
  },
  lista: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: 100,
    gap: Spacing.two,
  },
  vacio: {
    paddingTop: 80,
    alignItems: 'center',
    gap: Spacing.two,
  },
  vacioEmoji: {
    fontSize: 48,
  },
  vacioTexto: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
});
