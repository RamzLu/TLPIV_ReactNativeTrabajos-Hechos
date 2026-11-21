# RESPUESTAS · TP N° 4 · Biblioteca IPF

Todas las respuestas se refieren al código de este repositorio. Las referencias tienen el formato `archivo:línea`.

---

# Parte B · Estado, efectos y renderizado

## B1. El ciclo de vida de `useLibros`

### a) Render por render

Hook: `src/hooks/useLibros.ts`. Pantalla: `src/app/(tabs)/(catalogo)/index.tsx`.

**Caso feliz** (la API responde bien):

| Render | Qué lo provoca | `libros` | `cargando` | `error` |
| --- | --- | --- | --- | --- |
| 1 | Montaje del Catálogo | `[]` | `true` | `null` |
| 2 | Llega la respuesta a los 800 ms | los 17 libros | `false` | `null` |

- Después del render 1 se ejecuta el efecto (`useLibros.ts:12-37`), que llama a `cargar()` y pide los datos.
- Cuando `await obtenerLibros()` termina (línea 17), se llaman `setLibros`, `setError(null)` y `setCargando(false)`. React 19 agrupa esas tres actualizaciones, así que hay **un solo** render. `setError(null)` ni siquiera cuenta, porque el valor ya era `null`.

**Caso con falla** (1 de cada 5 veces) y después “Reintentar”:

| Render | Qué lo provoca | `libros` | `cargando` | `error` |
| --- | --- | --- | --- | --- |
| 1 | Montaje | `[]` | `true` | `null` |
| 2 | `obtenerLibros()` lanza el error y entra al `catch` (línea 22) | `[]` | `false` | “No pudimos cargar el catálogo…” |
| 3 | La persona toca “Reintentar”: `reintentar()` hace `setError(null)`, `setCargando(true)` y `setIntento(+1)` (líneas 40-44) | `[]` | `true` | `null` |
| 4 | Llega la nueva respuesta | los 17 libros (o vuelve al render 2 si falla otra vez) | `false` | `null` |

- Los tres `setState` del render 3 están dentro de un evento táctil, por eso se agrupan en un solo render.
- Al cambiar `intento` (que está en el array de dependencias, línea 37), React primero corre la limpieza del efecto anterior y después el efecto nuevo, que vuelve a pedir los datos.

### b) ¿Se desmonta el Catálogo?

- **Al cambiar a “Mis reservas”: no.** Las pestañas de Expo Router mantienen montadas las pantallas que ya se abrieron.
- **Al abrir un detalle: tampoco.** El Stack propio de la pestaña (`(tabs)/(catalogo)/_layout.tsx`) deja el Catálogo montado debajo del detalle.

Se puede comprobar con un `console.log` temporal dentro de la limpieza (`useLibros.ts:34-36`): no se imprime al cambiar de pestaña ni al abrir un detalle.

La limpieza escrita en `useLibros.ts:34-36` se ejecuta en estas situaciones reales:

1. **Al tocar “Reintentar”**, porque cambia `intento` y React limpia el efecto anterior antes de correr el nuevo. Es la situación más frecuente.
2. **Al desmontarse** el Catálogo, es decir, cuando se cierra la app o se destruye el navegador de pestañas.
3. **En desarrollo**, cuando Fast Refresh recarga el archivo.

Si la limpieza corre mientras el pedido sigue en vuelo, `cancelado = true` hace que la respuesta tardía se descarte y no actualice un estado que ya no existe.

### c) ¿Por qué no se puede pasar una función `async` a `useEffect`?

Porque una función `async` siempre devuelve una `Promise`, y React espera que el efecto devuelva `undefined` o una **función de limpieza**. React intentaría tratar la promesa como si fuera la limpieza, y TypeScript también lo marca como error.

Lo resolví declarando la función `async` **adentro** del efecto y llamándola, mientras el efecto en sí es síncrono y devuelve la limpieza:

```ts
useEffect(() => {
  let cancelado = false;
  async function cargar() { /* ... await obtenerLibros() ... */ }   // líneas 15-31
  cargar();                                                        // línea 33
  return () => { cancelado = true; };                              // líneas 34-36
}, [intento]);
```

### d) ¿Cómo implementé `reintentar`?

`reintentar` (`useLibros.ts:40-44`) limpia el error, vuelve a poner `cargando` en `true` y **suma 1 al contador `intento`**. Como `intento` está en el array de dependencias (línea 37), el cambio hace que React vuelva a ejecutar el efecto y se repita el pedido.

Elegí un contador y no otro valor porque:

- **Cambia siempre.** Cada toque produce un valor distinto, así que el efecto siempre se vuelve a ejecutar. `error`, por ejemplo, podría seguir siendo el mismo texto y React no dispararía el efecto.
- **No genera bucles.** No depende de `libros` ni de `cargando`, que el propio efecto modifica.
- **No tiene otro significado.** Sirve únicamente para “pedir de nuevo”.
- **Mantiene el pedido dentro del efecto**, junto con su limpieza.

## B2. La condición de carrera del buscador

Hook: `src/hooks/useBusqueda.ts`.

| Momento | Qué pasa | Sin limpieza: qué se ve | Con mi código: qué se ve |
| --- | --- | --- | --- |
| t = 0 ms | Escribe “bor”; se pide `buscarLibros("bor")` (tarda 1.400 ms) | “Buscando…” | “Buscando…”. Mi hook espera 300 ms antes de pedir (`useBusqueda.ts:47`), así que todavía no se pidió nada |
| t = 200 ms | Escribe “borges”; se pide `buscarLibros("borges")` (tarda 300 ms) | “Buscando…” | “Buscando…”. El cambio de `consulta` ejecuta la limpieza: `clearTimeout` cancela el pedido de “bor”, que **nunca llega a salir** |
| t = 500 ms | Llega la respuesta de “borges” | Resultados de “borges” (correcto) | Se pide “borges” (a los 500 ms, por el debounce) y se sigue mostrando “Buscando…” hasta su respuesta |
| t = 1.400 ms | Llega la respuesta de “bor” | **Error visible:** los resultados de “bor” pisan a los de “borges”, mientras el campo dice “borges” | Nada cambia: si el pedido de “bor” hubiera salido, `descartada` sería `true` y se ignora (`useBusqueda.ts:35`) |

