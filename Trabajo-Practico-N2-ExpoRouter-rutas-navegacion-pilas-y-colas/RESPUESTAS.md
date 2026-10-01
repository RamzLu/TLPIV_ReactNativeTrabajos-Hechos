## **A1. Conceptos:**

***a) ¿Qué significan LIFO y FIFO? ¿Cuál corresponde a la pila y cuál a la cola?***

- **FIFO** significa **"First In, First Out",** esto en español significa "El primero que entra, es el primero en salir" y corresponde a una cola
- **LIFO (Last In, First Out):** En español significa "El último que entra, es el primero en salir". Esto corresponde a una **Pila**

***b)* *¿Por qué extremo entra y por qué extremo sale un elemento en cada estructura?***

- **La Cola:** Los elementos entran por un lado (el final o la parte de atrás) y salen por el extremo opuesto (el frente). Como un tubo donde metes bolitas por un lado y salen por el otro.
- **La Pila:** Los elementos entran y salen exactamente por el *mismo* lugar. Ese único lugar de acceso se llama tope (o la parte de arriba).

***c) Ejemplos de la vida real y de aplicaciones móviles***

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

***a) En las clases de clase, el array se declara como #items. ¿Qué significa el # y qué problema evita?***

1. <span style="color: rgb(74, 158, 232);">respuesta: </span>el simbolo # significa que la variable o campo es **estrictamente privada**, el problema que evita es que alguien manipule los datos desde afuera sin respetar las reglas, por ejemplo si no tuviera el # otra pérsona podria escribir pila.items.push("tonto jaja") y meter cosas donde no debe, al ser privada la unica forma de hacerlo es usando metodos que como creadora le deje usar ya que estos tendrian controles, garantizando que el dato vaya exactamente donde debe ir según las reglas

**b) La cola usa** `array.shift()` **para desencolar. ¿Qué problema de rendimiento tiene con colas muy grandes? ¿Cómo lo resuelven las colas "serias"?**

1. respuesta: el problema de shift() es que saca al primero de la fila y tiene que mover todos los elementos un lugar adelante para rellenar el hueco, si tuvieramos 999.999 datos y tuvieran que moverse uno por uno consumiria mucha memoria y pondria lenta a la app
2. Las colas serias resuelven esto usando una variable extra (por ejemplo `#frenteIndex = 0`), donde se lee su valor, se limpia esa posicion (`null `o `undefined`) y se incrementa `#frenteIndex` en 1

## A5. Programación: una cola eficiente

mirar el archivo de ColaEficiente.js:

```javascript
class ColaEficiente {
    #items = []; //el simbolo # significa que la lista es privada, nadie de afuera puede verla ni modificarla
    #frenteIndex = 0; // aca se crea un numereo que arranca de 0, tambien es privada


    encolar(x) { //hacemos un metodo que recibe un dato cualquiera (x) 
        this.#items.push(x) //aqui lo q hace es agarrar la lista que se hizo arriba y empujar el dato que recibio encolar(x) al final del todo
    }
    desencolar(){ //otro metodo para sacar el primer dato de la lista
        if (this.vacia) return undefined; //primero se fija si la lista esta vacia, y si lo esta devuelve undefined y frena la accion
        const elemento = this.#items[this.#frenteIndex]; //aca hacemos que mire en la lista donde esta marcado nuestro #frenteIndex y guarde ese dato en la constante elemento
        this.#frenteIndex++; //el ++ odena que si el numero valia 0 ahora vale 1, entonces avanza la posicion sin borrar nada
        return elemento; //y finalmente entrega el dato que habiamos guardado en elemento
    }

    frente() {
        if (this.vacia) return undefined //antes de buscar un dato verifica que la lista no este vacia
        return this.#items[this.#frenteIndex] // si la lista no esta vacia va a la lista (this.#items) mira la posicion exacta que marca nuestro #frenteIndex y agarra el dato y lo devuelve para verlo
    }

    get vacia() { //el get seria como un sensor mas q una orden
        return this.#frenteIndex >= this.#items.length //se hace una comparacion entre #frenteIndex contra la cantidad de cosas guardadas
    } //por ejemplo, si guarde dos cosas en la lista, pero la posisicion ya avanzo a la dos avisa que ya recorrio todo entonces expulsa un true (que la lista SI esta vacia)
    //o si se guardo dos cosas pero la posicion es 0, entonces 0 >= 2 = false, entonces la lista NO esta vacia

    get tamanio() {
        return this.#items.length - this.#frenteIndex //aca hace una resta matematica, agarra la cantidad de elemento que en algun momento entraron en la lista y le resta el numero de posiciones que se avanzo y devuelve la respuesta
    }
}


//console logs 
console.log("Se abrio la cocina")
const pedidos = new ColaEficiente()

console.log("Tres alumnos piden comida")
pedidos.encolar("Hamburgesa para Stella")
pedidos.encolar("Ensalada para Vivi")
pedidos.encolar("Milanesa para Kiara")

console.log(`Pedidos en espera: ${pedidos.tamanio}`)
console.log(`El cocinero mira el ticker al frente: "${pedidos.frente()}"`);


console.log("Se empieza a trabajar")
console.log(`Sale el pedido: ${pedidos.desencolar()}`) //stella
console.log(`Sale el pedido: ${pedidos.desencolar()}`) //Sale vivi

console.log("Estado actual")
console.log(`Pedidos restantes en espera ${pedidos.tamanio}`)
console.log(`El cocinero mira el siguiente ticket: "${pedidos.frente()}"`)


console.log("Sale el ultimo pedido: ",pedidos.desencolar())
console.log("La cocina esta sin pedidos?", pedidos.vacia)
```

