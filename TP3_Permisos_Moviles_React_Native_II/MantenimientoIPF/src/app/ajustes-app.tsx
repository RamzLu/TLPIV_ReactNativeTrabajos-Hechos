import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors, Spacing } from "@/constants/theme";
import { usePermiso } from "@/hooks/usePermiso";
import {
  establecerPreferenciaNotificaciones,
  obtenerPreferenciaNotificaciones,
} from "@/lib/store";

export default function PantallaAjustesApp() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  const { estado } = usePermiso("notificaciones");
  const [preferencia, setPreferencia] = useState(
    obtenerPreferenciaNotificaciones,
  );

  const estaActivo = estado === "concedido" && preferencia;

  const cambiarInterruptor = (valor: boolean) => {
    establecerPreferenciaNotificaciones(valor);
    setPreferencia(valor);
    if (valor && estado !== "concedido") {
      router.push("/permisos/notificaciones");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <Pressable
        id="btn-volver-ajustes"
        onPress={() => router.back()}
        style={styles.btnVolverTop}
      >
        <Text style={{ color: "#2563EB", fontSize: 16 }}>← Volver</Text>
      </Pressable>

      <View style={styles.contenido}>
        <Text style={[styles.titulo, { color: colors.text }]}>
          Ajustes de la app
        </Text>

        <View
          style={[styles.fila, { backgroundColor: colors.backgroundElement }]}
        >
          <View style={styles.filaInfo}>
            <View style={styles.flex}>
              <Text style={[styles.filaLabel, { color: colors.text }]}>
                Avisarme cuando se resuelva mi reporte
              </Text>
              <Text style={[styles.filaSub, { color: colors.textSecondary }]}>
                {estaActivo
                  ? "Recibirás una notificación al resolverse"
                  : "Los avisos aparecerán en la bandeja de Avisos"}
              </Text>
            </View>
            <Switch
              id="switch-notificaciones"
              value={estaActivo}
              onValueChange={cambiarInterruptor}
              disabled={estado === "cargando"}
              trackColor={{ false: "#D1D5DB", true: "#2563EB" }}
              thumbColor="#fff"
              accessibilityLabel="Activar notificaciones de resolución de reportes"
            />
          </View>
        </View>

        {!estaActivo && (
          <View style={[styles.info, { backgroundColor: "#EFF6FF" }]}>
            <Text style={[styles.infoTexto, { color: "#1E40AF" }]}>
              Sin notificaciones, los avisos estarán disponibles en la
              bandeja de Avisos de la app.
            </Text>
            <Pressable
              id="btn-ir-avisos"
              onPress={() => router.push("/avisos")}
            >
              <Text style={[styles.enlace, { color: "#2563EB" }]}>
                Ver bandeja de Avisos →
              </Text>
            </Pressable>
          </View>
        )}

        <Pressable
          id="btn-ir-permisos"
          onPress={() => router.push("/permisos")}
          style={[
            styles.enlaceSeccion,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <Text style={[styles.enlaceSeccionTexto, { color: colors.text }]}>
            Ver estado de permisos →
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
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
  titulo: { fontSize: 24, fontWeight: "700" },
  fila: {
    borderRadius: 16,
    padding: Spacing.three,
  },
  filaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  filaEmoji: { fontSize: 24 },
  flex: { flex: 1, gap: 2 },
  filaLabel: { fontSize: 15, fontWeight: "600" },
  filaSub: { fontSize: 12, lineHeight: 18 },
  info: {
    padding: Spacing.three,
    borderRadius: 14,
    gap: Spacing.one + 2,
  },
  infoTexto: { fontSize: 13, lineHeight: 20 },
  enlace: { fontSize: 13, fontWeight: "600" },
  enlaceSeccion: {
    padding: Spacing.three,
    borderRadius: 14,
  },
  enlaceSeccionTexto: { fontSize: 15, fontWeight: "500" },
});
