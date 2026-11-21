# Biblioteca IPF

App móvil para consultar el catálogo de la biblioteca del Instituto, reservar libros y recibir un recordatorio antes de devolverlos. El personal entrega los libros respetando el orden de las reservas.

Trabajo Práctico N° 4 · Taller Complementario – React Native II · Tecnicatura Superior en Desarrollo de Software Multiplataforma · Instituto Politécnico Formosa.

- **Versión del SDK de Expo:** 58 (`expo ~58.0.26`, React Native 0.88, Expo Router ~58)
- **Módulos nativos:** solo `expo-camera` y `expo-notifications`
- **Lenguaje:** TypeScript estricto, rutas tipadas activas (`experiments.typedRoutes`)

## Cómo ejecutar el proyecto

```bash
npm install
npx expo start
```

Escaneá el código QR con **Expo Go** (Android o iOS). Otros comandos:

| Comando | Para qué sirve |
| --- | --- |
| `npx expo lint` | Revisa el código con ESLint |
| `npx tsc --noEmit` | Revisa los tipos |
| `npm test` | Corre las pruebas unitarias (Pila, Cola y lógica de reservas) |

### Datos para probar

- **Personal de biblioteca** (`/login`): usuario `personal`, clave `biblioteca2026` (fijos en `src/constants/config.ts`).
- **Modo demostración:** el recordatorio de devolución llega a los **15 segundos** de activar “Recordarme” (`MODO_DEMOSTRACION` en `src/constants/config.ts`). Con el modo apagado se programa un día antes de la fecha de devolución.
- **Libros con lista de espera inicial:** *Rayuela* (Marcos Díaz, Lucía Fernández) y *Sobre héroes y tumbas* (Camila Rojas). *Cien años de soledad* tiene 0 ejemplares y la lista vacía.
- **Escáner:** los dos primeros libros de `src/data/libros.ts` (*El Principito* y *Martín Fierro*) están marcados para probar el escáner. Sus ISBN son de ejemplo, con dígito verificador válido; **reemplazalos por el ISBN real de dos libros que tengas a mano** (13 dígitos, sin guiones) o generá un código de barras EAN-13 con el ISBN de ejemplo para escanearlo desde otra pantalla.

## Árbol de carpetas

```
src/
├── app/            solo rutas
├── components/     un componente por archivo
├── constants/      tema.ts (colores, tamaños, espaciados), config.ts, navegacion.ts, permisos.ts
├── context/        BibliotecaContext.tsx (préstamos, esperas, recientes, sesión, avisos)
├── data/           libros.ts (17 libros + listas de espera iniciales)
├── estructuras/    Pila.ts y Cola.ts (campos privados #items)
├── hooks/          useLibros, useBusqueda, usePermiso, useBiblioteca, ...
├── lib/            api.ts (entregado), biblioteca.ts (reglas y reducer), notificaciones.ts, permisos.ts, ...
├── types/          index.ts
└── __tests__/      pruebas unitarias
```

### Rutas (`src/app`) y navegador de cada `_layout`

```
src/app/
├── _layout.tsx                      Stack raíz (lo arma components/NavegacionRaiz) + ProveedorBiblioteca
│                                    anchor: (tabs)  → un deep link a /buscar deja las pestañas debajo
├── (tabs)/
│   ├── _layout.tsx                  Tabs: “Catálogo” y “Mis reservas”
│   ├── (catalogo)/
│   │   ├── _layout.tsx              Stack propio de la pestaña Catálogo (anchor: index)
│   │   ├── index.tsx                /                      Catálogo
│   │   └── libro/[isbn].tsx         /libro/[isbn]          Detalle (dentro de la pestaña Catálogo)
│   └── reservas.tsx                 /reservas              Pestaña “Mis reservas”
├── buscar.tsx                       /buscar?q=             Stack raíz
├── escanear.tsx                     /escanear              Stack raíz (cámara)
├── reservar/[isbn].tsx              /reservar/[isbn]       Stack raíz, presentation: "modal"
├── permisos/[recurso].tsx           /permisos/[recurso]    Stack raíz, presentation: "modal"
├── login.tsx                        /login                 Stack raíz, modal, Stack.Protected (solo sin sesión)
├── mostrador.tsx                    /mostrador             Stack raíz, Stack.Protected (solo con sesión)
├── reserva.tsx                      /reserva               <Redirect> a /reservas
└── +not-found.tsx                   cualquier otra URL     Pantalla 404 con la URL pedida
```

## `app.json`: plugins

