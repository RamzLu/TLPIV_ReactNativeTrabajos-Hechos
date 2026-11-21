import { StyleSheet, Switch, Text, View } from 'react-native';

import {
  MIN_AREA_TACTIL,
  colores,
  espaciado,
  pesosTexto,
  radios,
  sombraTarjeta,
  tamanosTexto,
} from '../constants/tema';
import { formatearFecha } from '../lib/formato';
import { Boton } from './Boton';

type Props = {
  titulo: string;
  fechaDevolucion: number;
  recordatorioActivo: boolean;
  onCambiarRecordatorio: (activo: boolean) => void;
  onDevolver: () => void;
};

export function TarjetaPrestamo({
  titulo,
  fechaDevolucion,
  recordatorioActivo,
  onCambiarRecordatorio,
  onDevolver,
}: Props) {
  return (
    <View style={estilos.tarjeta}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.fecha}>Devolvelo antes del {formatearFecha(fechaDevolucion)}</Text>
      <View style={estilos.filaRecordatorio}>
        <Text style={estilos.etiqueta}>Recordarme</Text>
        <Switch
          value={recordatorioActivo}
          onValueChange={onCambiarRecordatorio}
          accessibilityLabel={`Recordarme la devolución de ${titulo}`}
          trackColor={{ true: colores.primarioSuave, false: colores.borde }}
          thumbColor={recordatorioActivo ? colores.primario : colores.fondoSuave}
        />
      </View>
      <Boton titulo="Devolver" variante="peligro" icono="return-down-back" onPress={onDevolver} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    gap: espaciado.s,
    padding: espaciado.l,
    marginHorizontal: espaciado.l,
    marginBottom: espaciado.m,
    backgroundColor: colores.superficie,
    borderRadius: radios.m,
    ...sombraTarjeta,
  },
  titulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.fuerte,
    color: colores.texto,
  },
  fecha: {
    fontSize: tamanosTexto.normal,
    color: colores.textoSecundario,
  },
  filaRecordatorio: {
    minHeight: MIN_AREA_TACTIL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiqueta: {
    fontSize: tamanosTexto.normal,
    color: colores.texto,
  },
});
