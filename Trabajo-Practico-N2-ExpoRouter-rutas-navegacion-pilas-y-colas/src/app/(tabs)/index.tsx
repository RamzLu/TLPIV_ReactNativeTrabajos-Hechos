import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function PantallaInicio() {
  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Comedor IPF</Text>
      <Text style={estilos.subtitulo}>Seleccioná una sección para comenzar</Text>

      <View style={estilos.grid}>
        <Link href="/(tabs)/menu" asChild>
          <Pressable style={estilos.tarjeta}>
            <Text style={estilos.textoTarjeta}>Menú</Text>
          </Pressable>
        </Link>

        <Link href="/buscar" asChild>
          <Pressable style={estilos.tarjeta}>
            <Text style={estilos.textoTarjeta}>Buscar</Text>
          </Pressable>
        </Link>

        <Link href="/ayuda" asChild>
          <Pressable style={estilos.tarjeta}>
            <Text style={estilos.textoTarjeta}>Ayuda</Text>
          </Pressable>
        </Link>

        <Link href="/cocina" asChild>
          <Pressable style={estilos.tarjeta}>
            <Text style={estilos.textoTarjeta}>Cocina</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  grid: {
    width: '100%',
    gap: 12,
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textoTarjeta: {
    fontSize: 18,
    fontWeight: '600',
  },
});