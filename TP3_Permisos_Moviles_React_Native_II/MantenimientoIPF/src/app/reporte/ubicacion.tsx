import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { actualizarBorrador } from '@/lib/store';
import type { Sector } from '@/lib/tipos';

const SECTORES: { valor: Sector; label: string }[] = [
  { valor: 'aula', label: 'Aula' },
  { valor: 'patio', label: 'Patio' },
  { valor: 'estacionamiento', label: 'Estacionamiento' },
  { valor: 'pasillo', label: 'Pasillo' },
  { valor: 'baño', label: 'Baño' },
  { valor: 'otro', label: 'Otro' },
];

export default function PantallaUbicacion() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { estado, parcial, abrirAjustes } = usePermiso('ubicacion');
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [coordenadas, setCoordenadas] = useState<{
    latitud: number;
    longitud: number;
  } | null>(null);
  const [aproximada, setAproximada] = useState(false);
  const [sectorElegido, setSectorElegido] = useState<Sector | undefined>();

  const solicitarUbicacion = async () => {
    if (estado === 'concedido') {
      setCargandoUbicacion(true);
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setCoordenadas({
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
        });
        setAproximada(parcial);
      } catch {
        Alert.alert('Error', 'No se pudo obtener la ubicación. Elegí el sector a mano.');
      } finally {
        setCargandoUbicacion(false);
      }
      return;
    }

    if (estado !== 'cargando') {
      router.push('/permisos/ubicacion');
    }
  };

  const confirmar = () => {
    if (!coordenadas && !sectorElegido) {
      Alert.alert('Sin ubicación', 'Obtenga la ubicación GPS o seleccioná un sector.');
      return;
    }
    actualizarBorrador({
      coordenadas: coordenadas ?? undefined,
      ubicacionAproximada: aproximada,
      sector: sectorElegido,
    });
    router.back();
  };

  if (estado === 'cargando') {
    return (
      <View style={[styles.centrado, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Verificando permiso de ubicación…
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <Pressable
        id="btn-volver-ubicacion"
        onPress={() => router.back()}
        style={styles.btnVolverTop}
      >
        <Text style={{ color: '#2563EB', fontSize: 16 }}>← Volver</Text>
      </Pressable>

      <View style={styles.contenido}>
        <Text style={[styles.titulo, { color: colors.text }]}>
          Ubicación del problema
        </Text>
        <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
          Usamos tu ubicación para registrar exactamente dónde ocurre el
          desperfecto.
        </Text>

        {coordenadas ? (
          <View style={[styles.resultadoGPS, { backgroundColor: colors.backgroundElement }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.resultadoTitulo, { color: colors.text }]}>
                {aproximada ? 'Ubicación aproximada' : 'Ubicación GPS'}
              </Text>
              {aproximada ? (
                <Text style={[styles.resultadoSub, { color: colors.textSecondary }]}>
                  La precisión GPS es limitada en este momento.
                </Text>
              ) : (
                <Text style={[styles.resultadoSub, { color: colors.textSecondary }]}>
                  {coordenadas.latitud.toFixed(5)},{' '}
                  {coordenadas.longitud.toFixed(5)}
                </Text>
              )}
            </View>
          </View>
        ) : null}

        {!coordenadas && (
          <Pressable
            id="btn-obtener-ubicacion"
            onPress={solicitarUbicacion}
            disabled={cargandoUbicacion}
            style={[styles.btnGPS, cargandoUbicacion && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel="Obtener ubicación GPS"
          >
            {cargandoUbicacion ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnGPSTexto}>
                {estado === 'concedido' ? 'Obtener ubicación actual' : 'Continuar para habilitar'}
              </Text>
            )}
          </Pressable>
        )}

        {estado === 'bloqueado' && (
          <View style={[styles.bloqueado, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.bloqueadoTexto, { color: '#991B1B' }]}>
              Ubicación bloqueada. Elegí el sector a mano o abrí Ajustes.
            </Text>
            <Pressable
              id="btn-abrir-ajustes-ubicacion"
              onPress={abrirAjustes}
              style={styles.btnAjustes}
            >
              <Text style={styles.btnAjustesTexto}>Abrir Ajustes</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.separadorFila}>
          <View style={[styles.linea, { backgroundColor: colors.backgroundElement }]} />
          <Text style={[styles.separadorTexto, { color: colors.textSecondary }]}>
            o elegí el sector
          </Text>
          <View style={[styles.linea, { backgroundColor: colors.backgroundElement }]} />
        </View>

        <View style={styles.chips}>
          {SECTORES.map((s) => (
            <Pressable
              key={s.valor}
              id={`btn-sector-ubicacion-${s.valor}`}
              onPress={() =>
                setSectorElegido(s.valor === sectorElegido ? undefined : s.valor)
              }
              style={[
                styles.chip,
                {
                  backgroundColor:
                    sectorElegido === s.valor
                      ? '#7C3AED'
                      : colors.backgroundElement,
                },
              ]}
              accessibilityLabel={`Sector ${s.label}`}
              accessibilityState={{ selected: sectorElegido === s.valor }}
            >
              <Text
                style={[
                  styles.chipTexto,
                  { color: sectorElegido === s.valor ? '#fff' : colors.text },
                ]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          id="btn-confirmar-ubicacion"
          onPress={confirmar}
          style={styles.btnConfirmar}
          accessibilityRole="button"
          accessibilityLabel="Confirmar ubicación o sector"
        >
          <Text style={styles.btnConfirmarTexto}>
            {coordenadas ? 'Confirmar ubicación GPS' : 'Confirmar sector'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  info: { fontSize: 15 },
  btnVolverTop: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  contenido: { flex: 1, paddingHorizontal: Spacing.three, gap: Spacing.three },
  titulo: { fontSize: 24, fontWeight: '700' },
  subtitulo: { fontSize: 14, lineHeight: 20 },
  resultadoGPS: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 14,
    gap: Spacing.two,
  },
  resultadoEmoji: { fontSize: 28 },
  resultadoTitulo: { fontSize: 15, fontWeight: '600' },
  resultadoSub: { fontSize: 13, marginTop: 2 },
  btnGPS: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnGPSTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bloqueado: {
    padding: Spacing.three,
    borderRadius: 14,
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  bloqueadoTexto: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  btnAjustes: {
    backgroundColor: '#991B1B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnAjustesTexto: { color: '#fff', fontWeight: '600', fontSize: 13 },
  separadorFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  linea: { flex: 1, height: 1 },
  separadorTexto: { fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  chipEmoji: { fontSize: 16 },
  chipTexto: { fontSize: 14, fontWeight: '600' },
  btnConfirmar: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: Spacing.two,
  },
  btnConfirmarTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