Hay dos defensas, una detrás de la otra:

1. La **limpieza** descarta la respuesta vieja (`descartada = true`) y cancela el temporizador pendiente.
2. Aun si se colara una respuesta vieja, el estado guarda **el texto al que pertenece** (`respuesta.texto`). En `useBusqueda.ts:64` solo se muestra si coincide con la consulta actual.

### a) ¿Qué hace la limpieza y cuándo se ejecuta?

La limpieza (`useBusqueda.ts:49-52`) hace dos cosas: pone `descartada = true` y llama a `clearTimeout`. Se ejecuta **antes de cada nueva ejecución del efecto**, es decir, cuando cambia `consulta` o `intento`, y también al desmontar la pantalla.

Cuando `consulta` cambia, la limpieza del efecto viejo corre antes de que arranque el nuevo. La respuesta que estaba en camino queda “marcada” como descartada y, cuando llega, el `if (!descartada)` la ignora.

### b) La propuesta del compañero: `if (texto === q) setResultados(datos)`

**No funciona.** La función del `.then()` es una **clausura**: guarda las variables tal como valían en el render donde se creó el efecto. Dentro de ella, `q` vale lo que valía **en ese momento**, no lo que vale ahora. Como `texto` es justamente esa misma búsqueda, la comparación siempre da `true`, y la respuesta vieja se muestra igual (el problema de “bor” a los 1.400 ms).

Para comparar con el valor **actual** haría falta un `useRef` que siempre guarde la última consulta, o una bandera de cancelación como la mía.

### c) La URL y el botón atrás

Mientras la persona escribe, `router.setParams({ q })` (`buscar.tsx:19`) cambia el parámetro `q` **de la misma pantalla**: la URL se actualiza (`/buscar?q=borges`), pero no se apila nada. Un solo toque en “atrás” sale del buscador.

Con `router.push` cada letra apilaría una pantalla `/buscar?q=…` nueva. La pila crecería con cada tecla, “atrás” iría borrando letra por letra y cada pantalla nueva se montaría desde cero, perdiendo el foco del campo.

## B3. Mutar o reemplazar

### a) Tres toques en “Anotarme”

El texto sigue mostrando **“Personas en espera: 0”**. `espera.encolar('Ana')` modifica la cola por dentro, pero **no llama a ningún `setState`**: React no se entera del cambio, no vuelve a renderizar y el `Text` nunca vuelve a leer `espera.tamanio`.

### b) Por qué “salta” a 3

Al escribir en el `TextInput` controlado se llama a un `setState`, lo que provoca un render. En ese render el `Text` vuelve a leer `espera.tamanio`, que ya valía 3 desde hace rato, y entonces aparece el 3.

Un error que aparece “a veces” es peor porque:

- Depende de un evento ajeno al código con el problema (tocar otra cosa que provoque un render), así que es difícil de reproducir.
- Una prueba puede pasar o fallar según el orden de los eventos.
- Parece un fallo al azar y se pierde tiempo buscando en el lugar equivocado.

### c) Cómo lo resolví y qué alternativas había

En `src/lib/biblioteca.ts` las colas **nunca se mutan**: cada cambio crea una `Cola` nueva a partir de la anterior.

- Reservar: `copiarEsperaConPersona` (líneas 63-67).
- Entregar: `Cola.desde(espera.aArray())` y luego `desencolar` sobre la copia (líneas 120-124).
- Todo pasa por el reducer puro `reducirBiblioteca` (líneas 173-192), usado con `useReducer` en `BibliotecaContext.tsx:67`.

| Alternativa | Ventaja | Costo |
| --- | --- | --- |
| **Cola nueva + `useReducer` (la mía)** | React detecta el cambio por referencia, funciona con `useMemo`, `useCallback` y dependencias, y el reducer es una función pura fácil de probar | Copiar la cola en cada cambio cuesta O(n) (con listas de pocas personas es irrelevante) |
| **Contador de versión** (mutar y hacer `setVersion(v => v + 1)`) | Evita la copia | El estado queda mutable. Un `useMemo` que depende de la cola no se recalcula (la referencia es la misma), se pierde la protección de React frente a renders concurrentes y es fácil olvidarse de incrementar el contador |
| **`useReducer` con mutación adentro** | Sintaxis cómoda | Mismo problema de referencias iguales, y los reducers que mutan se ejecutan dos veces en desarrollo y dan resultados raros |

## B4. ¿Dónde vive cada dato?

| Dato | Dónde vive | Por qué ahí y no en otro lugar |
| --- | --- | --- |
| Texto del buscador | **URL** (`q`), leído en `buscar.tsx:12-14` | La búsqueda tiene que poder compartirse y abrirse con un link (`/buscar?q=borges`), y “atrás” tiene que funcionar. Un estado local se perdería al recargar |
| Préstamos y reservas | **Context** (`estado.prestamos`, `BibliotecaContext.tsx`) | Los leen y modifican varias pantallas: detalle, confirmación y Mis reservas. Un estado local no se compartiría |
| Listas de espera | **Context** (`estado.esperas`, una `Cola` por ISBN) | Las ven el detalle (cantidad), Mis reservas (posición) y el mostrador (frente de la cola) |
| Vistos recientemente | **Context** (`estado.recientes`, una `Pila`) | El detalle escribe y el Catálogo lee, y son pantallas distintas |
| Sesión del personal | **Context** (`estado.esPersonal`) | El layout raíz lo necesita para decidir qué rutas existen con `Stack.Protected` (`NavegacionRaiz.tsx:22-27`) |
| Ejemplares disponibles | **Se calcula** (`ejemplaresDisponibles`, `biblioteca.ts:33-37`) | Se obtiene de los ejemplares del libro y de los préstamos. Guardarlo sería duplicar un dato (ver E4-d) |
| Estado del permiso de cámara | **Sistema operativo** (el hook solo lo consulta, `usePermiso.ts:15-21`) | La persona puede cambiarlo desde Ajustes en cualquier momento. Una copia propia podría quedar vieja |
| Identificador de la notificación | **Context**, dentro del préstamo (`Prestamo.recordatorioId`) | Pertenece a un préstamo concreto y hay que cancelarlo al devolver. La notificación en sí la guarda el sistema, pero el identificador solo vive en memoria (ver D2-b) |

### Re-renders por cambios en el `value` del Context