## A6. Pila y cola dentro de Expo Router

***a) ¿Qué estructura describe el historial de pantallas de un Stack? ¿Qué pantalla es la visible y qué operación hace “atrás”?***

- La estructura: esa exactamente una pila, como cartas que se van apoyando una arriba de la otra en una mesa
- La pantalla visible: es siempre la que esta en el <u>tope</u> (la ultima que se puso arriba del todo
- La operacion de "atras": hace exactamenta la accion de pop(), o sea, agarra la pantalla que esta arriba del todo, la saca y la descarta y deja ver la pantalla que quedo abajo

***b) ¿Qué estructura usa Expo Router para las acciones de navegación? ¿Qué pasa si el usuario toca dos links muy rápido?***

- La estructura: Para organizar los toques o clicks la app usa internamente una Cola
- Si el usaurio toca dos links muy rapido: como funciona con unna fila ordenada si el usuario toca dos botones muy rapido, el app simplemente pone la primera accion enfrente de la cola y la accion justo detras, respetando el orden exacto en el que ocurrieron.

# Parte B · Rutas basadas en archivos

## B1. Del archivo a la URL

- src/app/(tabs)/index.tsx:

  URL: / la ruta raiz o pantalla de inicio (index siempre representa la ruta principal de la carpeta donde está)

  por que: el (tabs) es invisible, al ser un archivo index, es la pagina por defecto de la aplicacion

- src/app/acerca.tsx:

  URL: /acerca

  por que: es un archivo normal sin simbolos, toma exactamente el nombre del archivo para crear la ruta

- src/app/(tabs)/perfil.tsx:

  URL: /perfil

  por que: la carpeta (tabs) es invisible para la url, asi que solo toma la palabra perfil

- src/app/(tabs)/productos/index.tsx:

  URL: /productos

  por que: el (tabs) invisible, entra a la carpeta productos y como el archivo es index no suma palabras extra, es la pagina principal de la seccion de productos

- src/app/(tabs)/productos/\[id\].tsx:

  URL: /productos/1, productos/23, etc

  por que: los corchetes \[\] le avisan al sistema que ahi va un dato variable, sirve para mostrar el detalle de un producto especifico dependiendo del numero que llegue en la URL

- src/app/docs/\[...slug\].tsx:

  URL: /docs/react, docs/react/hooks, o cualquier cosa que vaya después

  por que: los tres puntos "…" dentro de los corchetes significan que atra todo, como un comodin que acepta cualquier ruta que empiece con /docs/ sin importan cuantas / haya despues

- src/app/\_layout.tsx:

  URL/FUNCION: no genera una pantalla visible por si sola, funciona como un marco o molde para las demás pantallas en la carpeta

  por que: el \_ le indica a Expo ROuter que este archivo sirve para configurar o organizar elementos repetitivos como la cabecera, el menú de navegación, las barras laterales y el pie de página o manejar la navegación entre pantallas, permitiendo configurar componentes como pilas (`Stack`), pestañas (`Tabs`)

- src/app/+not-found.tsx:

  URL/FUNCION: Aparece cuando el usuario pone una url que no existe (Error 404 por ejemplo)

  por que: el simbolo + indica que es una palabra reservada del sistema para manejar rutas no encontradas

- src/app/Boton.tsx

  URL/FUNCION: genera un problema de mala practica

  por que: si es un simple boton para el diseño al estar dentro de la carpeta de app expo intenta convertirlo en pantalla y completa la url con /Boton, los componentes como estos no deben estar e app, sino en carpetas separadas como en /components/

## B2. De la URL al archivo

- URL: `/categorias/bebidas (y cualquier otra categoría)`

  **archivo**: src/app/categorias/\[categoria\].tsx

  **por que**: como la palabra bebidas puede cambiar a postres o kiosco cualquier otra cosa no se puede crear un archivo para cada una, en vez de eso se crea una carpeta con categorias y dentro se pone \[\], eso para decirle que dentro va una variable culquiera

- URL: `/buscar?q=mate&categoria=kiosco`

  **archivo:** src/app/buscar.tsx o src/app/buscar/index.tsx

  **por que**: en internet todo lo que esta despues del signo ? son datos extra como parametros que se le envia a la pantalla, pero no formar parte de la ruta, para el sistema de archivos la url es solo /buscar, por eso se crea un archivo simple de buscar.tsx

- URL: `/ayuda/pagos/tarjeta` y `/ayuda/horarios`

  **archivo**: src/app/ayuda/\[...slug\].tsx

  **por que**: como la url tiene dos barras (/pagos/tarjetas) y la otra solo tiene una (/horarios) la profundidad puede variar y ser infinita, un simple \[id\] no alcanza, se necesita un comodin como los … dentro (\[…\]) esto hace que atrapen todo lo que venga despues de la carpeta "ayuda" sin importar cuantas barras tenga

