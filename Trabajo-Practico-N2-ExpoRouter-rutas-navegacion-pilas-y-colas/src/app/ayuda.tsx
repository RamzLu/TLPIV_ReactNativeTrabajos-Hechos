import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function AyudaPantalla() {
  return (
    <ScrollView style={estilos.contenedor}>
      <Text style={estilos.titulo}>Ayuda y Preguntas Frecuentes</Text>

      <View style={estilos.seccion}>
        <Text style={estilos.subtitulo}>¿Cómo realizar un pedido?</Text>
        <Text style={estilos.texto}>
          Navegá hacia la sección de Menú, seleccioná el plato deseado y hacé clic en "Agregar al carrito". Luego, ingresá a la pestaña Carrito para confirmar tu pedido.
        </Text>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.subtitulo}>¿Cómo funciona el carrito?</Text>
        <Text style={estilos.texto}>
          Podés ver los productos seleccionados, vaciar el carrito por completo o utilizar la opción "Deshacer último" para remover el último elemento agregado utilizando la estructura de pila.
        </Text>
      </View>

      <View style={estilos.seccion}>
        <Text style={estilos.subtitulo}>Acceso a Cocina</Text>
        <Text style={estilos.texto}>
          El panel de cocina está protegido y requiere un inicio de sesión con nombre de operador para gestionar los pedidos entrantes y atendidos.
        </Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  seccion: {
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1976d2',
  },
  texto: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});