Cuando cambia el `value`, se vuelven a renderizar **todos los componentes que llaman a `useBiblioteca()`**: Catálogo, detalle, Mis reservas, escáner, mostrador, etc.

**Sí, el Catálogo se vuelve a renderizar al activar un recordatorio en otra pestaña.** Activar el recordatorio despacha `guardar-recordatorio`, que crea un `prestamos` nuevo; eso cambia el `value` (`BibliotecaContext.tsx:220-265`), y el Catálogo lo consume (`index.tsx:13`) aunque solo use `vistosRecientemente`.

Se podría evitar dividiendo el Context en varios más chicos (préstamos por un lado, recientes por otro), o usando una librería con selectores. **No vale la pena en esta app:** son 17 libros y pantallas livianas, y el re-render de una `FlatList` con pocas filas no se nota. Antes de optimizar habría que medir con el Profiler de React DevTools.

---

# Parte C · Navegación y rutas

## C1. La pila en tu app

Hay dos navegadores involucrados: el **Stack raíz** (`NavegacionRaiz.tsx`) y el **Stack propio de la pestaña Catálogo** (`(tabs)/(catalogo)/_layout.tsx`).

| # | Acción | Pilas resultantes (de base a tope) |
| --- | --- | --- |
| 1 | Abre la app | Raíz: `[(tabs)]` · Stack de la tab Catálogo: `[index]` |
| 2 | Toca un libro | Raíz: `[(tabs)]` · Stack de la tab Catálogo: `[index, libro/[isbn]]` |
| 3 | Toca “Reservar” | Raíz: `[(tabs), reservar/[isbn]]` (modal) · Stack de la tab Catálogo: `[index, libro/[isbn]]` |
| 4 | Toca “Confirmar” | Raíz: `[(tabs)]`, con la pestaña **Mis reservas** activa · Stack de la tab Catálogo: `[index, libro/[isbn]]` (no se toca) |
| 5 | Toca atrás (Android) | Raíz: `[(tabs)]`, con la pestaña **Catálogo** activa · Stack de la tab Catálogo: `[index, libro/[isbn]]` |
| 6 | Toca la tab “Catálogo” | Raíz: `[(tabs)]` · Stack de la tab Catálogo: `[index]` |

Detalle de los pasos 5 y 6: el botón atrás de las pestañas vuelve a la primera pestaña (`backBehavior` por defecto, `firstRoute`), y la pestaña Catálogo conserva su pila con el detalle encima. En el paso 6 se toca la pestaña que ya está activa, y React Navigation lleva su Stack hasta la primera pantalla.

### a) Método usado en el paso 4

Usé **`router.dismissTo('/reservas')`** (`reservar/[isbn].tsx:61`).

- **`push('/reservas')`:** agregaría una pantalla nueva encima del modal. “Atrás” volvería a la confirmación, que ya no tiene sentido.
- **`replace('/reservas')`:** sacaría la confirmación de la pila poniendo `/reservas` en su lugar. Para una ruta que vive dentro de las pestañas no es la herramienta pensada: `dismissTo` expresa exactamente la intención (“cerrar esto y quedar en `/reservas`”) sin depender de cómo se reemplace una pantalla modal.
- **`dismissTo('/reservas')`:** cierra el modal y deja a la persona **en la ruta pedida**, buscándola hacia atrás en la pila. “Atrás” ya no vuelve a la confirmación, que es lo que pide el TP.

### b) Qué ve la persona en el paso 6

Ve el **Catálogo** (la lista), no el detalle. La pestaña ya estaba activa (después del paso 5), y tocar la pestaña activa lleva su Stack a la primera pantalla.

Si en cambio estuviera en Mis reservas y tocara “Catálogo” (sin pasar por el paso 5), vería el **detalle**, porque cada pestaña conserva su propia pila.

Me parece un comportamiento correcto para esta app: la pestaña “recuerda” dónde estaba la persona, y tocar la pestaña activa vuelve al inicio, que es lo que hacen la mayoría de las apps con pestañas. El detalle además muestra el nuevo estado (“Ya tenés este libro prestado”).

## C2. El escáner que dispara de más

### a) `router.push` sin protección

`onBarcodeScanned` puede llamarse varias veces por segundo mientras el código está frente a la cámara. Cada llamada ejecutaría un `router.push`, y esas acciones de navegación entran en **la cola de acciones del navegador** (la cola del TP 2): se procesan una por una. El resultado sería **varias pantallas de detalle apiladas** del mismo libro, y la persona tendría que tocar “atrás” muchas veces.

### b) `useRef`

Usé **`useRef`** (`escanear.tsx:25`, `libroAbierto`, y la lectura en las líneas 51-59).

Un `useState` puesto en `true` en el primer escaneo no alcanza porque **el valor nuevo no se ve hasta el próximo render**. Dentro del mismo render (y mientras el lector sigue disparando), la función `alLeerCodigo` sigue viendo el valor viejo, `false`, y deja pasar los llamados siguientes. Un ref se modifica **en el acto** y todos los llamados siguientes ya leen `true`.

### c) `replace` y no `push`

Uso `router.replace` (`escanear.tsx:59`), que **reemplaza** el escáner por el detalle. Si usara `push`, al tocar “atrás” desde el detalle la persona volvería a un escáner con la cámara abierta, pero con `libroAbierto.current` todavía en `true`, así que **no reaccionaría a ningún código**: una pantalla “muerta”. Con `replace`, “atrás” desde el detalle lleva al Catálogo.

### d) ISBN que no está en el catálogo

Cuando el ISBN no existe, la app muestra un aviso (“Ese libro no está en el catálogo. Probá con otro.”, `escanear.tsx:54-57`) que desaparece solo a los 3 segundos (líneas 41-47), y **sigue escaneando** (no se marca `libroAbierto`).

Para que el aviso no aparezca diez veces, guardo en un ref el último código y la hora (`ultimoCodigo`, líneas 26 y 62-71). Si llega el mismo código mientras sigue frente a la cámara (menos de `MS_AVISO_ESCANER` = 3 segundos desde la última lectura), se ignora. Además, el aviso es un único texto en el estado, así que repetirlo no apila avisos.

## C3. Deep links y rutas protegidas

Las URLs equivalentes en Expo Go son `exp://IP:8081/--/…`.