- URL: `/ayuda (con una pantalla propia)`

  **archivo**: src/app/ayuda/index.tsx

  **por que**: ya tenemos una carpeta ayuda, solo creamos el archivo index.ts dentro de esa carpeta y asi representa la pantalla principal de la carpeta donde se esta guardando

# B3. Verdadero o falso

**a) Con Expo Router, cada pantalla nueva se debe registrar en una tabla de configuración.** <span style="color: rgb(229, 87, 87);">Flaso</span>

<u>Justificacion:</u> La gran ventaja de Expo es justamente el enrutamiento basado en archivos, al crear un archivo en la carpeta de app se convierte en una ruta de la aplicacion, no se necesita ir a ningun archivo ni tabla para registrarlo

b) Los archivos *layout.tsx son pantallas que el usuario puede visitar.* <span style="color: rgb(229, 87, 87);">Flaso</span>

<u>Justificacion:</u> El \_ indica que es un molde o maarco que envuelve a las verdaderas pantallas, el usuario nunca navega directo al layout sino en las pantallas que estan dentro de el

*c) Una carpeta entre paréntesis, como (tabs), no aparece en la URL.* <span style="color: rgb(87, 179, 91);">*Verdadero*</span>

*d) Para agregar una librería conviene usar npm install, porque siempre trae la última versión.* <span style="color: rgb(229, 87, 87);">*Falso*</span>

<u>Justificacion:</u> traer la ultima version trae problemas, si se hace npm install se podria bajar una libreria que no es compatible con el proyecto y se rompa, conviene usar npx expo install porque busca la version exacta que hace juego con el Expo SDK

*e) En package.json, "main": "expo-router/entry" reemplaza al viejo App.tsx.* <span style="color: rgb(87, 179, 91);">*Verdadero*</span>

*f) La ruta* /sitemap lista todas las rutas de la app y sirve para depurar. <span style="color: rgb(87, 179, 91);">Verdadero</span>

g) Si existen docs/index.tsx y docs/\[...slug\].tsx, la URL /docs muestra docs/index.tsx. <span style="color: rgb(87, 179, 91);">Verdadero</span>

h) En SDK 57, expo-router usa el mismo número de versión mayor que el SDK (57). <span style="color: rgb(87, 179, 91);">Verdadero</span>

# Parte C · Navegar: , router y la pila

## C1. Métodos de router

- router.push(href):

  Que hace: apila una pantalla completamente nueva en el tope

- router.navigate(href)

  Que hace: Primero revisa si esa pantalla ya estaba en algun lugar de la pila, si ya estaba te lleva hacia a ella sino funciona igual que push y apila arriba del todo

- router.replace(href)

  Que hace: Saca la pantalla actual (la de arriba del todo) e inmediatamente pone otra en su lugar, y como reemplazo la anterior en vez de ponerla encuma si ahora toca atras no puede volver a la que saco, por ejemplo es util cuando inicia sesion, pasa del login al inicio reemplazando la pantalla, asi el usuario no puede volver al login tocando atras

- router.back()

  Que hace: hace la operacion de pop(), saca y descarta la pantalla que esta en el tope de la pila, dejandote ver la que esta debajo

- router.dismissTo(href)

  Que hace: Descarta varias pantallas juntas desde arriba, bajando en la pila hasta encontrar la pantalla específica que le pediste, y la deja en el tope. Es ideal para cuando te metiste muy profundo (ej: Inicio -&gt; Menú -&gt; Producto -&gt; Confirmar) y quieres volver a "Menú" de un solo salto, tirando todas las demás.

- router.dismissAll()

  Que hace: Saca absolutamente todas las pantallas de arriba hacia abajo, dejándote únicamente con la primera pantalla de todas (la base de la pila).

- router.canGoBack()

  Que hace: No le hace absolutamente nada. Solo se asoma a mirar y responde con un `true` (verdadero) si hay más de una pantalla en la pila para poder retroceder, o `false` (falso) si estás en la base y ya no hay a dónde volver.

- router.setParams({...})

  Tampoco agrega ni quita pantallas. Solo le cambia los datos (parámetros) a la pantalla que está actualmente en el tope de la pila, sin obligarte a recargarla.

## C2. Simulación de la pila

1. router.push("/productos/1")

Qué pasa: Apilamos la nueva pantalla arriba de la base.

Pila resultante: \[ /productos, /productos/1 \]

2. router.push("/productos/2")

Qué pasa: Apilamos otra pantalla más en el tope.

Pila resultante: \[ /productos, /productos/1, /productos/2 \]

3. router.navigate("/productos/5")

Qué pasa: navigate busca si /productos/5 ya estaba en la pila. Como no estaba, actúa igual que un push y la agrega arriba de todo.

Pila resultante: \[ /productos, /productos/1, /productos/2, /productos/5 \] 4) router.push("/perfil")

Qué pasa: Apilamos la pantalla de perfil en el tope.

Pila resultante: \[ /productos, /productos/1, /productos/2, /productos/5, /perfil \] 5) router.replace("/buscar")

