export class Pila<T> {
  #items: T[] = [];

  push(elemento: T) {
    this.#items.push(elemento);
  }

  pop(): T | undefined {
    return this.#items.pop();
  }

  tope(): T | undefined {
    if (this.vacia) return undefined;
    return this.#items[this.#items.length - 1];
  }

  get vacia(): boolean {
    return this.#items.length === 0;
  }

  get tamanio(): number {
    return this.#items.length;
  }

  aArray(): T[] {
    return [...this.#items];
  }
}