| Link | Qué ve la persona | Qué queda debajo en la pila | Qué parte del código lo decide |
| --- | --- | --- | --- |
| `bibliotecaipf://libro/9789505001002` (ISBN existente) | Detalle de *El Principito* | Catálogo (`index`) en el Stack de la pestaña, y `(tabs)` en el raíz | `anchor: 'index'` en `(tabs)/(catalogo)/_layout.tsx:5-7` y `anchor: '(tabs)'` en `_layout.tsx:8-10` |
| `bibliotecaipf://libro/123` | Detalle con “No encontramos ese libro” y el link “Volver al Catálogo” | Igual que arriba | `libro/[isbn].tsx:16` (valida con `esIsbnValido`) y `26-39` (mensaje y link) |
| `bibliotecaipf://buscar?q=borges` | Buscador con “borges” escrito y sus resultados | `(tabs)` (Catálogo) | `anchor: '(tabs)'` en `_layout.tsx:8-10`; la lectura de `q` en `buscar.tsx:12-14` |
| `bibliotecaipf://mostrador` (sin sesión) | Termina en el **login** (modal) | `(tabs)` | `Stack.Protected guard={esPersonal} redirectTo="/login"` en `NavegacionRaiz.tsx:25-27` |
| `bibliotecaipf://reserva` | **Mis reservas** | `(tabs)`; la ruta `/reserva` no queda en la pila | `<Redirect href="/reservas" />` en `reserva.tsx:5` |
| `bibliotecaipf://escanear` (cámara bloqueada) | Escáner con “La cámara está bloqueada”, “Abrir Ajustes” y el campo de ISBN | `(tabs)` | `escanear.tsx:97-105`, con `normalizarPermiso` (`lib/permisos.ts:15`, usa `canAskAgain`) |

### ¿Por qué `/libro/123` llega al detalle aunque no exista el libro?

Porque `libro/[isbn]` es una **ruta dinámica**: coincide con cualquier texto en ese lugar de la URL. El router solo compara la **forma** de la URL, no sabe si el dato existe.

La responsabilidad de responder bien es **de la pantalla**: `libro/[isbn].tsx` valida que el parámetro tenga 13 dígitos y que el libro exista (líneas 16 y 26-39). Si no, muestra un mensaje claro con un link al Catálogo.

## C4. Foco, montaje y primer plano

### a) Qué detecta cada una

- **`useEffect` con `[]`:** corre **una sola vez**, cuando el componente se monta, y limpia al desmontarse. No se entera de nada que pase mientras la pantalla sigue montada.
- **`useFocusEffect`:** corre **cada vez que la pantalla gana el foco** dentro de la navegación: al volver de otra pestaña, o al cerrarse una pantalla que estaba encima.
- **`AppState`:** informa los cambios de estado **de toda la app** (`active`, `background`, `inactive`). Detecta cuando la app vuelve a primer plano, por ejemplo después de visitar los Ajustes del teléfono.

### b) Qué se entera en cada caso

- **La persona va a Ajustes, habilita las notificaciones y vuelve:** se entera **`AppState`** (la app pasa a segundo plano y vuelve a `active`). Ni `useEffect([])` ni `useFocusEffect` se enteran, porque la pantalla nunca perdió el foco dentro de la navegación y nunca se desmontó.
- **Va a la pestaña Catálogo y vuelve a “Mis reservas”:** se entera **`useFocusEffect`** (la pantalla recupera el foco). `AppState` no, porque la app nunca salió de primer plano, y `useEffect([])` tampoco, porque Mis reservas no se desmontó.

### c) Cuál usé y por qué

Usé **las dos**, en un único hook, `src/hooks/useRefrescoAlVolver.ts` (`useFocusEffect` en las líneas 9-13 y `AppState` en las 15-22). `usePermiso` lo aplica a la cámara y a las notificaciones (`usePermiso.ts:17` y `:29`).

Con una sola quedaría un caso con estado viejo:

- **Solo `useFocusEffect`:** la persona habilita las notificaciones en Ajustes y vuelve a Mis reservas, pero la pantalla sigue diciendo “no están permitidas”, porque nunca perdió el foco de la navegación.
- **Solo `AppState`:** la persona activa el permiso en la pantalla previa (modal `/permisos/notificaciones`) y la cierra. Como la app nunca salió de primer plano, Mis reservas seguiría con el estado anterior. Cada pantalla tiene su propia copia del estado en el hook (`usePermiso.ts:24`), así que necesita refrescarse al recuperar el foco.

---

# Parte D · Permisos en tu app

## D1. Recorrido completo de la cámara

Android 14, app recién instalada. El hook es `useCameraPermissions` de `expo-camera`, que `usePermiso` traduce a cuatro estados con `normalizarPermiso` (`lib/permisos.ts:8-16`).

| # | Acción | Qué muestra mi app | `status` | `canAskAgain` |
| --- | --- | --- | --- | --- |
| 1 | Toca “Escanear” por primera vez | Un instante “Revisando el permiso de la cámara…” (estado `cargando`) y enseguida abre sola la pantalla previa `/permisos/camara` con el beneficio y el botón “Continuar” (`escanear.tsx:34-39`) | `undetermined` | `true` |
| 2 | “Continuar” → “No permitir” | Se cierra la pantalla previa y el escáner muestra “Necesitamos tu permiso para usar la cámara” con el botón “Activar la cámara” (estado `preguntable`) | `denied` | `true` |
| 3 | Toca “Escanear” otra vez | La pantalla se monta de nuevo y vuelve a abrir sola la pantalla previa con “Continuar” (`pantallaPrevia` es un ref nuevo en cada montaje) | `denied` | `true` |
| 4 | “Continuar” → “No permitir” | Se cierra la pantalla previa y el escáner muestra **“La cámara está bloqueada”**, con “Abrir Ajustes” y el campo para escribir el ISBN | `denied` | `false` |
| 5 | Toca “Escanear” otra vez | Directamente “La cámara está bloqueada” con “Abrir Ajustes”. No hay pantalla previa ni diálogo (`escanear.tsx:97-105`) | `denied` | `false` |
| 6 | “Abrir Ajustes” → habilita la cámara → vuelve a la app | La app detecta el regreso y pasa sola a la **cámara** (estado `concedido`) | `granted` | `true` |

### a) En iOS