Qué pasa: ¡Ojo aquí! replace no apila. Saca la última pantalla (/perfil) y pone /buscar exactamente en ese mismo lugar.

Pila resultante: \[ /productos, /productos/1, /productos/2, /productos/5, /buscar \] 6) router.back()

Qué pasa: Hace un paso hacia atrás, sacando la pantalla que quedó en el tope (/buscar).

Pila resultante: \[ /productos, /productos/1, /productos/2, /productos/5 \] 7) router.dismissTo("/productos")

Qué pasa: Tira todas las pantallas necesarias desde arriba hasta encontrar /productos y dejarla en el tope. Como /productos estaba en la base, descartamos todas las demás de un solo golpe.

Pila resultante: \[ /productos \] 8) router.canGoBack() → ¿qué devuelve?

Qué pasa: Solo mira la pila actual. Como nos quedó una sola pantalla (\[ /productos \]), ya no hay ninguna carta debajo para retroceder.

Pila resultante (respuesta): Devuelve false.

## C3. ¿Link o router?

a) El usuario toca la tarjeta de un producto en una lista.

- &lt;Link&gt;

- Método/Prop: href="/productos/id" (o la ruta que sea).

- Justificación: Es un simple toque que lleva a otra pantalla. No hay que calcular ni guardar nada antes de viajar, así que el enlace directo es la mejor opción y la más rápida.

b) Se guarda un formulario, la API responde OK y hay que mostrar la pantalla de éxito.

- router

- Método/Prop: router.replace('/exito') (o router.push('/exito')).

- Justificación: La navegación no ocurre apenas el usuario toca el botón "Guardar", sino que el código tiene que viajar a internet (la API), esperar la respuesta, y recién después de que todo sale bien, la aplicación decide cambiar de pantalla. Como hay lógica en el medio, usamos el router.

c) Botón “Cancelar” dentro de un modal.

router

- Método/Prop: router.back()

- Justificación: Al cancelar, no queremos viajar a un lugar nuevo, solo queremos retroceder, tirar la pantalla actual (el modal) a la basura y quedarnos donde estábamos. router.back() es perfecto para deshacer ese último paso.

d) Después de un login exitoso hay que ir a la pantalla principal.

- router

- Método/Prop: router.replace('/')

- Justificación: Igual que en el formulario, primero hay que validar que el usuario y la clave sean correctos. Usamos específicamente replace en lugar de push para borrar la pantalla de Login de la pila. Así, si el usuario toca "atrás" por accidente, no vuelve a la pantalla de poner la contraseña.

e) Volver desde el detalle de un pedido directamente a la lista de pedidos, que quedó tres pantallas más abajo.

- router

- Método/Prop: router.dismissTo('/pedidos')

- Justificación: Como acabamos de aprender en el ejercicio anterior, dismissTo es exactamente la herramienta que descarta varias pantallas de un solo golpe para regresarte a una base específica, limpiando todo el historial intermedio.

## C4. Escribí el código

**a)** Un &lt;Link&gt; que abra el producto con id 8 usando href como objeto.

```
<Link href={{ pathname: "/productos/[id]", params: { id: 8 } }}>
  Ver Producto 8
</Link>
```

En lugar de escribir la ruta de una sola vez como un texto simple ("/productos/8"), abrimos llaves {} para pasarle un objeto (una colección de datos). Le decimos: "El molde de la ruta es /productos/\[id\] (el pathname), y el dato que quiero meter en ese molde es el número 8 (los params)". Esto es súper útil cuando el número "8" viene de una base de datos y no lo sabemos de antemano.

**b)** Un &lt;Link&gt; a /perfil que siempre apile, aunque la pantalla ya exista.

```
<Link href="/perfil" push>
  Ir a mi Perfil
</Link>
```

Por defecto, los links de Expo son inteligentes y si la pantalla de perfil ya está abierta abajo en la pila, te llevan a ella sin crear una nueva (eso es navigate). Al agregarle simplemente la palabra push, le damos la orden estricta: "No me importa si ya existe, quiero que imprimas una carta nueva idéntica y la pongas en el tope de la pila".

c) Un botón (Pressable) propio que funcione como link a /carrito usando asChild.

```
<Link href="/carrito" asChild>
  <Pressable>
    <Text>Ir al Carrito</Text>
  </Pressable>
</Link>
```

Normalmente, &lt;Link&gt; crea su propio texto azul tocable. Pero a veces queremos que nuestro propio botón personalizado (el Pressable) tenga el poder de viajar. La palabra mágica asChild (que significa "como hijo") hace que el &lt;Link&gt; se vuelva invisible y le pase todos sus "poderes de teletransportación" directamente al botón que tiene adentro. Así, logramos un botón con nuestro propio diseño, pero que navega como un link profesional.

## C5. Pensar

En una web, cada &lt;Link&gt; se convierte en un &lt;a href&gt; real. ¿Qué ventaja concreta tiene eso para el usuario?

