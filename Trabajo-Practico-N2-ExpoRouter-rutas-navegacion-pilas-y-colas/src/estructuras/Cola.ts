export class Cola<T> {
  #items: T[] = [];
  #frente = 0;

  encolar(elemento: T) {
    this.#items.push(elemento);
  }

  desencolar(): T | undefined {
    if (this.vacia) return undefined;
    
    const elemento = this.#items[this.#frente];
    this.#frente++; 
    
    return elemento;
  }

  frente(): T | undefined {
    if (this.vacia) return undefined;
    return this.#items[this.#frente];
  }

  get vacia(): boolean {
    return this.#frente >= this.#items.length;
  }

  get tamanio(): number {
    return this.#items.length - this.#frente;
  }

  aArray(): T[] {
    return this.#items.slice(this.#frente);
  }
}