En iOS el sistema muestra el diálogo **una sola vez**. El resultado cambia en el **paso 2**: el primer “No permitir” ya devuelve `status: 'denied'` y `canAskAgain: false`, así que la app muestra directamente **“La cámara está bloqueada”** con “Abrir Ajustes”. Los pasos 3 y 5 muestran lo mismo, y el paso 4 no existe porque nunca vuelve a haber diálogo del sistema.

### b) La línea que decide “Continuar” o “Abrir Ajustes”

```ts
// src/lib/permisos.ts:15
return respuesta.canAskAgain ? 'preguntable' : 'bloqueado';
```

Usa el campo **`canAskAgain`**. No alcanza con mirar `status`, porque `denied` significa dos cosas distintas: “rechazó una vez, todavía se puede preguntar” (Android, paso 2) y “bloqueado, no aparece más el diálogo” (paso 4). Solo `canAskAgain` distingue entre las dos.

### c) Quién se entera de la vuelta desde Ajustes

El listener de `AppState` de `useRefrescoAlVolver.ts:15-22`, que `usePermisoCamara` usa en `usePermiso.ts:17`. Cuando la app vuelve a `active`, llama a `consultar()` y el estado se actualiza.

Si esa parte no existiera, la persona habilitaría la cámara en Ajustes y al volver la app seguiría mostrando “La cámara está bloqueada”, hasta que saliera del escáner y entrara de nuevo.

## D2. Notificaciones y consistencia

### a) “Devolver” antes de los 15 segundos, sin cancelar

La notificación llegaría igual a los 15 segundos: “Recordatorio de devolución” de un libro que la persona **ya devolvió**. Sería un aviso falso y confuso. Por eso `devolver` cancela el recordatorio (`BibliotecaContext.tsx:101-111`, llamada a `cancelarRecordatorio` en la línea 106).

### b) Dónde guardo el identificador y qué pasa si se cierra la app

El identificador se guarda en el **Context**, dentro del préstamo (`Prestamo.recordatorioId`, creado en `lib/biblioteca.ts:55-61` y guardado en `BibliotecaContext.tsx:128`).

Si la app se cierra antes de que llegue la notificación:

- **La notificación sí llega**, porque es una notificación local programada en el sistema operativo y no depende de que la app esté abierta.
- **El identificador se pierde**, porque vive solo en memoria (el estado se reinicia al abrir la app).

Aparece una notificación **huérfana**: llega sobre un préstamo que la app ya no conoce y no hay forma de cancelarla.

La resolvería **persistiendo** los préstamos con su identificador (por ejemplo con `AsyncStorage`, el desafío opcional) y, al iniciar la app, **reconciliando** con `Notifications.getAllScheduledNotificationsAsync()`: cancelar las notificaciones programadas que no correspondan a ningún préstamo guardado.

### c) El canal en Android 13+ y en Android 12

A partir de **Android 13**, notificar requiere el permiso de ejecución `POST_NOTIFICATIONS`, y el sistema **solo muestra el diálogo si la app ya creó al menos un canal de notificaciones**. Por eso `pedirPermisoNotificaciones` llama primero a `crearCanalPrestamos()` y recién después a `requestPermissionsAsync()` (`lib/notificaciones.ts:42-45`).

En **Android 12 o anterior** no existe ese permiso de ejecución: las notificaciones están habilitadas por defecto y el pedido no muestra ningún diálogo. El canal igual hace falta (desde Android 8) para poder enviar notificaciones, pero ya no condiciona el pedido del permiso.

### d) Permiso denegado y entrega en el mostrador

Me entero por un **aviso dentro de la app**, que aparece en Mis reservas (`AvisoApp`, `reservas.tsx:100-102`). El código que decide:

```ts
// src/context/BibliotecaContext.tsx:170-183
if (entregadoA === NOMBRE_USUARIO) {
  const titulo = buscarLibroPorIsbn(isbn)?.titulo ?? 'tu libro';
  // Se consulta el permiso en este momento: un valor guardado podría estar viejo
  // si la persona cambió los ajustes del teléfono.
  const permiso = await consultarPermisoNotificaciones();
  if (permiso === 'concedido') {
    try {
      await enviarAvisoDeEntrega(titulo);
    } catch {
      agregarAviso(`Te entregaron "${titulo}" en el mostrador.`);
    }
  } else {
    agregarAviso(`Te entregaron "${titulo}" en el mostrador.`);
  }
}
```

**Consulta el permiso en ese momento** (línea 174) y no usa un valor guardado. Importa porque la persona pudo cambiar el permiso en Ajustes después de la última vez que lo miramos. Con un valor viejo, mandaríamos una notificación que el sistema no mostraría (el aviso se perdería), o mostraríamos un aviso interno innecesario.

## D3. Lo que tu app pide y lo que no

Revisé el resultado generando el código nativo (`npx expo prebuild`) en una copia del proyecto.