```jsonc
"plugins": [
  // Expo Router: rutas basadas en archivos (carpeta src/app).
  "expo-router",
  // Pantalla de carga. El color de fondo coincide con el color principal de la app.
  ["expo-splash-screen", { "backgroundColor": "#7A0A2E", "image": "./assets/images/splash-icon.png", "imageWidth": 76 }],
  [
    "expo-camera",
    {
      // Texto de propósito de iOS (NSCameraUsageDescription): “Usamos tu [dato] para [beneficio]”.
      "cameraPermission": "Usamos tu cámara para leer el código de barras del libro y abrirlo al instante.",
      // Mínimo privilegio: la app no usa micrófono ni graba audio.
      "microphonePermission": false,   // iOS: no agrega NSMicrophoneUsageDescription
      "recordAudioAndroid": false      // Android: no agrega RECORD_AUDIO
    }
  ],
  [
    "expo-notifications",
    {
      // Color del ícono de las notificaciones en Android.
      "color": "#7A0A2E",
      // Solo se usan notificaciones locales: no se agrega la capacidad de notificaciones push remotas en iOS.
      "enableRemoteNotifications": false
    }
  ]
]
```

El `scheme` de la app es `"bibliotecaipf"` y las rutas tipadas están activas con `"experiments": { "typedRoutes": true }`.

## Permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si no se concede |
| --- | --- | --- | --- |
| Cámara | `expo-camera` (`useCameraPermissions`, dentro de `usePermiso`) | Al entrar a `/escanear`. Antes del diálogo del sistema se muestra `/permisos/camara`; el diálogo aparece recién con “Continuar”. | Escribir el ISBN a mano (siempre disponible). Si está bloqueado, el botón “Abrir Ajustes” lleva a los ajustes del teléfono. |
| Notificaciones | `expo-notifications` | Solo al activar el interruptor “Recordarme” de un préstamo (pasando antes por `/permisos/notificaciones`). En Android se crea el canal `prestamos` antes de pedir. | La app sigue funcionando: los avisos aparecen dentro de la app, en “Mis reservas”. |

### Justificación de `blockedPermissions` (Android)

Se declara en `android.blockedPermissions` para que ninguno de estos permisos quede en el manifiesto, aunque una librería o la plantilla los pueda agregar por defecto:

| Permiso bloqueado | Por qué la app no lo necesita |
| --- | --- |
| `android.permission.RECORD_AUDIO` | La cámara solo lee códigos de barras; no graba audio ni video. |
| `android.permission.READ_EXTERNAL_STORAGE` | La app no lee archivos ni fotos del teléfono. |
| `android.permission.WRITE_EXTERNAL_STORAGE` | La app no guarda archivos en el teléfono. |
| `android.permission.SYSTEM_ALERT_WINDOW` | La app no dibuja encima de otras aplicaciones. |

Con `npx expo prebuild` el manifiesto queda con `CAMERA`, `INTERNET` y `VIBRATE` (estos dos los agrega Expo por defecto), y los cuatro de arriba marcados para eliminarse. Los permisos de `expo-notifications` (como `POST_NOTIFICATIONS`) se fusionan al compilar la app.

## Deep links de prueba

En un build propio se usa `bibliotecaipf://…`. En Expo Go se usa `exp://IP:8081/--/…` (reemplazá `IP` por la que muestra `npx expo start`).

| Link | Qué debería pasar |
| --- | --- |
| `bibliotecaipf://libro/9789505001002` | Detalle de *El Principito*, con el Catálogo debajo |
| `bibliotecaipf://libro/123` | Detalle con el mensaje “No encontramos ese libro” y un link al Catálogo |
| `bibliotecaipf://buscar?q=borges` | Buscador con “borges” ya escrito, con las pestañas debajo |
| `bibliotecaipf://mostrador` (sin sesión) | Lleva a `/login` (la ruta protegida redirige) |
| `bibliotecaipf://reserva` | `<Redirect>` a `/reservas` |
| `bibliotecaipf://escanear` (cámara bloqueada) | Escáner en estado “bloqueado”, con “Abrir Ajustes” y el ISBN a mano |
| `bibliotecaipf://cualquier-cosa` | Pantalla 404 que muestra la URL |

## Verificación

```text
$ npx tsc --noEmit
(sin salida: 0 errores)

$ npx expo lint
(sin salida: 0 errores y 0 advertencias, sin reglas desactivadas)

$ npm test
Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
```

Además, el proyecto empaqueta para Android sin errores (`npx expo export --platform android`). La cámara y las notificaciones se prueban en un teléfono real con Expo Go.

## Decisiones de diseño

- **Estado inmutable.** Préstamos, esperas y recientes viven en un Context con `useReducer`. Cada cambio crea una `Cola` o `Pila` nueva a partir de la anterior (`Cola.desde(...)`), así React detecta el cambio y vuelve a renderizar.
- **Ejemplares disponibles calculados.** No se guardan: se calculan a partir de los ejemplares del libro y de los préstamos, para que el mismo dato no viva en dos lugares.
- **Una reserva respeta el orden.** Si un libro tiene ejemplares pero ya hay gente esperando, la reserva entra a la lista de espera.
- **Permiso consultado en el momento.** Al “Entregar al siguiente” se consulta el permiso de notificaciones en ese instante, no un valor guardado.
- **Foco y primer plano.** `usePermiso` vuelve a consultar al recuperar el foco (`useFocusEffect`) y al volver a primer plano (`AppState`), por ejemplo al regresar de los Ajustes.