```
   Tiene muchísimas ventajas para el usuario de computadora. Al ser un enlace web de verdad, el usuario puede hacerle **clic derecho y elegir "Abrir en una pestaña nueva"**. También puede pasar el mouse por encima y ver en la esquina inferior de la pantalla hacia dónde lo va a llevar antes de hacer clic. Además, permite que los buscadores (como Google) puedan leer tu página y entender cómo se conectan tus pantallas.
```

¿Qué pasa en el celular, donde no hay barra de direcciones?

```
     En el celular, como no existen las "pestañas nuevas" ni el "clic derecho", Expo Router es inteligente y convierte ese `<Link>` en un elemento táctil nativo (básicamente, funciona como un botón). Al tocarlo, no cambia la dirección en una barra (porque no la hay), sino que ejecuta la acción de **apilar una nueva carta** (la nueva pantalla) sobre la pila que venimos hablando.
```

# Parte D · Navegadores: Stack, Tabs y Drawer

## D1. Comparación

1. Stack (La pila)

- ¿Apila pantallas?: Sí. Cada pantalla nueva se pone encima de la anterior.

- ¿Cómo cambia de pantalla el usuario?: Tocando botones/links dentro de la pantalla, o usando la flecha y el gesto de "Atrás" del celular.

- ¿Desde dónde se importa en SDK 57?: `expo-router`.

- Un caso de uso típico: Entrar desde la lista de "Todos los productos" hacia la pantalla de "Detalle de una hamburguesa".

### 

2. Tabs (Las pestañas)

- ¿Apila pantallas?: No. Cambia entre pantallas paralelas y principales.

- ¿Cómo cambia de pantalla el usuario?: Tocando los íconos de la barra inferior (bottom bar).

- ¿Desde dónde se importa en SDK 57?: `expo-router`.

- Un caso de uso típico: La navegación principal de tu app. Ejemplo: Inicio | Carrito | Mi Perfil.

3. Drawer (El menú lateral)

- ¿Apila pantallas?: No. Al igual que los Tabs, cambia la pantalla principal que estás viendo.
- ¿Cómo cambia de pantalla el usuario?: Deslizando el dedo desde el borde izquierdo hacia el centro, o tocando el ícono de "hamburguesa" (las tres rayitas arriba a la izquierda).
- ¿Desde dónde se importa en SDK 57?: `expo-router/drawer`
- Un caso de uso típico: Para guardar opciones secundarias que ocuparían mucho espacio en los Tabs. Ejemplo: Configuración, Términos y condiciones, Ayuda, Cerrar sesión.

## D2. Cada tab tiene su pila

En una app con pestañas Inicio y Productos (Productos tiene su propio Stack), el usuario está en Productos, abre el detalle del producto 4, cambia a Inicio y vuelve a Productos.

- ¿Qué pantalla ve?
  - Ve el detalle del producto 4.
- ¿Por qué?
  - Porque cada pestaña (Tab) tiene y recuerda su propia "pila" independiente. Cuando cambiaste a la pestaña de Inicio, el sistema no destruyó la torre de cartas que habías armado en la sección de Productos, simplemente la dejó en pausa. Al volver a tocar ese Tab, retomas exactamente donde te quedaste: mirando la carta que quedó en el tope.
- ¿Qué app que uses todos los días se comporta así?
- **Instagram**: Si estás en la pestaña de inicio (la casita) y entras a mirar el perfil de alguien, luego te vas a la pestaña de buscar (la lupa), y finalmente vuelves a tocar la casita, la app no te manda de vuelta al principio de tu muro. Sigues exactamente en el perfil donde te habías quedado. (También pasa igual en WhatsApp o Spotify).

## D3. ¿Dónde va cada pantalla?

Aplicando la regla práctica de navegadores anidados, indicá si cada pantalla va en el Stack raíz o dentro de una tab:

1. El detalle de un producto, que debe mantener visible la barra de pestañas.

**Respuesta:** Dentro de una tab.

**Justificación:** Como el enunciado exige que la barra de abajo siga visible, la pantalla tiene que vivir en la pila interna de esa pestaña. 2. Un modal para confirmar una compra, que debe tapar la barra de pestañas.

**Respuesta:** En el Stack raíz.

**Justificación:** Al pedir que el modal tape la barra de pestañas, necesitamos que la pantalla se dibuje en la capa más alta de la aplicación, totalmente por fuera del navegador de Tabs. 3. La pantalla de login que se abre como modal.

**Respuesta:** En el Stack raíz.

**Justificación:** El inicio de sesión es el ejemplo clásico de una pantalla que debe ocupar todo el celular. No queremos que el usuario pueda ver ni tocar la barra de pestañas del menú principal hasta que no ponga su usuario y contraseña correctamente. 4. La pantalla “Mis pedidos anteriores” dentro de la sección Perfil.

**Respuesta:** Dentro de una tab.

**Justificación:** Es una pantalla secundaria que se abre buceando más profundo dentro de una sección principal (el Perfil). Al estar dentro de un Tab, la barra inferior sigue visible, permitiéndole al usuario saltar de vuelta al "Inicio" en cualquier momento con un solo toque.

## D4. Configurar el Stack

1. ¿Qué diferencia hay entre screenOptions y las options de un Stack.Screen?

