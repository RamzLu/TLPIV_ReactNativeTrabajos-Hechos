import { Cola } from '../estructuras/Cola';
import { Pila } from '../estructuras/Pila';

describe('Pila', () => {
  it('desapila en orden inverso al que se apiló', () => {
    const pila = new Pila<string>();
    pila.apilar('a');
    pila.apilar('b');
    pila.apilar('c');
    expect(pila.desapilar()).toBe('c');
    expect(pila.desapilar()).toBe('b');
    expect(pila.tamanio).toBe(1);
  });

  it('devuelve undefined al desapilar una pila vacía', () => {
    const pila = new Pila<number>();
    expect(pila.desapilar()).toBeUndefined();
    expect(pila.tamanio).toBe(0);
  });

  it('tope muestra el último sin sacarlo', () => {
    const pila = Pila.desde([1, 2, 3]);
    expect(pila.tope).toBe(3);
    expect(pila.tamanio).toBe(3);
  });

  it('aArray devuelve una copia del fondo al tope', () => {
    const pila = Pila.desde(['x', 'y']);
    const copia = pila.aArray();
    copia.push('z');
    expect(pila.aArray()).toEqual(['x', 'y']);
  });
});

describe('Cola', () => {
  it('desencola en el orden en que se encoló', () => {
    const cola = new Cola<string>();
    cola.encolar('Ana');
    cola.encolar('Beto');
    cola.encolar('Cora');
    expect(cola.desencolar()).toBe('Ana');
    expect(cola.frente).toBe('Beto');
    expect(cola.tamanio).toBe(2);
  });

  it('devuelve undefined al desencolar una cola vacía', () => {
    const cola = new Cola<number>();
    expect(cola.desencolar()).toBeUndefined();
    expect(cola.tamanio).toBe(0);
    expect(cola.estaVacia()).toBe(true);
  });

  it('sigue funcionando después de vaciarse', () => {
    const cola = Cola.desde([1, 2]);
    cola.desencolar();
    cola.desencolar();
    expect(cola.estaVacia()).toBe(true);
    cola.encolar(3);
    expect(cola.frente).toBe(3);
    expect(cola.aArray()).toEqual([3]);
  });

  it('aArray lista del frente al final', () => {
    const cola = Cola.desde(['a', 'b', 'c']);
    cola.desencolar();
    expect(cola.aArray()).toEqual(['b', 'c']);
  });
});
