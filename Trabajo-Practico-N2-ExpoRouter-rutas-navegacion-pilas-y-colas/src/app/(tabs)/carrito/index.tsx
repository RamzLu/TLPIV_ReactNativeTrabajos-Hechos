import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useGlobalContext } from '../../../../src/context/GlobalContext';
import { Link } from 'expo-router';

export default function CarritoPantalla() {
  const { carrito, deshacerUltimo, vaciarCarrito } = useGlobalContext();

  const total = carrito.reduce((acumulado, plato) => acumulado + plato.precio, 0);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Tu Carrito</Text>

      {carrito.length === 0 ? (
        <Text style={estilos.vacio}>El carrito está vacío</Text>
      ) : (
        <>
          <FlatList
            data={carrito}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={estilos.item}>
                <Text style={estilos.nombrePlato}>{item.nombre}</Text>
                <Text style={estilos.precioPlato}>${item.precio}</Text>
              </View>
            )}
          />

          <View style={estilos.contenedorBotonesAccion}>
            <Pressable style={estilos.botonDeshacer} onPress={deshacerUltimo}>
              <Text style={estilos.textoBotonSecundario}>Deshacer último</Text>
            </Pressable>

            <Pressable style={estilos.botonVaciar} onPress={vaciarCarrito}>
              <Text style={estilos.textoBotonSecundario}>Vaciar carrito</Text>
            </Pressable>
          </View>

          <View style={estilos.footer}>
            <Text style={estilos.totalTexto}>Total: ${total}</Text>
            <Link href="/confirmar" asChild>
              <Pressable style={estilos.botonConfirmar}>
                <Text style={estilos.textoBotonPrincipal}>Confirmar pedido</Text>
              </Pressable>
            </Link>
          </View>
        </>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  vacio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombrePlato: {
    fontSize: 16,
    color: '#333',
  },
  precioPlato: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  contenedorBotonesAccion: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  botonDeshacer: {
    flex: 1,
    backgroundColor: '#ff9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonVaciar: {
    flex: 1,
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonSecundario: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  botonConfirmar: {
    backgroundColor: '#2e7d32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonPrincipal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});