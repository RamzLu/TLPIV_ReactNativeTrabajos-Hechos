import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { usePermiso } from '@/hooks/usePermiso';
import type { RecursoPermiso } from '@/lib/tipos';

type ThemeColors = (typeof Colors)[keyof typeof Colors];

interface ConfigRecurso {
  titulo: string;
  beneficio: string;
  instruccionAjustes: string;
}

const CONFIG: Record<RecursoPermiso, ConfigRecurso> = {
  camara: {
    titulo: 'Cámara',
    beneficio:
      'Usamos tu cámara para leer el código QR pegado en la puerta del aula y para sacar fotos del desperfecto en el momento.',
    instruccionAjustes:
      Platform.OS === 'ios'
        ? 'Ajustes → MantenimientoIPF → Cámara → activar'
        : 'Ajustes → Aplicaciones → MantenimientoIPF → Permisos → Cámara',
  },
  ubicacion: {
    titulo: 'Ubicación',
    beneficio:
      'Usamos tu ubicación para registrar exactamente dónde ocurre el desperfecto dentro del instituto y ayudar al equipo de mantenimiento a encontrarlo más rápido.',
    instruccionAjustes:
      Platform.OS === 'ios'
        ? 'Ajustes → MantenimientoIPF → Ubicación → Al usar la app'
        : 'Ajustes → Aplicaciones → MantenimientoIPF → Permisos → Ubicación',
  },
  notificaciones: {
    titulo: 'Notificaciones',
    beneficio:
      'Usamos las notificaciones para avisarte cuando el equipo de mantenimiento resuelve tu reporte, sin que tengas que abrir la app.',
    instruccionAjustes:
      Platform.OS === 'ios'
        ? 'Ajustes → MantenimientoIPF → Notificaciones → activar'
        : 'Ajustes → Aplicaciones → MantenimientoIPF → Notificaciones',
  },
};

export default function PantallaPreviaPermiso() {
  const { recurso } = useLocalSearchParams<{ recurso: string }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const colors: ThemeColors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const esValido =
    recurso && (['camara', 'ubicacion', 'notificaciones'] as string[]).includes(recurso);

  if (!esValido) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.error, { color: colors.text }]}>
          Recurso desconocido: {recurso}
        </Text>
      </SafeAreaView>
    );
  }

  return <ContenidoPrevia recurso={recurso as RecursoPermiso} colors={colors} router={router} />;
}

function ContenidoPrevia({
  recurso,
  colors,
  router,
}: {
  recurso: RecursoPermiso;
  colors: ThemeColors;
  router: ReturnType<typeof useRouter>;
}) {
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const cfg = CONFIG[recurso];
  const bloqueado = estado === 'bloqueado';

  const continuar = async () => {
    if (bloqueado) {
      await abrirAjustes();
      return;
    }
    await pedir();
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <View style={styles.contenido}>
        <Text style={[styles.titulo, { color: colors.text }]}>
          {bloqueado ? `${cfg.titulo} bloqueada` : `Habilitar ${cfg.titulo}`}
        </Text>

        <Text style={[styles.beneficio, { color: colors.textSecondary }]}>
          {cfg.beneficio}
        </Text>

        {bloqueado && (
          <View style={[styles.instruccionBox, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.instruccionTitulo, { color: '#92400E' }]}>
              Cómo habilitarlo:
            </Text>
            <Text style={[styles.instruccionTexto, { color: '#78350F' }]}>
              {cfg.instruccionAjustes}
            </Text>
          </View>
        )}

        <Pressable
          id={`btn-continuar-permiso-${recurso}`}
          onPress={continuar}
          disabled={estado === 'cargando'}
          style={({ pressed }) => [
            styles.btnPrimario,
            { backgroundColor: bloqueado ? '#DC2626' : '#2563EB' },
            pressed && { opacity: 0.85 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={bloqueado ? 'Abrir Ajustes' : 'Continuar'}
        >
          <Text style={styles.btnPrimarioTexto}>
            {bloqueado ? 'Abrir Ajustes' : 'Continuar'}
          </Text>
        </Pressable>

        {!bloqueado && (
          <Text style={[styles.nota, { color: colors.textSecondary }]}>
            Podés cambiar este permiso en cualquier momento desde Ajustes del
            dispositivo.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contenido: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  emoji: { fontSize: 64 },
  titulo: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  beneficio: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  instruccionBox: {
    width: '100%',
    padding: Spacing.three,
    borderRadius: 14,
    gap: Spacing.one,
  },
  instruccionTitulo: { fontSize: 13, fontWeight: '700' },
  instruccionTexto: { fontSize: 13, lineHeight: 20 },
  btnPrimario: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnPrimarioTexto: { color: '#fff', fontWeight: '700', fontSize: 17 },
  nota: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  error: { fontSize: 16, padding: Spacing.three },
});
