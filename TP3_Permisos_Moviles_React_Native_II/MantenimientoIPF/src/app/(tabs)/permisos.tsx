import { useRouter } from 'expo-router';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import {
  limpiarSimulacionPermisos,
  reiniciarPermisosSimulados,
} from '@/lib/store';
import type { EstadoPermiso, RecursoPermiso } from '@/lib/tipos';

type ThemeColors = (typeof Colors)[keyof typeof Colors];

const CONFIG_ESTADO: Record<
  EstadoPermiso,
  { label: string; color: string; bg: string }
> = {
  cargando: { label: 'Cargando…', color: '#6B7280', bg: '#F3F4F6' },
  concedido: { label: 'Concedido', color: '#065F46', bg: '#D1FAE5' },
  preguntable: { label: 'Sin decidir', color: '#92400E', bg: '#FEF3C7' },
  bloqueado: { label: 'Bloqueado', color: '#991B1B', bg: '#FEE2E2' },
};

const ITEMS: { recurso: RecursoPermiso; label: string }[] = [
  { recurso: 'camara', label: 'Cámara' },
  { recurso: 'ubicacion', label: 'Ubicación' },
  { recurso: 'notificaciones', label: 'Notificaciones' },
];

export default function PantallaPermisos() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors: ThemeColors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const revocarEnAjustes = () => {
    Alert.alert(
      'Revocar permisos',
      'Te llevaremos a la pantalla de la app en Ajustes del teléfono. Tocá en Permisos y desactivá Cámara, Ubicación o Notificaciones para volver a probar.',
      [
        { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  const reiniciarPermisosEnApp = () => {
    reiniciarPermisosSimulados();
    Alert.alert(
      'Permisos reiniciados',
      'Todos los permisos se restablecieron a estado Sin decidir dentro de la app para que puedas probar los flujos.',
    );
  };

  const restaurarPermisosReales = () => {
    limpiarSimulacionPermisos();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.titulo, { color: colors.text }]}>Permisos</Text>
          <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
            Plataforma: {Platform.OS === 'ios' ? 'iOS' : 'Android'}
          </Text>
        </View>

        {ITEMS.map((item) => (
          <TarjetaPermiso
            key={item.recurso}
            recurso={item.recurso}
            label={item.label}
            colors={colors}
            router={router}
          />
        ))}

        <View
          style={[
            styles.panelGestion,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <Text style={[styles.gestionTitulo, { color: colors.text }]}>
            Revocación y pruebas de permisos
          </Text>
          <Text style={[styles.gestionDesc, { color: colors.textSecondary }]}>
            En dispositivos móviles los permisos son controlados por el sistema
            operativo. Podés revocarlos en Ajustes o reiniciar el estado a Sin
            decidir directamente en la app.
          </Text>

          <Pressable
            id="btn-revocar-permisos-ajustes"
            onPress={revocarEnAjustes}
            style={styles.btnGestionPrimario}
            accessibilityRole="button"
            accessibilityLabel="Abrir Ajustes del teléfono para revocar permisos"
          >
            <Text style={styles.btnGestionPrimarioTexto}>
              Abrir Ajustes para revocar permisos
            </Text>
          </Pressable>

          <Pressable
            id="btn-reiniciar-permisos-app"
            onPress={reiniciarPermisosEnApp}
            style={styles.btnGestionSecundario}
            accessibilityRole="button"
            accessibilityLabel="Reiniciar permisos en la app a sin decidir"
          >
            <Text style={styles.btnGestionSecundarioTexto}>
              Reiniciar permisos en la app (Sin decidir)
            </Text>
          </Pressable>

          <Pressable
            id="btn-restaurar-reales"
            onPress={restaurarPermisosReales}
            style={styles.btnGestionTexto}
            accessibilityRole="button"
            accessibilityLabel="Restablecer lectura de permisos reales"
          >
            <Text style={[styles.btnGestionTextoLink, { color: '#2563EB' }]}>
              Leer permisos reales del sistema
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.nota, { color: colors.textSecondary }]}>
          Este panel se actualiza automáticamente al volver de Ajustes.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function TarjetaPermiso({
  recurso,
  label,
  colors,
  router,
}: {
  recurso: RecursoPermiso;
  label: string;
  colors: ThemeColors;
  router: ReturnType<typeof useRouter>;
}) {
  const { estado, matiz, abrirAjustes } = usePermiso(recurso);
  const cfg = CONFIG_ESTADO[estado];

  const presionarBoton = async () => {
    if (estado === 'bloqueado') {
      await abrirAjustes();
      return;
    }
    if (estado === 'preguntable') {
      router.push(`/permisos/${recurso}`);
    }
  };

  return (
    <View
      id={`panel-permiso-${recurso}`}
      style={[styles.tarjeta, { backgroundColor: colors.backgroundElement }]}
    >
      <View style={styles.tarjetaHeader}>
        <View style={styles.flex}>
          <Text style={[styles.tarjetaLabel, { color: colors.text }]}>
            {label}
          </Text>
          {matiz && (
            <Text style={[styles.matiz, { color: colors.textSecondary }]}>
              {matiz}
            </Text>
          )}
        </View>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.badgeTexto, { color: cfg.color }]}>
            {cfg.label}
          </Text>
        </View>
      </View>

      {estado !== 'concedido' && estado !== 'cargando' && (
        <Pressable
          id={`btn-permiso-${recurso}`}
          onPress={presionarBoton}
          style={[
            styles.btnAccion,
            {
              backgroundColor: estado === 'bloqueado' ? '#DC2626' : '#2563EB',
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            estado === 'bloqueado'
              ? `Abrir Ajustes para ${label}`
              : `Habilitar ${label}`
          }
        >
          <Text style={styles.btnAccionTexto}>
            {estado === 'bloqueado' ? 'Abrir Ajustes' : 'Habilitar'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { padding: Spacing.three, gap: Spacing.three, paddingBottom: 100 },
  header: { gap: 4 },
  titulo: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  subtitulo: { fontSize: 13 },
  tarjeta: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  tarjetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  tarjetaEmoji: { fontSize: 26 },
  flex: { flex: 1, gap: 2 },
  tarjetaLabel: { fontSize: 16, fontWeight: '600' },
  matiz: { fontSize: 12 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  badgeTexto: { fontSize: 12, fontWeight: '600' },
  btnAccion: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnAccionTexto: { color: '#fff', fontWeight: '700', fontSize: 14 },
  nota: { fontSize: 12, textAlign: 'center', paddingTop: Spacing.two },
  panelGestion: {
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  gestionTitulo: {
    fontSize: 16,
    fontWeight: '700',
  },
  gestionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  btnGestionPrimario: {
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  btnGestionPrimarioTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnGestionSecundario: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnGestionSecundarioTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  btnGestionTexto: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  btnGestionTextoLink: {
    fontSize: 13,
    fontWeight: '600',
  },
});
