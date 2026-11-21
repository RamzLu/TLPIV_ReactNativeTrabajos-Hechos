import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text } from 'react-native';

import { AvisoApp } from '../../components/AvisoApp';
import { EstadoNotificaciones } from '../../components/EstadoNotificaciones';
import { MensajeEstado } from '../../components/MensajeEstado';
import { TarjetaEspera } from '../../components/TarjetaEspera';
import { TarjetaPrestamo } from '../../components/TarjetaPrestamo';
import { colores, espaciado, pesosTexto, tamanosTexto } from '../../constants/tema';
import { useBiblioteca } from '../../hooks/useBiblioteca';
import { usePermiso } from '../../hooks/usePermiso';
import { buscarLibroPorIsbn } from '../../lib/catalogo';

type Fila =
  | { clave: string; tipo: 'encabezado'; texto: string }
  | { clave: string; tipo: 'prestamo'; isbn: string; titulo: string; fechaDevolucion: number; recordatorioActivo: boolean }
  | { clave: string; tipo: 'espera'; titulo: string; posicion: number; total: number };

export default function PantallaReservas() {
  const router = useRouter();
  const {
    prestamos,
    misEsperas,
    avisos,
    devolver,
    activarRecordatorio,
    desactivarRecordatorio,
    descartarAviso,
  } = useBiblioteca();
  const permiso = usePermiso('notificaciones');

  const filas: Fila[] = [];
  if (prestamos.length > 0) {
    filas.push({ clave: 'encabezado-prestamos', tipo: 'encabezado', texto: 'Mis préstamos' });
    for (const prestamo of prestamos) {
      filas.push({
        clave: `prestamo-${prestamo.isbn}`,
        tipo: 'prestamo',
        isbn: prestamo.isbn,
        titulo: buscarLibroPorIsbn(prestamo.isbn)?.titulo ?? prestamo.isbn,
        fechaDevolucion: prestamo.fechaDevolucion,
        recordatorioActivo: prestamo.recordatorioId !== null,
      });
    }
  }
  if (misEsperas.length > 0) {
    filas.push({ clave: 'encabezado-espera', tipo: 'encabezado', texto: 'En lista de espera' });
    for (const espera of misEsperas) {
      filas.push({
        clave: `espera-${espera.libro.isbn}`,
        tipo: 'espera',
        titulo: espera.libro.titulo,
        posicion: espera.posicion,
        total: espera.total,
      });
    }
  }

  // El permiso se pide solo al activar el interruptor, y pasando antes por la pantalla previa.
  function cambiarRecordatorio(isbn: string, activar: boolean) {
    if (!activar) {
      desactivarRecordatorio(isbn);
    } else if (permiso.estado === 'concedido') {
      activarRecordatorio(isbn);
    } else if (permiso.estado !== 'cargando') {
      router.push({ pathname: '/permisos/[recurso]', params: { recurso: 'notificaciones', isbn } });
    }
  }

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={estilos.lista}
      contentContainerStyle={estilos.contenido}
      data={filas}
      keyExtractor={(fila) => fila.clave}
      renderItem={({ item }) => {
        if (item.tipo === 'encabezado') {
          return (
            <Text style={estilos.encabezado} accessibilityRole="header">
              {item.texto}
            </Text>
          );
        }
        if (item.tipo === 'prestamo') {
          return (
            <TarjetaPrestamo
              titulo={item.titulo}
              fechaDevolucion={item.fechaDevolucion}
              recordatorioActivo={item.recordatorioActivo}
              onCambiarRecordatorio={(activar) => cambiarRecordatorio(item.isbn, activar)}
              onDevolver={() => devolver(item.isbn)}
            />
          );
        }
        return <TarjetaEspera titulo={item.titulo} posicion={item.posicion} totalEnEspera={item.total} />;
      }}
      ListHeaderComponent={
        <>
          {avisos.map((aviso) => (
            <AvisoApp key={aviso.id} mensaje={aviso.mensaje} onCerrar={() => descartarAviso(aviso.id)} />
          ))}
          <EstadoNotificaciones estado={permiso.estado} onAbrirAjustes={permiso.abrirAjustes} />
        </>
      }
      ListEmptyComponent={
        <MensajeEstado
          icono="bookmark-outline"
          titulo="Todavía no reservaste libros"
          mensaje="Cuando reserves uno, lo vas a ver acá con su fecha de devolución."
          accionTitulo="Ir al Catálogo"
          onAccion={() => router.navigate('/')}
        />
      }
    />
  );
}

const estilos = StyleSheet.create({
  lista: {
    backgroundColor: colores.fondo,
  },
  contenido: {
    paddingTop: espaciado.l,
    paddingBottom: espaciado.xl,
  },
  encabezado: {
    marginHorizontal: espaciado.l,
    marginBottom: espaciado.m,
    fontSize: tamanosTexto.mediano,
    fontWeight: pesosTexto.fuerte,
    color: colores.texto,
  },
});
