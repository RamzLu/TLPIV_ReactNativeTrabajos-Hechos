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

import { Colors, Spacing } from '@/constants/theme';
import { marcarAvisoLeido, obtenerAvisos } from '@/lib/store';
import type { Aviso } from '@/lib/tipos';

export default function PantallaAvisos() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [avisos, setAvisos] = useState<Aviso[]>(() => obtenerAvisos());

  const recargar = useCallback(() => {
    setAvisos(obtenerAvisos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      recargar();
    }, [recargar]),
  );

  const tocarAviso = (aviso: Aviso) => {
    marcarAvisoLeido(aviso.id);
    recargar();
    router.push(`/reporte/${aviso.reporteId}`);
  };

  const noLeidos = avisos.filter((a) => !a.leido).length;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.titulo, { color: colors.text }]}>Avisos</Text>
          {noLeidos > 0 && (
            <Text style={[styles.subtitulo, { color: '#2563EB' }]}>
              {noLeidos} sin leer
            </Text>
          )}
        </View>
        <Pressable
          id="btn-ir-ajustes-app"
          onPress={() => router.push('/ajustes-app')}
          accessibilityRole="button"
          accessibilityLabel="Ajustes de la app"
        >
          <Text style={styles.enlaceAjustes}>Ajustes</Text>
        </Pressable>
      </View>

      <FlatList
        data={avisos}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <Pressable
            id={`aviso-${item.id}`}
            onPress={() => tocarAviso(item)}
            style={({ pressed }) => [
              styles.tarjeta,
              {
                backgroundColor: item.leido
                  ? colors.backgroundElement
                  : '#EFF6FF',
                borderLeftColor: item.leido ? 'transparent' : '#2563EB',
              },
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={item.mensaje}
          >
            <View style={styles.tarjetaContenido}>
              <View style={styles.flex}>
                <Text
                  style={[
                    styles.tarjetaMensaje,
                    { color: colors.text, fontWeight: item.leido ? '400' : '600' },
                  ]}
                >
                  {item.mensaje}
                </Text>
                <Text style={[styles.tarjetaFecha, { color: colors.textSecondary }]}>
                  {new Date(item.creadoEn).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
            {!item.leido && <View style={styles.puntito} />}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={[styles.vacioTexto, { color: colors.textSecondary }]}>
              {`No hay avisos aún.\nCuando se resuelva un reporte, aparecerá acá.`}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  enlaceAjustes: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
  titulo: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitulo: { fontSize: 13, marginTop: 2, fontWeight: '600' },
  lista: { paddingHorizontal: Spacing.three, paddingBottom: 100 },
  tarjeta: {
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderLeftWidth: 4,
    position: 'relative',
  },
  tarjetaContenido: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  tarjetaEmoji: { fontSize: 22 },
  flex: { flex: 1, gap: 4 },
  tarjetaMensaje: { fontSize: 14, lineHeight: 20 },
  tarjetaFecha: { fontSize: 11 },
  puntito: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  vacio: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.two,
  },
  vacioEmoji: { fontSize: 48 },
  vacioTexto: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
