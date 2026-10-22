import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EstadoBadge } from '@/components/EstadoBadge';
import { Colors, Spacing } from '@/constants/theme';
import { avisarResolucion } from '@/lib/notificaciones';
import { obtenerReportePorId, resolverReporte } from '@/lib/store';
import type { Reporte } from '@/lib/tipos';

export default function PantallaDetalleReporte() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [reporte, setReporte] = useState<Reporte | undefined>(() =>
    id ? obtenerReportePorId(id) : undefined,
  );
  const [simulando, setSimulando] = useState(false);

  if (!id || !reporte) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <Pressable
          id="btn-volver-detalle-no-existe"
          onPress={() => router.back()}
          style={styles.btnVolverTop}
        >
          <Text style={{ color: '#2563EB', fontSize: 16 }}>← Volver</Text>
        </Pressable>
        <View style={styles.centrado}>
          <Text style={[styles.noEncontradoTitulo, { color: colors.text }]}>
            Reporte no encontrado
          </Text>
          <Text style={[styles.noEncontradoSub, { color: colors.textSecondary }]}>
            {`El reporte con ID "${id}" no existe.`}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const simularResolucion = async () => {
    if (reporte.estado === 'resuelto') {
      Alert.alert('Ya resuelto', 'Este reporte ya fue marcado como resuelto.');
      return;
    }

    setSimulando(true);

    const actualizado = resolverReporte(reporte.id);
    if (actualizado) setReporte(actualizado);

    const destino = await avisarResolucion(actualizado ?? reporte);

    if (destino === 'notificacion') {
      Alert.alert(
        'Resolución simulada',
        'Recibirás una notificación en ~10 segundos.',
      );
    } else {
      Alert.alert(
        'Resolución simulada',
        'El aviso aparecerá en la bandeja de Avisos (sin permiso o con notificaciones desactivadas).',
        [{ text: 'Ver avisos', onPress: () => router.push('/avisos') }],
      );
    }

    setSimulando(false);
  };

  const fechaCreacion = new Date(reporte.creadoEn).toLocaleDateString(
    'es-AR',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );
  const fechaActualizacion = new Date(reporte.actualizadoEn).toLocaleDateString(
    'es-AR',
    { day: '2-digit', month: 'long', year: 'numeric' },
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <Pressable
        id="btn-volver-detalle"
        onPress={() => router.back()}
        style={styles.btnVolverTop}
      >
        <Text style={{ color: '#2563EB', fontSize: 16 }}>← Volver</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.encabezado}>
          <View style={styles.flex}>
            <Text style={[styles.titulo, { color: colors.text }]}>
              {reporte.titulo}
            </Text>
            <EstadoBadge estado={reporte.estado} />
          </View>
        </View>

        {reporte.descripcion ? (
          <View style={[styles.seccion, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.seccionLabel, { color: colors.textSecondary }]}>
              Descripción
            </Text>
            <Text style={[styles.seccionTexto, { color: colors.text }]}>
              {reporte.descripcion}
            </Text>
          </View>
        ) : null}

        <View style={[styles.seccion, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[styles.seccionLabel, { color: colors.textSecondary }]}>
            Detalles
          </Text>
          <Fila label="Aula / Lugar" valor={reporte.aula} textColor={colors.text} secColor={colors.textSecondary} />
          <Fila label="Categoría" valor={reporte.categoria} textColor={colors.text} secColor={colors.textSecondary} />
          {reporte.sector && (
            <Fila label="Sector" valor={reporte.sector} textColor={colors.text} secColor={colors.textSecondary} />
          )}
          <Fila label="Reportado el" valor={fechaCreacion} textColor={colors.text} secColor={colors.textSecondary} />
          <Fila label="Última actualización" valor={fechaActualizacion} textColor={colors.text} secColor={colors.textSecondary} />
        </View>

        {reporte.fotoUri ? (
          <View style={[styles.seccion, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.seccionLabel, { color: colors.textSecondary }]}>
              Foto
            </Text>
            <Image
              source={{ uri: reporte.fotoUri }}
              style={styles.foto}
              resizeMode="cover"
              accessibilityLabel="Foto del desperfecto"
            />
          </View>
        ) : null}

        {reporte.coordenadas ? (
          <View style={[styles.seccion, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[styles.seccionLabel, { color: colors.textSecondary }]}>
              Ubicación
            </Text>
            {reporte.ubicacionAproximada ? (
              <Text style={[styles.seccionTexto, { color: colors.text }]}>
                Ubicación aproximada (GPS impreciso)
              </Text>
            ) : (
              <Text style={[styles.seccionTexto, { color: colors.text }]}>
                {reporte.coordenadas.latitud.toFixed(5)},{' '}
                {reporte.coordenadas.longitud.toFixed(5)}
              </Text>
            )}
          </View>
        ) : null}

        {reporte.estado !== 'resuelto' && (
          <Pressable
            id="btn-simular-resolucion"
            onPress={simularResolucion}
            disabled={simulando}
            style={[styles.btnSimular, simulando && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel="Simular resolución del reporte"
          >
            <Text style={styles.btnSimularTexto}>
              {simulando ? 'Procesando…' : 'Simular resolución'}
            </Text>
          </Pressable>
        )}

        {reporte.estado === 'resuelto' && (
          <View style={[styles.resueltoInfo, { backgroundColor: '#D1FAE5' }]}>
            <Text style={[styles.resueltoTexto, { color: '#065F46' }]}>
              {`Este reporte ya fue resuelto el ${fechaActualizacion}.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Fila({
  label,
  valor,
  textColor,
  secColor,
}: {
  label: string;
  valor: string;
  textColor: string;
  secColor: string;
}) {
  return (
    <View style={filaStyles.fila}>
      <Text style={[filaStyles.label, { color: secColor }]}>{label}</Text>
      <Text style={[filaStyles.valor, { color: textColor }]}>{valor}</Text>
    </View>
  );
}

const filaStyles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: { fontSize: 13 },
  valor: { fontSize: 13, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1, gap: Spacing.one },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: { fontSize: 48 },
  noEncontradoTitulo: { fontSize: 20, fontWeight: '700' },
  noEncontradoSub: { fontSize: 14, textAlign: 'center' },
  btnVolverTop: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  scroll: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    paddingBottom: 48,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  icono: { fontSize: 32 },
  titulo: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  seccion: {
    padding: Spacing.three,
    borderRadius: 14,
    gap: Spacing.one + 2,
  },
  seccionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  seccionTexto: { fontSize: 14, lineHeight: 20 },
  foto: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: Spacing.one,
  },
  btnSimular: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnSimularTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resueltoInfo: {
    padding: Spacing.three,
    borderRadius: 14,
  },
  resueltoTexto: { fontSize: 14, fontWeight: '600' },
});