| Plataforma | Permiso o clave declarada | Función de la app que lo justifica | ¿Quién lo agrega? |
| --- | --- | --- | --- |
| Android | `CAMERA` | Escáner de código de barras | Plugin `expo-camera` |
| Android | `POST_NOTIFICATIONS` | Recordatorios de devolución y avisos de entrega | `expo-notifications` (se fusiona al compilar; no se ve en el `prebuild`) |
| Android | `INTERNET` | Cargar la app en desarrollo (Metro) | Aparece en el `prebuild` (lo agrega Expo por defecto) |
| Android | `VIBRATE` | Vibración de las notificaciones | Aparece en el `prebuild` (lo agrega Expo por defecto) |
| Android | `RECORD_AUDIO`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE`, `SYSTEM_ALERT_WINDOW` | La app **no los usa**; quedan marcados `tools:node="remove"` | `blockedPermissions` en `app.json:23-28` |
| iOS | `NSCameraUsageDescription` (“Usamos tu cámara para leer el código de barras del libro y abrirlo al instante.”) | Escáner | Plugin `expo-camera`, con el texto de `app.json:43` |
| iOS | Sin clave de micrófono, sin modo de fondo ni entitlement de notificaciones remotas | La app no graba audio ni usa notificaciones push remotas | `microphonePermission: false` y `enableRemoteNotifications: false` |

### a) Por qué no declaro `RECORD_AUDIO`

`expo-camera` agregaría ese permiso por defecto, porque la cámara puede grabar video con audio. Mi app solo lee códigos de barras, así que lo evité con el principio de **mínimo privilegio** en `app.json`:

```json
// app.json:40-47
["expo-camera", {
  "cameraPermission": "Usamos tu cámara para leer el código de barras del libro y abrirlo al instante.",
  "microphonePermission": false,
  "recordAudioAndroid": false
}]
```

Además, `blockedPermissions` (líneas 23-28) elimina `RECORD_AUDIO` del manifiesto final aunque algún paquete lo pida.

### b) “Elegir una foto de portada desde la galería”

- **Paquete:** `expo-image-picker`, instalado con `npx expo install expo-image-picker`.
- **Permiso:** para **elegir** una foto, en los sistemas actuales no hace falta ninguno, porque el selector del sistema (Photo Picker en Android 13+, PHPicker en iOS) muestra solo las fotos que la persona elige. Haría falta el permiso de cámara solo si también se ofreciera “sacar una foto”, y el texto de propósito en `app.json` por el plugin.
- **¿OTA o build nueva?** Hace falta una **build nueva**. Una actualización OTA solo reemplaza el código JavaScript y los recursos de una build ya instalada, y agregar un paquete nativo cambia el código nativo, el manifiesto y el `Info.plist`. También tendría que revisar `blockedPermissions` para que no quite algo que el paquete necesite.

### c) Lo que no pude verificar del todo en Expo Go

Expo Go es una app ya compilada, con su propio manifiesto y sus propios textos, así que no refleja la configuración nativa de mi `app.json`:

- **El texto de propósito de la cámara:** en iOS el diálogo muestra el texto de Expo Go, no el mío.
- **Los permisos de Android y `blockedPermissions`:** los del manifiesto de Expo Go, no los de mi app.
- **El canal `prestamos` y el color de las notificaciones:** corresponden a Expo Go, no a mi app instalada.
- **El `scheme` `bibliotecaipf://`:** en Expo Go los links usan `exp://`.

Para verificarlos haría un **development build** (`npx expo run:android` o `eas build --profile development`), probaría el diálogo de la cámara viendo mi texto (es el desafío opcional) y revisaría los permisos del manifiesto resultante.

---

# Parte E · Buenas prácticas y decisiones de diseño

## E1. Revisión de código

### a) Problemas encontrados

| # | Línea | Clasificación | Qué pasa y cómo corregirlo |
| --- | --- | --- | --- |
| 1 | 18-20 | Error de ejecución | El efecto no tiene array de dependencias: corre después de **cada render**, y cada respuesta actualiza el estado y provoca otro render. Es un bucle de pedidos. Corrección: `[]` o un hook como `useLibros()` |
| 2 | 19 | Error de ejecución | Falta `.catch`: cuando `obtenerLibros()` falla (1 de cada 5), el rechazo queda sin manejar y la persona no ve nada. Corrección: capturar el error y mostrarlo con un botón “Reintentar” |
| 3 | 13-16 | Mala práctica | Pide permiso de cámara y de notificaciones **al abrir la pantalla**, sin explicar para qué. Corrección: pedirlos en contexto (la cámara al abrir el escáner, las notificaciones al activar un recordatorio), con una pantalla previa |
| 4 | 15 | Error de ejecución (Android 13+) | Pide notificaciones sin haber creado un canal, así que en Android 13+ el diálogo no aparece. Corrección: crear el canal primero (`pedirPermisoNotificaciones`) |
| 5 | 22-30 | Rendimiento | `Fila` está declarado **dentro** de `Catalogo`: en cada render es un componente nuevo, así que React desmonta y vuelve a montar todas las filas. Corrección: declararlo a nivel de módulo, en su propio archivo (`FilaLibro`) |
| 6 | 10, 22 | Mala práctica | `any` en el estado y en las props: se pierde el chequeo de tipos. Corrección: `Libro[]` y `{ libro: Libro }` |
| 7 | 33-36 | Rendimiento | `ScrollView` con `map` crea todas las filas de una vez. Corrección: `FlatList` con `keyExtractor` |
| 8 | 35 | Advertencia / mala práctica | `key={i}` usa el índice: al cambiar el orden o la lista, React puede reutilizar filas equivocadas. Corrección: `key` con el ISBN |
| 9 | 25 | Mala práctica | Estilo en línea con colores y tamaños fijos. Corrección: `StyleSheet.create` y constantes de `tema.ts` |
| 10 | 37-39 | Mala práctica (accesibilidad) | Botón que solo tiene un ícono, sin `accessibilityRole` ni `accessibilityLabel`, y con un área táctil chica (el ícono es de 28). Corrección: rol, etiqueta (“Escanear libro”) y mínimo 44 × 44 |
| 11 | 24 | Mala práctica | La ruta se arma concatenando texto (`'/libro/' + isbn`), con lo que se pierden las rutas tipadas. Corrección: `router.push({ pathname: '/libro/[isbn]', params: { isbn } })` |
| 12 | 32-41 | Mala práctica | No hay estado de carga, de error ni de lista vacía (`ListEmptyComponent`). Corrección: `EstadoLista` |

### b) El efecto de las líneas 18-20, paso a paso

1. **Render 1** (montaje): `libros` es `[]`, y se ejecutan los efectos, incluido este.
2. El efecto llama a `obtenerLibros()`, que tarda 800 ms.
3. A los **800 ms** llega la respuesta. `setLibros(datos)` recibe un array **nuevo** (la API devuelve copias), así que React lo considera un cambio y renderiza.
4. **Render 2:** como el efecto no tiene dependencias, corre otra vez: nuevo pedido, que tarda 800 ms.
5. Se repite el ciclo: un pedido cada 0,8 segundos y un render por cada respuesta, con la lista “parpadeando” y consumiendo datos y batería.
6. El ciclo se corta **solo cuando un pedido falla** (20 % por vuelta): como no hay `.catch`, no se actualiza el estado, no hay render y el efecto no se vuelve a ejecutar. Además queda un error de promesa sin capturar. En promedio, el ciclo dura unas cinco vueltas (unos 4 segundos), salvo que otros renders (por ejemplo, los cambios de permiso de las líneas 11 y 13-16) arranquen ciclos paralelos.