screenOptions (que se pone en la etiqueta principal &lt;Stack&gt;) es como una regla general de la casa: afecta a todas las pantallas por igual al mismo tiempo. En cambio, las options (que van en &lt;Stack.Screen&gt;) son reglas específicas para una sola habitación. Si a una pantalla le pones sus propias options, estas ignoran la regla general y hacen lo que ellas dicen. 2. ¿Por qué (tabs) tiene headerShown: false?

Porque la sección de pestañas suele tener sus propios títulos arriba (uno para Inicio, otro para Productos, etc.). Si no apagamos el título general de la base poniendo esto en falso, el usuario vería dos barras de títulos encimadas, una arriba de la otra. 3. Si existe src/app/perfil-publico.tsx pero no está declarada en el Stack, ¿existe la pantalla? ¿Para qué sirve declararla?

con solo crear el archivo, la pantalla y la ruta ya funcionan solas. Declararla a mano acá en el layout solo sirve si necesitas personalizar su diseño (por ejemplo, cambiarle el título, o hacer que aparezca como un modal). Si la quieres normalita, no hace falta que la anotes 4. Nombrá cuatro valores posibles de presentation. ¿Cuál usarías para una hoja inferior que se abre al 50%?

Cuatro opciones comunes son: 'card' (la normal que desliza de costado), 'modal' (sube desde abajo y tapa todo), 'transparentModal' (como el modal pero con fondo transparente), y 'formSheet' (hoja inferior). 5. ¿Cómo cambiarías el título del header desde la propia pantalla de detalle para que diga “Producto 7”?

No lo cambias en este layout general, sino que vas al archivo de la pantalla en sí, y en el código agregas este componente de React: &lt;Stack.Screen 'Producto 7' options="{{" title: }}/&gt;. De esta forma, la pantalla misma se hace cargo de cambiar su propio cartelito de arriba.

## D5. Tabs y Drawer en SDK 57

1. ¿Qué cambió en SDK 57 al importar Tabs? ¿Qué alternativa experimental existe?

La importación de Tabs se consolidó y se hace directamente desde 'expo-router'. La alternativa experimental que se está probando son los "Native Tabs" (pestañas 100% nativas), que buscan conectarse aún más directo con el sistema operativo del celular para ser más rápidas, aunque todavía están en fase de pruebas 2. ¿Qué dos paquetes necesita el Drawer y qué componente conviene poner en el layout raíz para los gestos?

Necesita exactamente los dos paquetes que ya instalaste en tu proyecto: react-native-gesture-handler y react-native-reanimated. Para que el celular detecte bien el gesto de tu dedo al deslizar el menú, conviene envolver toda la aplicación (en tu layout raíz) con el componente &lt;GestureHandlerRootView&gt; 3. ¿Hace falta instalar @react-navigation/drawer en SDK 57? ¿Por qué?

No, no hace falta (y no debes hacerlo). Expo Router ya lo trae integrado y escondido "bajo el capó". Solo necesitas importarlo escribiendo import { Drawer } from 'expo-router/drawer'. Si lo instalas por separado a mano, vas a chocar versiones y romper la aplicación 4. Si hay navegadores anidados, ¿en qué navegador actúa router.back()?

Actúa siempre en el navegador más cercano o "más profundo" en el que se encuentre el usuario. Por ejemplo, si estás dentro de una pila de Productos, que a su vez está dentro de una pestaña, router.back() solo va a retroceder las cartas de la pila de Productos, sin sacarte de la pestaña

# Parte E · Rutas dinámicas, parámetros y hooks

## E1. Encontrá el error

Los productos tienen id numérico ({ id: 3, nombre: "Chipá" }). La pantalla nunca encuentra el producto. Explicá por qué y corregilo.

```
src/app/(tabs)/productos/[id].tsx
export default function DetalleProducto() {
 const { id } = useLocalSearchParams<{ id: string }>();
 const producto = productos.find((p) => p.id === id);
 if (id === 3) console.log('Es el chipá');
 if (!producto) return <Text>No existe el producto {id}</Text>;
 return <Text>{producto.nombre}</Text>;
}
```

El problema está en el formato de los datos. En internet, todo lo que viaja a través de una URL (como el final de tu ruta /productos/3) siempre se lee como texto puro.

Entonces, cuando el código saca el { id } de la URL en la primera línea, el celular recibe el texto "3" (una palabra), no el número matemático 3.

Sin embargo, la lista de productos tiene el ID guardado como un número real ({ id: 3 }). Cuando usas el triple igual (===) en la línea del find (p.id === id), le estás pidiendo a la computadora que verifique que sean idénticos de forma estricta. Como el número matemático 3 no es estrictamente igual al texto "3", la computadora dice "no es lo mismo" y la búsqueda falla siempre. (Lo mismo pasa con el if (id === 3) que está debajo)

**Como solucionarlo:**

```
export default function DetalleProducto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  //convertimos el texto 'id' a un número real
  const idNumero = Number(id); 

  //comparamos número con número en la búsqueda
  const producto = productos.find((p) => p.id === idNumero);
  
  // este console.log ahora también funciona
  if (idNumero === 3) console.log('Es el chipá');
  
  if (!producto) return <Text>No existe el producto {id}</Text>;
  
  return <Text>{producto.nombre}</Text>;
}
```

