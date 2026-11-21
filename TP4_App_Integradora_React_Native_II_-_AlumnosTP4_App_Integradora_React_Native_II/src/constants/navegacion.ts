import { colores, pesosTexto } from './tema';

export const opcionesPila = {
  headerTintColor: colores.primario,
  headerBackButtonDisplayMode: 'minimal',
  headerTitleStyle: { fontWeight: pesosTexto.fuerte, color: colores.texto },
  contentStyle: { backgroundColor: colores.fondo },
} as const;

export const opcionesPestanas = {
  tabBarActiveTintColor: colores.primario,
  tabBarInactiveTintColor: colores.textoSecundario,
  headerTintColor: colores.primario,
  headerTitleStyle: { fontWeight: pesosTexto.fuerte, color: colores.texto },
} as const;