**Si `obtenerLibros()` devolviera siempre el mismo array**, el bucle desaparecería casi del todo: `setLibros` con la **misma referencia** hace que React descarte la actualización (compara con `Object.is`), no hay render y el efecto no vuelve a correr. Habría dos pedidos en total (el primero cambia `[]` por el array; el segundo devuelve el mismo y se descarta). El efecto sin dependencias seguiría siendo una mala práctica, porque correría ante cualquier otro render.

### c) La pantalla reescrita con mis hooks, componentes y constantes

Es la pantalla real de mi app, `src/app/(tabs)/(catalogo)/index.tsx:11-41`:

```tsx
export default function PantallaCatalogo() {
  const { libros, cargando, error, reintentar } = useLibros();
  const { vistosRecientemente } = useBiblioteca();

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={estilos.lista}
      contentContainerStyle={estilos.contenido}
      data={libros}
      keyExtractor={(libro) => libro.isbn}
      renderItem={({ item }) => <FilaLibro libro={item} />}
      ListHeaderComponent={
        <View style={estilos.encabezado}>
          <AccesosCatalogo />
          <LibrosRecientes libros={vistosRecientemente} />
        </View>
      }
      ListEmptyComponent={
        <EstadoLista
          cargando={cargando}
          error={error}
          onReintentar={reintentar}
          textoCarga="Cargando el catálogo…"
          tituloVacio="El catálogo está vacío"
          mensajeVacio="Todavía no hay libros para mostrar."
        />
      }
    />
  );
}
```

Los permisos ya no se piden acá: la cámara se pide en `escanear.tsx` (con pantalla previa) y las notificaciones en Mis reservas, al activar el interruptor. El acceso al escáner está en `AccesosCatalogo`, con botón con texto, rol y área táctil de 44.

### d) Rechazo en una tienda y desinstalación

- **Rechazo en una tienda:** pedir los permisos de cámara y notificaciones **al abrir la app** (líneas 13-16), sin contexto ni explicación. Las tiendas esperan que los permisos se pidan cuando la función lo necesita y con un texto de propósito claro.
- **Desinstalación:** el **bucle de pedidos** (líneas 18-20). Gasta datos y batería, la lista parpadea y la app se siente lenta y se calienta, sin que la persona entienda por qué. Los diálogos de permisos al abrir molestan, pero se cierran en segundos; el bucle sigue funcionando todo el tiempo.

## E2. Organización y acoplamiento

### a) Qué carpeta importa a cuál

```
app         → components, constants, context, hooks, lib, types
components  → constants, hooks, lib, types
hooks       → constants, context, lib, types
context     → constants, data, lib, types
lib         → constants, data, estructuras, types
data        → types
constants   → types
estructuras → (nada)
types       → (nada)
```

**No hay importaciones “hacia arriba”:** ningún archivo fuera de `src/app` importa algo de `src/app`, y las dependencias siempre van de las pantallas hacia las capas más básicas.

Sería un problema porque `src/app` es la capa de rutas: todo archivo que está ahí es una **ruta** de la app. Un hook que importara de `app` quedaría atado a una pantalla concreta, no se podría reutilizar ni probar solo, y se podrían formar **ciclos de importación** (app → hook → app), que en Metro producen valores `undefined` difíciles de diagnosticar.

### b) Si el catálogo viniera de una API real

El cambio ideal sería **un solo archivo**, `src/lib/api.ts`. En mi proyecto cambiarían **muchos más**, porque varias partes leen el catálogo estático directamente, con `LIBROS` o `buscarLibroPorIsbn`:

- `src/lib/catalogo.ts` (`buscarLibroPorIsbn`, línea 11)
- `src/context/BibliotecaContext.tsx` (`LIBROS.flatMap`, líneas 200 y 211)
- `src/lib/biblioteca.ts` (líneas 74 y 115)
- `src/app/(tabs)/(catalogo)/libro/[isbn].tsx` (línea 16)
- `src/app/reservar/[isbn].tsx` (línea 17)
- `src/app/escanear.tsx` (línea 54)
- `src/app/(tabs)/reservas.tsx` (línea 40)

Que sean más de dos archivos me dice que **el diseño tiene una debilidad**: solo el listado y la búsqueda pasan por la capa de acceso a datos (`api.ts`); el resto trata al catálogo como un dato global y síncrono. Con una API real, esas lecturas serían asíncronas y habría que agregarles carga y error. Lo mejoraría con un único punto de acceso, por ejemplo un hook `useLibro(isbn)` o un Context del catálogo.

### c) `<ConPermiso recurso="camara">` en lugar de `usePermiso` y la pantalla previa

- **Qué ganaría:** menos repetición, porque el componente concentraría los cuatro estados y la pantalla previa en un solo lugar, con un uso declarativo.
- **Qué perdería:**
  - El TP pide la pantalla previa como **ruta propia** (`/permisos/[recurso]`, modal), con deep link. Un componente que envuelve la cámara no navega a ningún modal.
  - El escáner debe seguir mostrando el campo de ISBN a mano aunque no haya cámara; un wrapper alrededor de la cámara tendría que dejar esa parte afuera.
  - Costaría más probar la lógica por separado.
- **Para las notificaciones no me serviría:** se piden por una **acción** (el interruptor “Recordarme”), no al abrir una pantalla. Hace falta algo que se pueda llamar a voluntad, que es lo que ya hace `usePermiso().pedir()`. Una mejor idea sería mantener el **hook** con la lógica y, si se quiere, un componente delgado encima que lo use.

## E3. Mapa de fallas

