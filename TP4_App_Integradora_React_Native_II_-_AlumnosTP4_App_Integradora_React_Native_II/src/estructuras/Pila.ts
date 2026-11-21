export class Pila<T> {
  #items: T[] = [];

  static desde<T>(elementos: readonly T[]): Pila<T> {
    const pila = new Pila<T>();
    for (const elemento of elementos) {
      pila.apilar(elemento);
    }
    return pila;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  get tope(): T | undefined {
    return this.#items[this.#items.length - 1];
  }

  apilar(elemento: T): void {
    this.#items.push(elemento);
  }

  desapilar(): T | undefined {
    return this.#items.pop();
  }

  estaVacia(): boolean {
    return this.#items.length === 0;
  }

  // Del fondo de la pila al tope.
  aArray(): T[] {
    return [...this.#items];
  }
}