## E2. Catch-all

Para src/app/docs/\[...slug\].tsx, indicá el valor de slug en cada caso:

1. URL: /docs/react

- Valor de slug: \["react"\]

- Explicación: Hay una sola palabra después de la carpeta docs, así que te devuelve una lista con ese único dato.

2. URL: /docs/react/hooks/useState

- Valor de slug: \["react", "hooks", "useState"\]

- Explicación: Corta la ruta en cada barra y arma una lista ordenada con las tres palabras.

3. URL: /docs

- Valor de slug: No coincide / Da error 404 (undefined)

- Explicación: ¡Este es un caso trampa! El comodín de un solo corchete \[...slug\] exige que haya por lo menos una cosa escrita después de la carpeta. Como la URL termina en "docs" y no hay nada más, este archivo no se activa. (Dato ninja: si quisieras que atrape también a la ruta vacía, el archivo tendría que escribirse con doble corchete: \[\[...slug\]\].tsx)

## E3. Anatomía de una URL

Dada la URL rutasipf://buscar?q=mate&categoria=bebidas:

1. Identificá el scheme, la ruta y los parámetros de búsqueda.

   **Scheme** (el nombre único de la app): rutasipf (es todo lo que está antes del ://).

   **Ruta** (la pantalla específica): buscar (o /buscar).

   **Parámetros de búsqueda** (los datos extra): q=mate y categoria=bebidas (todo lo que viene después del signo de interrogación ?, separado por el &).

2. ¿Qué devuelve useLocalSearchParams() en buscar.tsx?

   **Respuesta:** Devuelve automáticamente un objeto empaquetando esos datos extra. Quedaría exactamente así: { q: "mate", categoria: "bebidas" }

3. ¿Hacen falta corchetes en el nombre del archivo para recibir q? ¿Por qué?

   **Respuesta:** No, no hacen falta corchetes.

   **Por qué:** Porque los corchetes (ej: \[id\].tsx) solo se usan cuando el dato dinámico es parte de la ruta principal (como /productos/3). Pero todo lo que escribimos después del signo de interrogación ? se consideran "datos extra" (query parameters). Cualquier archivo normal, como buscar.tsx, puede leer esos datos extra usando useLocalSearchParams() sin necesidad de cambiar su nombre

4. En el buscador, cada vez que el usuario escribe se llama a router.setParams({ q: texto }) en lugar de router.push. Dá dos razones.

   **Razón 1 (El historial infinito):** Si usarás push, por cada letra que escribas (por ejemplo: "m", "ma", "mat", "mate"), el celular apilaría una pantalla nueva en tu historial. Si el usuario quisiera tocar el botón "Atrás", tendría que retroceder letra por letra. Al usar setParams, no apilamos cartas nuevas, solo le cambiamos el texto a la carta que ya estamos viendo.

   **Razón 2 (Rendimiento):** Dibujar una pantalla nueva desde cero con push requiere que el celular piense y trabaje mucho. setParams es mucho más rápido y fluido, ideal para actualizar la pantalla al instante mientras los dedos del usuario se mueven rápido por el teclado.

## E4. ¿Dónde estoy?

Completá los valores de cada hook en las dos URLs de la app de ejemplo (buscar.tsx está en el Stack raíz; el detalle está en (tabs)/productos/\[id\].tsx)

1. En /productos/3

- usePathname(): "/productos/3"

  (Explicación: Devuelve la dirección web limpia y bonita, tal como la vería el usuario).

- useSegments(): \["(tabs)", "productos", "\[id\]"\]

  (Explicación: Devuelve la ruta real de tus carpetas. Como el enunciado dice que el archivo está dentro de (tabs), este hook sí lee los paréntesis y el nombre original del archivo con corchetes).

- useLocalSearchParams(): { id: "3" }

  (Explicación: Atrapa el número que reemplazó al comodín \[id\]).

2. En /buscar?q=chipa

- usePathname(): "/buscar"

  (Explicación: Devuelve la URL limpia, ignorando todo lo que está después del signo de interrogación ?).

- useSegments(): \["buscar"\]

  (Explicación: Como el enunciado dice que está en el Stack raíz, no hay carpetas previas, solo el nombre del archivo).

- useLocalSearchParams(): { q: "chipa" }

  (Explicación: Atrapa todos los datos extra que viajan al final de la URL).

## E5. Local vs global

1. ¿Cuál es la diferencia entre useLocalSearchParams y useGlobalSearchParams? ¿Cuál es la opción por defecto y por qué? }

**Respuesta:** useLocalSearchParams atrapa únicamente los datos (parámetros) que fueron enviados directamente a la pantalla que estás viendo. Por el contrario, useGlobalSearchParams atrapa los datos de todas las pantallas que están vivas en el fondo de la pila en ese momento.

**Por defecto y por qué**: Se usa por defecto useLocalSearchParams. Es mucho más seguro porque aísla tu pantalla; así evitas que los datos de otra pestaña o pantalla vieja se mezclen por accidente con la pantalla actual y te rompan la lógica. 2. ¿Para qué sirve useFocusEffect? Dá un ejemplo de uso.

