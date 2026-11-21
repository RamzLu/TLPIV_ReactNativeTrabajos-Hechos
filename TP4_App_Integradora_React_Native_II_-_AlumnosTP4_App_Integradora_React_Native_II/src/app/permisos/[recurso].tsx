import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Boton } from '../../components/Boton';
import { MensajeEstado } from '../../components/MensajeEstado';
import { RECURSOS_PERMISO, TEXTOS_PERMISO } from '../../constants/permisos';
import { colores, espaciado, pesosTexto, tamanosTexto } from '../../constants/tema';
import { useBiblioteca } from '../../hooks/useBiblioteca';
import { useCerrarPantalla } from '../../hooks/useCerrarPantalla';
import { usePermiso } from '../../hooks/usePermiso';
import { textoDeParametro } from '../../lib/rutas';
import type { RecursoPermiso } from '../../types';

function esRecurso(valor: string): valor is RecursoPermiso {
  return RECURSOS_PERMISO.some((recurso) => recurso === valor);
}

export default function PantallaPermiso() {
  const { recurso: parametro, isbn: parametroIsbn } = useLocalSearchParams<{
    recurso?: string | string[];
    isbn?: string | string[];
  }>();
  const texto = textoDeParametro(parametro);
  const recurso: RecursoPermiso | null = esRecurso(texto) ? texto : null;
  const isbn = textoDeParametro(parametroIsbn);
  const { estado, pedir, abrirAjustes } = usePermiso(recurso ?? 'camara');
  const { activarRecordatorio } = useBiblioteca();
  const cerrar = useCerrarPantalla();

  if (recurso === null) {
    return (
      <View style={estilos.pantalla}>
        <MensajeEstado
          icono="help-circle-outline"
          titulo="No conocemos ese permiso"
          accionTitulo="Cerrar"
          onAccion={cerrar}
        />
      </View>
    );
  }

  const textos = TEXTOS_PERMISO[recurso];

  // Si el permiso se pidió al activar "Recordarme" en un préstamo, se programa recién ahora.
  async function terminar(permitido: boolean) {
    if (permitido && recurso === 'notificaciones' && isbn !== '') {
      await activarRecordatorio(isbn);
    }
    cerrar();
  }

  async function continuar() {
    const resultado = await pedir();
    await terminar(resultado === 'concedido');
  }

  return (
    <View style={estilos.pantalla}>
      <Ionicons name={textos.icono} size={56} color={colores.primario} />
      <Text style={estilos.titulo}>{textos.titulo}</Text>
      <Text style={estilos.beneficio}>{textos.beneficio}</Text>
      {estado === 'cargando' ? <MensajeEstado cargando titulo="Un momento…" /> : null}
      {estado === 'concedido' ? (
        <>
          <Text style={estilos.estado}>Este permiso ya está activado.</Text>
          <Boton titulo="Listo" onPress={() => terminar(true)} />
        </>
      ) : null}
      {estado === 'preguntable' ? <Boton titulo="Continuar" onPress={continuar} /> : null}
      {estado === 'bloqueado' ? (
        <>
          <Text style={estilos.estado}>
            El permiso está bloqueado. Podés activarlo desde los Ajustes del teléfono.
          </Text>
          <Boton titulo="Abrir Ajustes" onPress={abrirAjustes} />
        </>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: {
    flex: 1,
    alignItems: 'stretch',
    gap: espaciado.l,
    padding: espaciado.xl,
    backgroundColor: colores.fondo,
  },
  titulo: {
    fontSize: tamanosTexto.titulo,
    fontWeight: pesosTexto.fuerte,
    color: colores.texto,
  },
  beneficio: {
    fontSize: tamanosTexto.mediano,
    color: colores.texto,
  },
  estado: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
  },
});
