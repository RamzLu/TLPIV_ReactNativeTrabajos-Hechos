## **A1. Conceptos:**

*a) ¿Qué significan LIFO y FIFO? ¿Cuál corresponde a la pila y cuál a la cola?*

- **FIFO** significa **"First In, First Out",** esto en español significa "El primero que entra, es el primero en salir" y corresponde a una cola
- **LIFO (Last In, First Out):** En español significa "El último que entra, es el primero en salir". Esto corresponde a una **Pila**

*b)* *¿Por qué extremo entra y por qué extremo sale un elemento en cada estructura?*

- **La Cola:** Los elementos entran por un lado (el final o la parte de atrás) y salen por el extremo opuesto (el frente). Como un tubo donde metes bolitas por un lado y salen por el otro.
- **La Pila:** Los elementos entran y salen exactamente por el *mismo* lugar. Ese único lugar de acceso se llama tope (o la parte de arriba).

*c) Ejemplos de la vida real y de aplicaciones móviles*

1. *FIFO (o cola):*

**Vida real:** La fila para pagar en el supermercado o esperar el colectivo, el primero que llegó a formar fila es el primero en subir al colectivo

**App movil:** cuando pones a descargar fotos o musicas, la app arma una cola interna y descarga primero la que se metio primer

2. LIFO (o pila)

**Vida real:** Una pila de platos limpios, apoyas el ultimo plato lavado arriba de todo y cuando se usa para comer agarras el de arriba que seria el ultimo que se guardo, ya que no puedes sacar el de abajo sin que se caigan los otros

App movil: El boton de "atras" del celular, o si abres inicio y despues perfil, despues ajustes, ya que las pantallas se apilan y si tocas "atras" volverá a la anterior (por ejemplo si estoy en ajustes y le doy "atras" volveria a perfil)

## **A2. Seguimiento de una pila**

- `p.push('Inicio'); `aca lo que hace es poner digamos la pantalla 'Inicio'

  Hace que la pila actua sea:` ['Inicio']`

- `p.push('Productos');` aca agrega una pantalla encima de Inicio como 'Productos'

  Hace que la pila actual sea: `['Inicio', 'Productos']`

- `p.push('Detalle 3');` aca pone 'Detalle 3' arriba de 'Productos'

  Hace que la pila actual sea:`['Inicio', 'Productos', 'Detalle 3']`

- `p.pop();` Aca saca la pantalla de mas arriba o sea 'Detalle 3'

  Hace que la pila actual sea: `['Inicio', 'Productos']`

- `p.push('Perfil');` pone 'Perfil' arriba del todo

  Hace que la pila actual sea: `['Inicio', 'Productos', 'Perfil']`

  ### 

### los console.log serian:

- `console.log(p.tope());`

  seria el que esta arriba del todo: `'Perfil'`

- `console.log(p.pop());`

  saca el elemento de mas arriba (perfil) y lo muestra en consola: `'Perfil'`

- `console.log(p.tope());`

  seria el que esta arriba del todo: `'Productos'`

`console.log(p.vacia);`

pregunta si la pila esta vacia, pero todavia tiene `'Inicio'` y `'Productos'` asi que imprime: `false`

## **A3. Seguimiento de una cola**

- `c.encolar('Ana');` aca Ana llega y se pone primera en la fila.

  *(Cola actual:* `['Ana']`*)*

- `c.encolar('Beto');` Beto llega y se pone detrás de Ana

  *(Cola actual:* `['Ana', 'Beto']`*)*

- `c.desencolar();` se atiende a la persona que está al frente (o sea Ana) y se va de la fila y ahora Beto queda primero

  *(Cola actual:* `['Beto']`*)*

- `c.encolar('Caro');` Llega Caro y se pone detrás de Beto

  *(Cola actual:* `['Beto', 'Caro']`*)*

- `c.encolar('Dani');` Llega Dani y se pone al final.

  *(Cola actual:* `['Beto', 'Caro', 'Dani']`*)*

### los console.log serian:

- `console.log(c.frente());`

  pregunta quien esta al frente: `'Beto'`

- `console.log(c.desencolar());`

  se atiende y se saca de la fila al primero (beto) y lo muestra en consola: `'Beto'`

  la cola queda como `['Caro', 'Dani']`

- `console.log(c.vacia);`

  pregunta si la fila esta vacia, y da `false`porque caro y dani estan ahi

## **A4. Análisis de la implementación**

*a) En las clases de clase, el array se declara como #items. ¿Qué significa el # y qué problema evita?*

1. <span style="color: rgb(74, 158, 232);">respuesta: </span>el simbolo # significa que la variable o campo es **estrictamente privada**, el problema que evita es que alguien manipule los datos desde afuera sin respetar las reglas, por ejemplo si no tuviera el # otra érsona podria escribir pila.items.push("tonto jaja") y meter cosas donde no debe, al ser privada la unica forma de hacerlo es usando metodos que como creadora le deje usar ya que estos tendrian controles, garantizando que el dato vaya exactamente donde debe ir según las reglas

b) La cola usa `array.shift()` para desencolar. ¿Qué problema de rendimiento tiene con colas muy grandes? ¿Cómo lo resuelven las colas "serias"?

1. respuesta: el problema de shift() es que saca al primero de la fila y tiene que mover todos los elementos un lugar adelante para rellenar el hueco, si tuvieramos 999.999 datos y tuvieran que moverse uno por uno consumiria mucha memoria y pondria lenta a la app
2. Las colas serias resuelven esto usando una variable extra (por ejemplo `#frenteIndex = 0`), donde se lee su valor, se limpia esa posicion  (`null `o `undefined`) y se incrementa `#frenteIndex` en 1

<span style="color: rgb(229, 87, 87);">NOTAS</span>:

- Una <u>pila </u>(o stack) es una estructura donde los elementos se colocan uno encima de otro, como una **pila de platos** \
  **Regla:** Solo puedes interactuar con el elemento que está arriba del todo.

  - **Mecanismo (LIFO):** El último elemento que guardas es el primero que vas a sacar.
  - **Operaciones básicas:** `Push` (agregar un elemento arriba) y `Pop` (quitar el elemento de arriba).
  - **Ejemplo real:** El botón **"Deshacer" (Ctrl + Z)** de cualquier programa. El software guarda tus últimas acciones en una pila; al presionar el botón, revierte la última acción que hiciste.

- Una <u>cola</u> (o Queue) es una estructura donde los elementos se colocan uno detrás de otro, como una **fila en el supermercado**.

  - **Regla:** Los nuevos elementos se suman al final de la fila, y se procesan por el principio.
  - **Mecanismo (FIFO):** El primer elemento que llega es el primero en ser atendido y salir.
  - **Operaciones básicas:** `Enqueue` (agregar al final) y `Dequeue` (sacar al primero de la fila).
  - **Ejemplo real:** Una **cola de impresión**. Si mandas tres documentos a imprimir, la impresora los procesará en el estricto orden en que llegaron.

Ejemplo de `#frenteIndex`como si fuera una lista en una hoja de papel

```
#items: T[] = []; //hoja de papel en blanco.
#frenteIndex: number = 0; //Este es el dedo, empezando en el renglón 0

desencolar(): T | undefined {
if (this.vacia) return undefined;
// 1. Leemos qué dice exactamente en el renglón donde está el dedo
const elemento = this.#items[this.#frenteIndex]; // 2. Bajamos el dedo al siguiente renglón (le sumamos 1)
this.#frenteIndex++; // 3. Entregamos el elemento que leímos en el paso 1 return elemento;
}
```