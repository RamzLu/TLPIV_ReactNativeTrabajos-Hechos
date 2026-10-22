# Mantenimiento IPF

App para reportar desperfectos del edificio del Instituto Politécnico Formosa. Desarrollada con **Expo SDK 58**, **Expo Router** y **TypeScript**.

> **TP3 — Permisos Móviles | Taller Complementario React Native II**

---

## Árbol de carpetas de `src/app`

```
src/app/
├── _layout.tsx              ← Stack raíz (ThemeProvider + AnimatedSplash + modal permisos)
├── (tabs)/                  ← Grupo de pestañas principales
│   ├── _layout.tsx          ← Layout de tabs (<AppTabs />)
│   ├── index.tsx            → /           Tab "Reportes": lista de reportes propios y botón nuevo
│   ├── avisos.tsx           → /avisos     Tab "Avisos": bandeja interna y acceso a ajustes
│   └── permisos.tsx         → /permisos   Tab "Permisos": panel de estado de permisos
├── ajustes-app.tsx          → /ajustes-app  Interruptor y preferencia de notificaciones
│
├── reporte/
│   ├── nuevo.tsx            → /reporte/nuevo     Formulario con borrador compartido
│   ├── escanear.tsx         → /reporte/escanear  Escáner QR (4 estados de cámara)
│   ├── foto.tsx             → /reporte/foto      Adjuntar foto (cámara + selector del sistema)
│   ├── ubicacion.tsx        → /reporte/ubicacion GPS en primer plano o sector manual
│   └── [id].tsx             → /reporte/[id]      Detalle del reporte y simulación de resolución
│
└── permisos/
    └── [recurso].tsx        → /permisos/[recurso]  Pantalla previa explicativa (modal)
```

### Tabla de rutas requeridas (G1)

| URL | Pantalla | Permiso / Comportamiento |
|---|---|---|
| `/` | Lista de reportes + botón "Nuevo" | Ninguno al abrir. Limpia el borrador al crear uno nuevo. |
| `/reporte/nuevo` | Formulario de reporte | Ninguno al abrir. Consume el borrador en memoria. |
| `/reporte/escanear` | Escáner QR del aula (4 estados) | Cámara (`usePermiso('camara')` / modal explicativo). |
| `/reporte/foto` | Sacar foto o elegir de galería | Cámara para capturar; selector del sistema sin permisos para elegir. |
| `/reporte/ubicacion` | GPS primer plano o sector manual | Ubicación en primer plano (`usePermiso('ubicacion')` / modal). |
| `/reporte/[id]` | Detalle del reporte | Validación de ID en store. Simulación de resolución. |
| `/avisos` | Bandeja de avisos internos | Ninguno. Acceso directo a `/ajustes-app`. |
| `/permisos` | Panel de estado de permisos | Ninguno. Muestra estado real de cámara, ubicación y notificaciones. |
| `/permisos/[recurso]` | Pantalla previa (modal) | `presentation: modal`. Explicación antes del diálogo nativo. |
| `/ajustes-app` | Interruptor de notificaciones | Notificaciones (consulta / solicitud si se activa). |

---

## Plugins de `app.json` comentados

```jsonc
"plugins": [
  "expo-router",

  // Splash screen institucional con fondo azul IPF
  [
    "expo-splash-screen",
    {
      "backgroundColor": "#1D4ED8",
      "image": "./assets/images/splash-icon.png",
      "imageWidth": 76
    }
  ],

  // Cámara: propósito claro; micrófono y grabación desactivados para evitar RECORD_AUDIO
  [
    "expo-camera",
    {
      "cameraPermission": "Usamos tu cámara para leer el código QR del aula y para sacar fotos del desperfecto que querés reportar.",
      "microphonePermission": false,
      "recordAudioAndroid": false
    }
  ],

  // Ubicación: únicamente en primer plano; segundo plano y movimiento deshabilitados explícitamente
  [
    "expo-location",
    {
      "locationWhenInUsePermission": "Usamos tu ubicación para registrar dónde ocurre el desperfecto dentro del instituto y ayudar al equipo de mantenimiento a encontrarlo más rápido.",
      "locationAlwaysAndWhenInUsePermission": false,
      "locationAlwaysPermission": false,
      "motionUsagePermission": false,
      "isAndroidBackgroundLocationEnabled": false,
      "isAndroidForegroundServiceEnabled": false,
      "isIosBackgroundLocationEnabled": false
    }
  ],

  // Selector de imágenes: sin solicitar permiso de lectura general de fotos
  [
    "expo-image-picker",
    {
      "photosPermission": false,
      "microphonePermission": false
    }
  ],

  // Notificaciones locales: icono y color institucional para avisos de mantenimiento
  [
    "expo-notifications",
    {
      "icon": "./assets/images/icon.png",
      "color": "#2563EB",
      "sounds": []
    }
  ]
]
```

