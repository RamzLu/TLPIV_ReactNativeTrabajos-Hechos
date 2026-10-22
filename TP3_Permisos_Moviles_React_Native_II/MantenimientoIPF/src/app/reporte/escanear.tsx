import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import { actualizarBorrador } from '@/lib/store';

export default function PantallaEscanear() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const { estado, abrirAjustes } = usePermiso('camara');
  const [codigoManual, setCodigoManual] = useState('');
  const yaLeido = useRef(false);

  const irAPantallaPrevia = () => {
    router.push('/permisos/camara');
  };

  const confirmarManual = () => {
    if (!codigoManual.trim()) {
      Alert.alert('Código requerido', 'Ingresá el código del aula.');
      return;
    }
    actualizarBorrador({ aula: codigoManual.trim() });
    router.back();
  };

  if (estado === 'cargando') {
    return (
      <View style={[styles.centrado, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={[styles.textoInfo, { color: colors.textSecondary }]}>
          Verificando permiso de cámara…
        </Text>
      </View>
    );
  }

  if (estado === 'concedido') {
    return (
      <View style={styles.flex}>
        <CameraView
          id="camara-escaneo-qr"
          style={styles.flex}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={({ data }) => {
            if (yaLeido.current) return;
            yaLeido.current = true;
            Alert.alert('QR leído', `Aula: ${data}`, [
              {
                text: 'Usar este código',
                onPress: () => {
                  actualizarBorrador({ aula: data });
                  router.back();
                },
              },
              {
                text: 'Volver a escanear',
                onPress: () => {
                  yaLeido.current = false;
                },
              },
            ]);
          }}
        />

        <View style={styles.overlay} pointerEvents="none">
          <View style={styles.marco} />
          <Text style={styles.guia}>Apuntá al QR pegado en la puerta del aula</Text>
        </View>

        <SafeAreaView style={styles.volverContainer} edges={['top']}>
          <Pressable
            id="btn-volver-escanear"
            onPress={() => router.back()}
            style={styles.btnVolver}
          >
            <Text style={styles.btnVolverTexto}>← Volver</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  if (estado === 'preguntable') {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <Pressable
          id="btn-volver-escanear-preguntable"
          onPress={() => router.back()}
          style={styles.btnVolverTop}
        >
          <Text style={{ color: '#2563EB', fontSize: 16 }}>← Volver</Text>
        </Pressable>

        <View style={styles.centradoContenido}>
          <Text style={[styles.tituloEstado, { color: colors.text }]}>
            Necesitamos la cámara
          </Text>
          <Text style={[styles.descripcion, { color: colors.textSecondary }]}>
            Usamos tu cámara para leer el código QR pegado en la puerta del
            aula. Solo se activa cuando escaneás.
          </Text>

          <Pressable
            id="btn-continuar-camara"
            onPress={irAPantallaPrevia}
            style={styles.btnPrimario}
            accessibilityRole="button"
            accessibilityLabel="Continuar para permitir cámara"
          >
            <Text style={styles.btnPrimarioTexto}>Continuar</Text>
          </Pressable>

          <View style={styles.separador}>
            <Text style={[styles.separadorTexto, { color: colors.textSecondary }]}>
              o
            </Text>
          </View>

          <Text style={[styles.labelManual, { color: colors.textSecondary }]}>
            Ingresá el código del aula manualmente:
          </Text>
          <TextInput
            id="input-codigo-aula-manual"
            style={[
              styles.inputManual,
              { color: colors.text, backgroundColor: colors.backgroundElement },
            ]}
            value={codigoManual}
            onChangeText={setCodigoManual}
            placeholder="Ej: Aula 3 / Lab. Informática"
            placeholderTextColor={colors.textSecondary}
          />
          <Pressable
            id="btn-confirmar-manual"
            onPress={confirmarManual}
            style={[styles.btnSecundario, { borderColor: '#2563EB' }]}
          >
            <Text style={[styles.btnSecundarioTexto, { color: '#2563EB' }]}>
              Usar este código
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <Pressable
        id="btn-volver-escanear-bloqueado"
        onPress={() => router.back()}
        style={styles.btnVolverTop}
      >
        <Text style={{ color: '#2563EB', fontSize: 16 }}>← Volver</Text>
      </Pressable>

      <View style={styles.centradoContenido}>
        <Text style={[styles.tituloEstado, { color: colors.text }]}>
          Cámara bloqueada
        </Text>
        <Text style={[styles.descripcion, { color: colors.textSecondary }]}>
          El permiso de cámara fue denegado. Para habilitarlo, andá a Ajustes
          → Aplicaciones → MantenimientoIPF → Permisos → Cámara.
        </Text>

        <Pressable
          id="btn-abrir-ajustes-camara"
          onPress={abrirAjustes}
          style={[styles.btnPrimario, { backgroundColor: '#D97706' }]}
          accessibilityRole="button"
          accessibilityLabel="Abrir Ajustes de la aplicación"
        >
          <Text style={styles.btnPrimarioTexto}>Abrir Ajustes</Text>
        </Pressable>

        <View style={styles.separador}>
          <Text style={[styles.separadorTexto, { color: colors.textSecondary }]}>
            o
          </Text>
        </View>

        <Text style={[styles.labelManual, { color: colors.textSecondary }]}>
          Ingresá el código del aula manualmente:
        </Text>
        <TextInput
          id="input-codigo-aula-manual-bloqueado"
          style={[
            styles.inputManual,
            { color: colors.text, backgroundColor: colors.backgroundElement },
          ]}
          value={codigoManual}
          onChangeText={setCodigoManual}
          placeholder="Ej: Aula 3 / Lab. Informática"
          placeholderTextColor={colors.textSecondary}
        />
        <Pressable
          id="btn-confirmar-manual-bloqueado"
          onPress={confirmarManual}
          style={[styles.btnSecundario, { borderColor: '#2563EB' }]}
        >
          <Text style={[styles.btnSecundarioTexto, { color: '#2563EB' }]}>
            Usar este código
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1 },
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  textoInfo: { fontSize: 15 },
  volverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.three,
  },
  btnVolver: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  btnVolverTexto: { color: '#fff', fontSize: 15, fontWeight: '600' },
  btnVolverTop: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    alignSelf: 'flex-start',
  },
  centradoContenido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  emoji: { fontSize: 54, marginBottom: Spacing.one },
  tituloEstado: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  descripcion: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.two,
  },
  btnPrimario: {
    backgroundColor: '#2563EB',
    paddingHorizontal: Spacing.five,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  btnPrimarioTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  separador: {
    width: '100%',
    alignItems: 'center',
    marginVertical: Spacing.one,
  },
  separadorTexto: { fontSize: 14, fontWeight: '600' },
  labelManual: { fontSize: 13, alignSelf: 'flex-start', fontWeight: '500' },
  inputManual: {
    width: '100%',
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marco: {
    width: 220,
    height: 220,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 16,
  },
  guia: {
    color: '#fff',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  btnSecundario: {
    borderWidth: 1.5,
    paddingHorizontal: Spacing.five,
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  btnSecundarioTexto: { fontWeight: '600', fontSize: 15 },
});
