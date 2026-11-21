export class Cola<T> {
  #items: T[] = [];
  #inicio = 0;

  static desde<T>(elementos: readonly T[]): Cola<T> {
    const cola = new Cola<T>();
    for (const elemento of elementos) {
      cola.encolar(elemento);
    }
    return cola;
  }

  get tamanio(): number {
    return this.#items.length - this.#inicio;
  }

  get frente(): T | undefined {
    return this.#items[this.#inicio];
  }

  encolar(elemento: T): void {
    this.#items.push(elemento);
  }

  // Avanza un índice en lugar de usar shift(): sacar del frente no reacomoda el arreglo.
  desencolar(): T | undefined {
    if (this.estaVacia()) {
      return undefined;
    }
    const elemento = this.#items[this.#inicio];
    this.#inicio += 1;
    if (this.#inicio === this.#items.length) {
      this.#items = [];
      this.#inicio = 0;
    }
    return elemento;
  }

  estaVacia(): boolean {
    return this.tamanio === 0;
  }

  // Del frente al final de la cola.
  aArray(): T[] {
    return this.#items.slice(this.#inicio);
  }
}