**Respuesta:** Sirve para ejecutar un bloque de código solamente cuando la pantalla vuelve a estar en primer plano (cuando el usuario la está viendo activamente). Como en los celulares las pantallas se apilan y no se destruyen, el clásico useEffect a veces no se entera de que volviste a mirar una pantalla que estaba abajo en la pila.

**Ejemplo de uso:** La pantalla de "Mi Carrito". Usas useFocusEffect para pedirle a la base de datos que actualice los precios y el stock cada vez que el usuario entra a esa pestaña, garantizando que nunca vea información vieja. 3. La URL /productos/mate abre la pantalla de detalle aunque no exista ese producto. ¿Es un error de Expo Router? ¿De quién es la responsabilidad?

**Respuesta:** ¡No es un error de Expo Router! Su único trabajo es de tránsito: vio una ruta que encajaba con el molde /productos/\[id\] y abrió la puerta hacia ese archivo. Expo Router no sabe qué vendes en tu comedor.

**De quién es la responsabilidad:** Es 100% responsabilidad del desarrollador (nuestra). Es la pantalla misma la que debe agarrar la palabra "mate", buscarla en la base de datos, y si no la encuentra, dibujar un cartel que diga "Lo sentimos, producto no encontrado".

# Parte F · Redirecciones, rutas protegidas y deep links

## F1. Redirect

a) ¿Qué hace `<Redirect href="/productos"/>` y a qué método de router equivale?

Sirve para mandar al user automaticamente e instantaneamente a otra pantalla apenas intenta entrar a la actual, su equivalente seria router.replace

b) ¿Por qué una redirección debe reemplazar y no apilar? Describí el problema que aparecería

Si la redireccion apilara la nueva pantalla la pantalla original quedaria guardada en el historial, el problema seria que si el user toca el boton atras volveria a la pantalla que tiene Redirect y lo volveria a llevar hacia adelante y el user queda atrapado infinitamente

## F2. Stack.Protected

Completá los guard para que privado solo exista con sesión y login solo sin sesión. Luego respondé.

```
src/app/_layout.tsx
function NavegacionRaiz() {
 const { usuario } = useAuth();
 const conSesion = usuario !== null;
 return (
 <Stack>
 <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
 <Stack.Protected guard={conSesion}>
 <Stack.Screen name="privado" />
 </Stack.Protected>
 <Stack.Protected guard={conSesion}>
 <Stack.Screen name="login" options={{ presentation: 'modal' }} />
 </Stack.Protected>
 </Stack>
 );
}
```

a) ¿Qué le pasa a una pantalla cuando su guard es false?

La pantalla desaparece por completo del mapa de navegacion. No es que se hace invisible para Expo Router, literalmente deja de existir y no se puede viajar hacia ella de ninguna forma

b) Al iniciar sesión, el modal de login se cierra solo, sin llamar a router.back(). ¿Por qué?

Al iniciar sesion el login se cierra por la reactividad de los datos o sea que cuando el user inicia sesion la variable conSesion se hace ture y hace que la condicion del login !conSesion se hace false, y el Stack.Protected "borra" el login y lo saca de la pila automaticamente

c) Aparece el aviso "The action 'NAVIGATE'... was not handled by any navigator". ¿Qué lo causa y cómo se evita?

Pasa cuando se intenta navegar hacia una pantalla que en ese momento tiene su guard en false como este borro del mapa, el router se confunde y le avisa que no encuencuentra donde ir, y se evita redirigiendo al usuario o ocultando los botones que lleven a esa zona si no tiene permisos

d) ¿Qué ventaja tiene `Stack.Protected` frente a poner un `<Redirect>` condicional en cada pantalla?

Le da seguridad al codigo y queda mas limpio, con redirect dentro de la pantalla esta primero se tiene que renderizar para leer el codigo y ahi recien enviarle hacia afuera (que puede dejar expuestos datos sensibles por un segundo) pero con Stack.Protected controla todo desde un archivo y la pantalla no se llega ni a cargar

## F3. 404, anchor y rutas tipadas

Explicá brevemente para qué sirve cada uno y en qué archivo se define:

a) +not-found.tsx

Es la pantalla de Error 404 de pagina no encontrada, expo lo manda automaticamente a esta pantalla en vez de romperse

Se define en la raiz de la carpeta principal de las rutas

b) export const unstable_settings = { anchor: "(tabs)" }

Si el usuario entra a la app mediante un link directo a una pantalla profunda,se obliga a cargar el navegador `(tabs)` en el historial de forma invisible antes de mostrarle la pantalla final

se define adentro del archivo de configuración `_layout.tsx`

c) `typedRoutes`: ¿qué pasa si escribís `<Link href="/prodcutos"/>`? ¿Dónde se generan los tipos?

Si escribe prodcutos el editor de codigo tira error, porque las rutas tipadaspq el codigo verifica la URL exista, Expo los genera de forma automática y los guarda en segundo plano

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

- Usas `<Link>` cuando el viaje es directo. El usuario toca con el dedo y *pum*, viaja a la otra pantalla, sin pensar nada más.
- Usas `router` cuando la aplicación tiene que "pensar" o hacer algo antes de viajar (como calcular, guardar en una base de datos o validar una contraseña).