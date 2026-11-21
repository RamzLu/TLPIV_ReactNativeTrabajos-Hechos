// useLocalSearchParams puede devolver un texto o una lista de textos
// (por ejemplo, ?q=a&q=b), así que siempre se normaliza a un único texto.
export function textoDeParametro(valor: string | string[] | undefined): string {
  if (Array.isArray(valor)) {
    return valor[0] ?? '';
  }
  return valor ?? '';
}
