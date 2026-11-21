import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { colores } from '../constants/tema';

type Props = {
  nombre: ComponentProps<typeof Ionicons>['name'];
  color: ColorValue;
  tamanio: number;
};

export function IconoPestana({ nombre, color, tamanio }: Props) {
  const colorIcono = typeof color === 'string' ? color : colores.textoSecundario;
  return <Ionicons name={nombre} color={colorIcono} size={tamanio} />;
}
