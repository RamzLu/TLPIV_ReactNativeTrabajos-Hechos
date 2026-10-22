import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import {
  actualizarBorrador,
  crearReporte,
  limpiarBorrador,
  obtenerBorrador,
  type BorradorReporte,
} from '@/lib/store';
import type { CategoriaReporte, Sector } from '@/lib/tipos';

const CATEGORIAS: { valor: CategoriaReporte; label: string }[] = [
  { valor: 'electricidad', label: 'Electricidad' },
  { valor: 'agua', label: 'Agua' },
  { valor: 'mobiliario', label: 'Mobiliario' },
  { valor: 'equipos', label: 'Equipos' },
];

const SECTORES: { valor: Sector; label: string }[] = [
  { valor: 'aula', label: 'Aula' },
  { valor: 'patio', label: 'Patio' },
  { valor: 'estacionamiento', label: 'Estacionamiento' },
  { valor: 'pasillo', label: 'Pasillo' },
  { valor: 'baño', label: 'Baño' },
  { valor: 'otro', label: 'Otro' },
];

export default function PantallaNuevoReporte() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<CategoriaReporte>('electricidad');
  const [borrador, setBorrador] = useState<BorradorReporte>(obtenerBorrador);

  const recargarBorrador = useCallback(() => {
    setBorrador(obtenerBorrador());
  }, []);

  useFocusEffect(
    useCallback(() => {
      recargarBorrador();
    }, [recargarBorrador]),
  );

  const editarBorrador = (parcial: Partial<BorradorReporte>) => {
    setBorrador(actualizarBorrador(parcial));
  };

  const aula = borrador.aula ?? '';
  const { sector, fotoUri, coordenadas, ubicacionAproximada } = borrador;

  const irAEscanear = () => router.push('/reporte/escanear');
  const irAFoto = () => router.push('/reporte/foto');
  const irAUbicacion = () => router.push('/reporte/ubicacion');

  const enviar = () => {
    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'El título no puede estar vacío.');
      return;
    }
    if (!aula.trim() && !sector) {
      Alert.alert(
        'Campo requerido',
        'Indicá el aula/lugar o seleccioná un sector.',
      );
      return;
    }

    const nuevoReporte = crearReporte({
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      aula: aula.trim() || sector || 'Sin especificar',
      categoria,
      sector,
      fotoUri,
      coordenadas,
      ubicacionAproximada,
    });

    limpiarBorrador();
    router.replace(`/reporte/${nuevoReporte.id}`);
  };

  const inputStyle = [
    styles.input,
    { color: colors.text, backgroundColor: colors.backgroundElement },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.encabezado}>
            <Pressable
              id="btn-volver-nuevo"
              onPress={() => router.back()}
              accessibilityLabel="Volver"
              style={styles.btnVolver}
            >
              <Text style={{ color: '#2563EB', fontSize: 16 }}>← Volver</Text>
            </Pressable>
            <Text style={[styles.titulo, { color: colors.text }]}>
              Nuevo reporte
            </Text>
          </View>

          <View style={styles.campo}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Título *
            </Text>
            <TextInput
              id="input-titulo"
              style={inputStyle}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ej: Luz quemada en pasillo"
              placeholderTextColor={colors.textSecondary}
              maxLength={80}
              returnKeyType="next"
            />
          </View>

          <View style={styles.campo}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Descripción
            </Text>
            <TextInput
              id="input-descripcion"
              style={[inputStyle, styles.multiline]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describí el problema con más detalle..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              maxLength={300}
            />
          </View>

          <View style={styles.campo}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Aula / Lugar
            </Text>
            <View style={styles.filaInput}>
              <TextInput
                id="input-aula"
                style={[inputStyle, styles.flex]}
                value={aula}
                onChangeText={(texto) => editarBorrador({ aula: texto })}
                placeholder="Ej: Aula 3"
                placeholderTextColor={colors.textSecondary}
              />
              <Pressable
                id="btn-escanear-qr"
                onPress={irAEscanear}
                style={styles.btnIcono}
                accessibilityLabel="Escanear QR del aula"
              >
                <Text style={styles.btnIconoTexto}>QR</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.campo}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Categoría
            </Text>
            <View style={styles.chips}>
              {CATEGORIAS.map((c) => (
                <Pressable
                  key={c.valor}
                  id={`btn-categoria-${c.valor}`}
                  onPress={() => setCategoria(c.valor)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        categoria === c.valor
                          ? '#2563EB'
                          : colors.backgroundElement,
                    },
                  ]}
                  accessibilityLabel={`Categoría ${c.label}`}
                  accessibilityState={{ selected: categoria === c.valor }}
                >
                  <Text
                    style={[
                      styles.chipTexto,
                      { color: categoria === c.valor ? '#fff' : colors.text },
                    ]}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.campo}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Sector (opcional)
            </Text>
            <View style={styles.chips}>
              {SECTORES.map((s) => (
                <Pressable
                  key={s.valor}
                  id={`btn-sector-${s.valor}`}
                  onPress={() =>
                    editarBorrador({ sector: s.valor === sector ? undefined : s.valor })
                  }
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        sector === s.valor
                          ? '#7C3AED'
                          : colors.backgroundElement,
                    },
                  ]}
                  accessibilityLabel={`Sector ${s.label}`}
                  accessibilityState={{ selected: sector === s.valor }}
                >
                  <Text
                    style={[
                      styles.chipTexto,
                      { color: sector === s.valor ? '#fff' : colors.text },
                    ]}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.campo}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Adjuntos
            </Text>

            <Pressable
              id="btn-adjuntar-foto"
              onPress={irAFoto}
              style={[styles.btnFuncion, { backgroundColor: colors.backgroundElement }]}
              accessibilityLabel={fotoUri ? 'Cambiar foto adjunta' : 'Adjuntar foto'}
            >
              <Text style={[styles.btnFuncionTexto, { color: colors.text }]}>
                {fotoUri ? 'Foto adjunta (tocar para cambiar)' : 'Adjuntar foto del desperfecto'}
              </Text>
            </Pressable>

            <Pressable
              id="btn-marcar-ubicacion"
              onPress={irAUbicacion}
              style={[styles.btnFuncion, { backgroundColor: colors.backgroundElement }]}
              accessibilityLabel={coordenadas ? 'Ubicación marcada' : 'Marcar ubicación'}
            >
              <Text style={[styles.btnFuncionTexto, { color: colors.text }]}>
                {coordenadas
                  ? ubicacionAproximada
                    ? 'Ubicación aproximada marcada'
                    : 'Ubicación marcada'
                  : sector
                  ? `Sector: ${sector} (usar GPS en su lugar)`
                  : 'Marcar ubicación actual'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            id="btn-enviar-reporte"
            onPress={enviar}
            style={({ pressed }) => [
              styles.btnEnviar,
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Enviar reporte"
          >
            <Text style={styles.btnEnviarTexto}>Enviar reporte</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scroll: { padding: Spacing.three, gap: Spacing.three, paddingBottom: 48 },
  encabezado: { gap: Spacing.one },
  btnVolver: { marginBottom: 4 },
  titulo: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  campo: { gap: Spacing.one + 2 },
  label: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
  },
  multiline: { height: 88, textAlignVertical: 'top', paddingTop: 12 },
  filaInput: { flexDirection: 'row', gap: Spacing.two },
  btnIcono: {
    backgroundColor: '#2563EB',
    paddingHorizontal: Spacing.two,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIconoTexto: { color: '#fff', fontWeight: '700', fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one + 2 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    gap: 4,
  },
  chipEmoji: { fontSize: 14 },
  chipTexto: { fontSize: 13, fontWeight: '600' },
  btnFuncion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  btnFuncionEmoji: { fontSize: 20 },
  btnFuncionTexto: { fontSize: 14, fontWeight: '500', flex: 1 },
  btnEnviar: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  btnEnviarTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
