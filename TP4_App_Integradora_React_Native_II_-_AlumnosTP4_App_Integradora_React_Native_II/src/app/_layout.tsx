import { StatusBar } from 'expo-status-bar';

import { NavegacionRaiz } from '../components/NavegacionRaiz';
import { ProveedorBiblioteca } from '../context/BibliotecaContext';
import { configurarNotificaciones } from '../lib/notificaciones';

// Con anchor en (tabs), un deep link a /buscar deja las pestañas debajo en la pila.
export const unstable_settings = {
  anchor: '(tabs)',
};

configurarNotificaciones();

export default function LayoutRaiz() {
  return (
    <ProveedorBiblioteca>
      <StatusBar style="dark" />
      <NavegacionRaiz />
    </ProveedorBiblioteca>
  );
}