| Situación | Qué ve la persona | Dónde se maneja |
| --- | --- | --- |
| `obtenerLibros()` falla | “Algo salió mal”, con el mensaje “No pudimos cargar el catálogo. Revisá tu conexión e intentá de nuevo.” y el botón “Reintentar” | `useLibros.ts:22-25`, `EstadoLista.tsx:23-32` y `index.tsx:29-38` |
| Se abre `/libro/abc` | “No encontramos ese libro” y el link “Volver al Catálogo” | `libro/[isbn].tsx:16` y `26-39`; `catalogo.ts:7-9` |
| Se escanea un ISBN que no está en el catálogo | Un aviso “Ese libro no está en el catálogo. Probá con otro.” durante 3 segundos; la cámara sigue activa | `escanear.tsx:54-57` y `41-47`; el anti-repetición en `62-71` |
| La cámara está bloqueada | “La cámara está bloqueada”, el botón “Abrir Ajustes” y el campo para escribir el ISBN | `escanear.tsx:97-105`; `lib/permisos.ts:15` |
| Las notificaciones están denegadas | En Mis reservas, “Las notificaciones no están permitidas: los avisos aparecerán acá, dentro de la app” (con “Abrir Ajustes” si están bloqueadas); al activar “Recordarme” se pasa por la pantalla previa | `EstadoNotificaciones.tsx:21-27`; `reservas.tsx:59-67`; `permisos/[recurso].tsx:72-79` |
| Se intenta reservar un libro ya reservado | En el detalle, el botón “Reservar” está deshabilitado y una nota explica el estado. Si se llega por URL a la confirmación, “Ya reservaste este libro” con el botón “Ver mis reservas” | `libro/[isbn].tsx:61-72`; `reservar/[isbn].tsx:39-51`; `biblioteca.ts:78-80` |
| “Entregar al siguiente” con la lista de espera vacía | El mostrador solo lista libros con espera; si no hay ninguno, “No hay listas de espera”. Si la lista se vació justo antes del toque, el mensaje “Esa lista de espera ya estaba vacía.” | `BibliotecaContext.tsx:198-207` y `166-168`; `mostrador.tsx:18-21` y `53-59`; `biblioteca.ts:117-119` |
| Login con clave incorrecta | “El usuario o la clave no son correctos. Revisalos e intentá de nuevo.”, y el modal sigue abierto | `login.tsx:18-21`; `BibliotecaContext.tsx:151-157` |

## E4. Decisiones con argumentos

### a) Identificador: ISBN como parámetro de ruta y `key`

Elegí **el ISBN**, por estas razones:

- **Ya es el identificador natural y es lo que lee el escáner.** El código de barras del libro es el ISBN, así que no hace falta traducir un id propio.
- **Es un texto de 13 dígitos fácil de validar** (`esIsbnValido`, `catalogo.ts:7-9`) y los links quedan legibles (`/libro/9789505001002`).
- **Un id numérico no resuelve el problema del tipo de dato.** `useLocalSearchParams` siempre devuelve **texto** (o una lista de textos, como vimos en el ejercicio E1 del TP 2, por eso existe `textoDeParametro` en `lib/rutas.ts`), así que habría que convertirlo con `Number()` y validar `NaN`. En cambio, el ISBN se usa tal cual y no pierde ceros a la izquierda.
- **Dos ediciones del mismo título** tienen ISBN distintos, así que no se confunden en la lista.

**Límites de mi elección:** los libros sin ISBN (muy antiguos o de edición propia) no entrarían, y dos ejemplares físicos de la misma edición comparten ISBN, así que no se pueden distinguir. Si el Instituto necesitara eso, agregaría un id propio de ejemplar, pero seguiría usando el ISBN para el catálogo y el escáner.

### b) Estructuras: clase `Pila`/`Cola` con `#items`, o un array

Usé la **clase**.

- **Lo que me dio:**
  - Los datos quedan encapsulados (`#items`): nadie puede hacer un `splice` por error y romper el orden.
  - Los métodos dicen la intención (`apilar`, `desencolar`).
  - La cola no usa `shift()`, que reacomoda todo el arreglo: avanza un índice (`Cola.ts:25-37`).
  - Es fácil de probar (20 tests en `src/__tests__`).
- **Lo que me complicó con React:**
  - React compara por referencia, y una clase mutable no dispara renders (ejercicio B3). Tuve que copiar la estructura en cada cambio (`Cola.desde(x.aArray())`, `Pila.desde(...)`), con costo O(n).
  - No se puede copiar con `[...pila, x]`.
  - No se guarda como JSON: `JSON.stringify` de una clase con campos privados da `{}`, así que para persistir habría que convertir con `aArray()` y reconstruir.

Un array con `[...pila, x]` sería más simple y serializable, pero deja visibles operaciones que rompen la regla LIFO/FIFO, y desencolar con `slice(1)` copia todo en cada vez.

### c) `useMemo` y `useCallback`

Los usé; en algunos lugares aportan y en otros son ruido.

- **Aporta:** `registrarVisto` con `useCallback` (`BibliotecaContext.tsx:147-149`). El detalle lo usa en las dependencias de su efecto (`libro/[isbn].tsx:20-24`); sin una función estable, el efecto correría en cada render.
- **Aporta poco:** el `value` del Context con `useMemo` (`BibliotecaContext.tsx:220-265`). Evita crear un objeto nuevo cuando el provider se vuelve a renderizar por su padre, pero como depende de casi todo el estado, cambia en cada acción de todos modos.
- **Ruido:** `reintentar` con `useCallback` (`useLibros.ts:40-44`) y `vistosRecientemente` con `useMemo` (`BibliotecaContext.tsx:193-196`): se usan en un botón o en una lista de tres elementos, y recalcularlos cuesta casi nada.

Para comprobarlo en lugar de suponerlo usaría el **Profiler de React DevTools** (cuántas veces se renderiza cada componente y por qué) antes y después de agregar o quitar el `useMemo`. No hice esa medición.

### d) Datos duplicados: “ejemplares disponibles”

**No los guardé: los calculo** (`ejemplaresDisponibles`, `biblioteca.ts:33-37`) a partir de los ejemplares del libro, los préstamos propios y un ajuste.

Cuando el mismo dato vive en dos lugares aparece el error de la **desincronización**: por ejemplo, la lista de préstamos dice que el libro está prestado, pero el contador guardado sigue diciendo que hay un ejemplar libre (o al revés). Eso pasa cuando una acción actualiza un lugar y se olvida del otro, o cuando las dos actualizaciones llegan en distinto orden. Son errores que dependen del orden de los eventos y que son difíciles de reproducir.

Mi diseño lo evita porque hay **una sola fuente de verdad**: los préstamos. “Disponibles” se vuelve a calcular en cada render, así que no puede quedar desactualizado respecto de ellos.

Una aclaración honesta: `ajusteEjemplares` (`biblioteca.ts:13`) sí es un dato guardado. No es una copia del número de disponibles sino una **diferencia** que registra las entregas del mostrador a personas que no son “yo” (ejemplares que salieron o volvieron sin pasar por mis préstamos). El número final sigue calculándose, pero es el punto del diseño que más cuidado requiere.
