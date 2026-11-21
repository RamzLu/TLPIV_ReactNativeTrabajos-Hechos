export const colores = {
  primario: '#7A0A2E',
  primarioClaro: '#F6E6EB',
  primarioSuave: '#B9667D',
  fondo: '#FFFFFF',
  fondoSuave: '#F7F5F6',
  superficie: '#FFFFFF',
  texto: '#1E1A1C',
  textoSecundario: '#6B6266',
  textoSobrePrimario: '#FFFFFF',
  borde: '#E4DCDF',
  exito: '#1F7A4C',
  exitoClaro: '#E3F4EA',
  error: '#B3261E',
  errorClaro: '#FBE9E7',
  aviso: '#8A5A00',
  avisoClaro: '#FFF3D6',
  sombra: '#000000',
  fondoCamara: '#000000',
} as const;

export const espaciado = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radios = {
  s: 8,
  m: 12,
  l: 16,
  pildora: 999,
} as const;

export const tamanosTexto = {
  chico: 13,
  normal: 15,
  mediano: 17,
  titulo: 22,
  grande: 28,
} as const;

export const pesosTexto = {
  normal: '400',
  medio: '600',
  fuerte: '700',
} as const;

export const MIN_AREA_TACTIL = 44;

export const sombraTarjeta = {
  shadowColor: colores.sombra,
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;