### `blockedPermissions` (Android) y justificación

| Permiso bloqueado | Razón |
|---|---|
| `READ_EXTERNAL_STORAGE` | Obsoleto en Android 13+; la app no accede a archivos del sistema general. |
| `WRITE_EXTERNAL_STORAGE` | No se escribe en el almacenamiento compartido externo. |
| `READ_MEDIA_IMAGES` | Se usa el photo picker del sistema (no requiere lectura total de medios). |
| `READ_MEDIA_VIDEO` | La app no manipula ni reproduce videos del dispositivo. |
| `RECORD_AUDIO` | La app solo toma fotos y escanea QR; no se registra sonido ambiental ni voz. |
| `SYSTEM_ALERT_WINDOW` | La app no muestra ventanas flotantes sobre otras aplicaciones. |

---

## Tabla de permisos

| Recurso | Módulo | Cuándo se pide | Alternativa si se deniega |
|---|---|---|---|
| Cámara | `expo-camera` | Al tocar "Escanear QR" o "Sacar foto" (nunca al inicio). | Escribir código de aula a mano / elegir foto desde la galería con el selector del sistema. |
| Ubicación | `expo-location` | Al presionar "Obtener ubicación actual" en el formulario. | Seleccionar el sector manualmente mediante chips (patio, pasillo, baño, etc.). |
| Notificaciones | `expo-notifications` | Al activar el interruptor en `/ajustes-app`. | Consulta de avisos en la bandeja interna `/avisos`. |
| Fotos (galería) | `expo-image-picker` | **Nunca** — se utiliza `launchImageLibraryAsync` sin permisos directos. | — |

---

## Organización del código

```
src/
├── app/
│   ├── _layout.tsx           ← Stack global con modal de permisos y splash nativo
│   ├── (tabs)/               ← Tabs con AppTabs (Reportes, Avisos, Permisos)
│   ├── ajustes-app.tsx       ← Preferencia local de notificaciones
│   ├── reporte/              ← Subrutas de creación, escaneo, foto, ubicación y detalle
│   └── permisos/[recurso].tsx← Pantalla modal previa a la solicitud nativa
├── components/               ← Componentes visuales (EstadoBadge, TarjetaReporte, etc.)
├── constants/theme.ts        ← Paleta accesible, modo claro/oscuro y espaciado
├── hooks/usePermiso.ts       ← Hook unificado reactivo a cambios de foco y AppState
└── lib/
    ├── tipos.ts              ← Definiciones de TypeScript (Reporte, Aviso, RecursoPermiso, etc.)
    ├── store.ts              ← Store en memoria (reportes, avisos, borrador y preferencias)
    ├── permisos.ts           ← Consultas y solicitudes de permisos normalizadas
    └── notificaciones.ts     ← Handler en primer plano, canal de Android y simulación
```

---

## Requisitos técnicos cumplidos (G3)

- ✅ Proyecto con `create-expo-app`, TypeScript y Expo Router (`typedRoutes` activo).
- ✅ `expo-permissions` **NO** utilizado en ningún archivo del código fuente.
- ✅ Textos de propósito con la estructura "Usamos tu [dato] para [beneficio concreto]".
- ✅ Mínimo privilegio estricto: sin micrófono, sin segundo plano, sin acceso total a galería.
- ✅ `blockedPermissions` configurado en `app.json` con justificación documentada.
- ✅ Gestión de estados (concedido, preguntable, bloqueado, limitado) con refresco al regresar desde Ajustes (`AppState`).

---

## Cómo ejecutar y probar

```bash
cd MantenimientoIPF
npm install
npx expo start
```

> **Nota sobre textos de propósito**: En el cliente genérico de Expo Go, los diálogos nativos muestran textos propios de Expo Go. Para visualizar los textos de propósito definidos en `app.json` y la aplicación estricta de `blockedPermissions`, ejecute una build de desarrollo:

```bash
npx expo run:android
```

### Comandos para reiniciar permisos a estado "sin decidir"

**Android (ADB):**
```bash
adb shell pm revoke com.ipf.mantenimiento android.permission.CAMERA
adb shell pm revoke com.ipf.mantenimiento android.permission.ACCESS_FINE_LOCATION
adb shell pm revoke com.ipf.mantenimiento android.permission.ACCESS_COARSE_LOCATION
adb shell pm revoke com.ipf.mantenimiento android.permission.POST_NOTIFICATIONS
```

**iOS (Simulador):**
```bash
xcrun simctl privacy booted reset camera com.ipf.mantenimiento
xcrun simctl privacy booted reset location com.ipf.mantenimiento
```
