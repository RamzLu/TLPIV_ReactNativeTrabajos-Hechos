import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { espaciado } from '../constants/tema';
import { Boton } from './Boton';

export function AccesosCatalogo() {
  const router = useRouter();

  return (
    <View style={estilos.fila}>
      <View style={estilos.celda}>
        <Boton titulo="Buscar" icono="search" onPress={() => router.push('/buscar')} />
      </View>
      <View style={estilos.celda}>
        <Boton
          titulo="Escanear"
          icono="barcode-outline"
          variante="secundario"
          onPress={() => router.push('/escanear')}
        />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    gap: espaciado.m,
  },
  celda: {
    flex: 1,
  },
});
