import { CameraView } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { CampoIsbn } from '../components/CampoIsbn';
import { MensajeEstado } from '../components/MensajeEstado';
import { MS_AVISO_ESCANER } from '../constants/config';
import { colores, espaciado, radios, tamanosTexto } from '../constants/tema';
import { usePermiso } from '../hooks/usePermiso';
import { buscarLibroPorIsbn, esIsbnValido } from '../lib/catalogo';

type UltimoCodigo = {
  codigo: string;
  hora: number;
};

export default function PantallaEscanear() {
  const router = useRouter();
  const { estado, abrirAjustes } = usePermiso('camara');
  const [aviso, setAviso] = useState<string | null>(null);
  // Son refs y no estado: el lector llama varias veces por segundo y un estado
  // recién cambiado no se ve hasta el próximo render.
  const libroAbierto = useRef(false);
  const ultimoCodigo = useRef<UltimoCodigo | null>(null);
  const pantallaPrevia = useRef(false);

  function pedirPermiso() {
    router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'camara' } });
  }

  // Antes del diálogo del sistema se muestra la pantalla previa (una vez por visita).
  useEffect(() => {
    if (estado === 'preguntable' && !pantallaPrevia.current) {
      pantallaPrevia.current = true;
      router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'camara' } });
    }
  }, [estado, router]);

  useEffect(() => {
    if (aviso === null) {
      return;
    }
    const temporizador = setTimeout(() => setAviso(null), MS_AVISO_ESCANER);
    return () => clearTimeout(temporizador);
  }, [aviso]);

  // replace: al tocar "atrás" desde el detalle no se vuelve a un escáner ya usado.
  function abrirLibro(isbn: string) {
    if (libroAbierto.current) {
      return;
    }
    if (!esIsbnValido(isbn) || !buscarLibroPorIsbn(isbn)) {
      setAviso('Ese libro no está en el catálogo. Probá con otro.');
      return;
    }
    libroAbierto.current = true;
    router.replace({ pathname: '/libro/[isbn]', params: { isbn } });
  }

  function alLeerCodigo(resultado: BarcodeScanningResult) {
    const ahora = Date.now();
    const previo = ultimoCodigo.current;
    ultimoCodigo.current = { codigo: resultado.data, hora: ahora };
    // Mientras el mismo código siga frente a la cámara, no se repite el aviso.
    if (previo && previo.codigo === resultado.data && ahora - previo.hora < MS_AVISO_ESCANER) {
      return;
    }
    abrirLibro(resultado.data);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={estilos.zonaCamara}>
        {estado === 'cargando' ? <MensajeEstado cargando titulo="Revisando el permiso de la cámara…" /> : null}
        {estado === 'concedido' ? (
          <CameraView
            style={estilos.camara}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['ean13'] }}
            onBarcodeScanned={alLeerCodigo}
          />
        ) : null}
        {estado === 'preguntable' ? (
          <MensajeEstado
            icono="camera-outline"
            titulo="Necesitamos tu permiso para usar la cámara"
            mensaje="Con la cámara leemos el código de barras de la contratapa."
            accionTitulo="Activar la cámara"
            onAccion={pedirPermiso}
          />
        ) : null}
        {estado === 'bloqueado' ? (
          <MensajeEstado
            icono="lock-closed-outline"
            titulo="La cámara está bloqueada"
            mensaje="Podés habilitarla desde los Ajustes del teléfono o escribir el ISBN a mano."
            accionTitulo="Abrir Ajustes"
            onAccion={abrirAjustes}
          />
        ) : null}
      </View>
      <View style={estilos.panel}>
        {aviso ? (
          <Text style={estilos.aviso} accessibilityLiveRegion="polite">
            {aviso}
          </Text>
        ) : null}
        <CampoIsbn onConfirmar={abrirLibro} />
      </View>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  zonaCamara: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colores.fondoSuave,
  },
  camara: {
    flex: 1,
    backgroundColor: colores.fondoCamara,
  },
  panel: {
    gap: espaciado.m,
    padding: espaciado.l,
  },
  aviso: {
    padding: espaciado.m,
    fontSize: tamanosTexto.normal,
    color: colores.aviso,
    backgroundColor: colores.avisoClaro,
    borderRadius: radios.m,
  },
});
