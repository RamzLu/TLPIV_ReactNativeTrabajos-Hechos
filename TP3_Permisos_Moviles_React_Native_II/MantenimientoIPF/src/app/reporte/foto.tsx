import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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

type Modo = 'seleccion' | 'camara';

export default function PantallaFoto() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [modo, setModo] = useState<Modo>('seleccion');
  const [fotoUri, setFotoUri] = useState<string | undefined>();
  const { estado } = usePermiso('camara');
  const camaraRef = useRef<CameraView>(null);
  const [sacandoFoto, setSacandoFoto] = useState(false);

  const elegirDeGaleria = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoUri(resultado.assets[0].uri);
    }
  };

  const activarCamara = () => {
    if (estado === 'concedido') {
      setModo('camara');
    } else if (estado !== 'cargando') {
      router.push('/permisos/camara');
    }
  };

  const sacarFoto = async () => {
    if (!camaraRef.current || sacandoFoto) return;
    setSacandoFoto(true);
    try {
      const foto = await camaraRef.current.takePictureAsync({ quality: 0.8 });
      if (foto) {
        setFotoUri(foto.uri);
        setModo('seleccion');
      }
    } finally {
      setSacandoFoto(false);
    }
  };

  const confirmarFoto = () => {
    if (!fotoUri) {
      Alert.alert('Sin foto', 'Seleccioná o sacá una foto primero.');
      return;
    }
    actualizarBorrador({ fotoUri });
    router.back();
  };

  if (modo === 'camara') {
    if (estado === 'cargando') {
      return (
        <View style={[styles.centrado, { backgroundColor: '#000' }]}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
    }

    return (
      <View style={styles.flex}>
        <CameraView
          id="camara-foto-desperfecto"
          ref={camaraRef}
          style={styles.flex}
          facing="back"
        />

        <SafeAreaView style={styles.controlesOverlay} edges={['bottom', 'top']}>
          <Pressable
            id="btn-cerrar-camara"
            onPress={() => setModo('seleccion')}
            style={styles.btnCerrar}
          >
            <Text style={styles.btnCerrarTexto}>X</Text>
          </Pressable>

          <Pressable
            id="btn-sacar-foto"
            onPress={sacarFoto}
            disabled={sacandoFoto}
            style={[styles.btnDisparo, sacandoFoto && { opacity: 0.5 }]}
            accessibilityLabel="Sacar foto"
          >
            <View style={styles.btnDisparoInner} />
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <Pressable
        id="btn-volver-foto"
        onPress={() => router.back()}
        style={styles.btnVolverTop}
      >
        <Text style={{ color: '#2563EB', fontSize: 16 }}>← Volver</Text>
      </Pressable>

      <View style={styles.contenido}>
        <Text style={[styles.titulo, { color: colors.text }]}>
          Foto del desperfecto
        </Text>

        {fotoUri ? (
          <Image
            source={{ uri: fotoUri }}
            style={styles.preview}
            resizeMode="cover"
            accessibilityLabel="Vista previa de la foto seleccionada"
          />
        ) : (
          <View
            style={[styles.placeholder, { backgroundColor: colors.backgroundElement }]}
          >
            <Text style={[styles.placeholderTexto, { color: colors.textSecondary }]}>
              Aún no hay foto
            </Text>
          </View>
        )}

        <Pressable
          id="btn-sacar-foto-opcion"
          onPress={activarCamara}
          style={[styles.btnOpcion, { backgroundColor: colors.backgroundElement }]}
          accessibilityRole="button"
          accessibilityLabel="Sacar foto con la cámara"
        >
          <View>
            <Text style={[styles.btnOpcionTitulo, { color: colors.text }]}>
              Sacar foto
            </Text>
            <Text style={[styles.btnOpcionSub, { color: colors.textSecondary }]}>
              Usa la cámara del dispositivo
            </Text>
          </View>
        </Pressable>

        <Pressable
          id="btn-elegir-galeria"
          onPress={elegirDeGaleria}
          style={[styles.btnOpcion, { backgroundColor: colors.backgroundElement }]}
          accessibilityRole="button"
          accessibilityLabel="Elegir de la galería sin permiso de fotos"
        >
          <View>
            <Text style={[styles.btnOpcionTitulo, { color: colors.text }]}>
              Elegir de la galería
            </Text>
            <Text style={[styles.btnOpcionSub, { color: colors.textSecondary }]}>
              Abre el selector del sistema (sin permiso)
            </Text>
          </View>
        </Pressable>

        {fotoUri && (
          <Pressable
            id="btn-confirmar-foto"
            onPress={confirmarFoto}
            style={styles.btnConfirmar}
            accessibilityRole="button"
            accessibilityLabel="Usar esta foto"
          >
            <Text style={styles.btnConfirmarTexto}>Usar esta foto</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnVolverTop: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  contenido: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  titulo: { fontSize: 24, fontWeight: '700' },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  placeholderEmoji: { fontSize: 48 },
  placeholderTexto: { fontSize: 14 },
  btnOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 14,
    gap: Spacing.two,
  },
  btnOpcionEmoji: { fontSize: 28 },
  btnOpcionTitulo: { fontSize: 15, fontWeight: '600' },
  btnOpcionSub: { fontSize: 12, marginTop: 2 },
  btnConfirmar: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnConfirmarTexto: { color: '#fff', fontWeight: '700', fontSize: 16 },
  controlesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  btnCerrar: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  btnCerrarTexto: { color: '#fff', fontSize: 18, fontWeight: '700' },
  btnDisparo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  btnDisparoInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});
