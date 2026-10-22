# Respuestas TP3 - Permisos Móviles (React Native II)

Acá dejo las respuestas de las partes A hasta la F.

## Parte A. ¿Qué es un permiso y por qué existe?

**A1. Conceptos**
a) Básicamente un permiso es una barrera de seguridad. La app es la que "pide" acceder a algo sensible, el sistema operativo (iOS/Android) es el control de seguridad, y el usuario es el dueño que decide si permite o no el acceso.
b) La caja de arena (sandbox) es el espacio aislado donde se ejecuta la app. Por defecto no puede acceder a nada externo. Sin permisos, una app solo puede usar recursos básicos como la CPU, la pantalla y su propio almacenamiento interno.
c)
* **Privacidad:** Evitar que lean tus mensajes o vean tus fotos.
* **Seguridad:** Prevenir que modifiquen o borren archivos del sistema.
* **Costos/Datos:** Evitar el consumo del plan de datos enviando información en segundo plano.
* **Batería:** Prevenir que dejen el GPS encendido consumiendo la batería del dispositivo.
d) La visita es la app, el portero es el sistema operativo (SO), el dueño es el usuario. Que "se acuerde" significa que el sistema guarda la respuesta del usuario para no volver a mostrar el diálogo cada vez que se abre la app.

**A2. Declarar y solicitar**

| | Declarar (al compilar) | Solicitar (al ejecutar) |
| --- | --- | --- |
| **¿Qué se hace?** | Se deja por escrito en la configuración de la app qué permisos se van a necesitar. | Se le muestra el cuadro de diálogo al usuario preguntando si autoriza el acceso. |
| **En Android/iOS** | Android: `AndroidManifest.xml`. iOS: `Info.plist` | Android: Código Java/Kotlin (o React Native). iOS: Código Swift/Obj-C (o React Native). |
| **En Expo** | En el archivo `app.json` (dentro de `plugins` o `permissions`). | Con los hooks específicos, como `useCameraPermissions()`. |
| **Si se omite** | Si no se declara, la tienda de apps puede rechazar la aplicación o crashear al pedirlo. | Si no se solicita, la app puede fallar silenciosamente o cerrarse cuando intenta usar el recurso. |

**A3. Verdadero o falso**
a) **F** - El diálogo lo dibuja el sistema operativo (Android/iOS), no se puede personalizar con estilos de React Native.
b) **V**
c) **F** - Si se modifica el Info.plist o el Manifest se necesita hacer una nueva compilación (build), no sirve una actualización OTA porque cambia el código nativo.
d) **F** - Si no está declarado en el manifiesto, Android ni siquiera muestra el diálogo. La acción falla directamente.
e) **F** - `expo-permissions` está obsoleto. La forma recomendada es usar el hook específico de cada paquete (ej. `expo-camera`, `expo-location`).
f) **V** - En iOS, las notificaciones no requieren un texto de propósito (UsageDescription) en el Info.plist.
g) **V**
h) **V** - Es la forma más confiable para reiniciar los permisos al estado "sin decidir" cuando se está probando la app.

**A4. Estados**
a) En Android los estados son "Sin decidir", "Concedido", "Denegado (se puede volver a pedir)" y "Bloqueado" (Denegado permanentemente). La diferencia central es que en iOS no existe el "Denegado temporal"; si el usuario dice que no la primera vez, pasa directamente a "Bloqueado" y se debe cambiar desde los Ajustes del sistema.
b)

| Estado | status | canAskAgain | ¿Puede aparecer el diálogo? |
| --- | --- | --- | --- |
| Sin decidir | `undetermined` | `true` | Sí |
| Concedido | `granted` | `true` | No |
| Denegado | `denied` | `true` | Sí |
| Bloqueado | `denied` | `false` | No |

## Parte B. Android: tipos y manifiesto

**B1. Clasificación**
* INTERNET: Normal (de instalación). Se auto-concede.
* CAMERA: Peligroso (tiempo de ejecución). Hay que solicitarlo.
* VIBRATE: Normal. Se auto-concede.
* SYSTEM_ALERT_WINDOW: Especial. Redirige a una pantalla de ajustes del sistema.
* POST_NOTIFICATIONS: Tiempo de ejecución (desde Android 13).
* ACCESS_NETWORK_STATE: Normal.
* READ_CONTACTS: Tiempo de ejecución.
* SCHEDULE_EXACT_ALARM: Especial/Instalación dependiendo de la API.
* RECORD_AUDIO: Tiempo de ejecución.
* MANAGE_EXTERNAL_STORAGE: Especial.

**B2. Grupos y Nombres**
a) Un grupo de permisos es una categoría que engloba permisos relacionados. Si la app pide `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` al mismo tiempo, el usuario solo ve un (1) diálogo porque ambos pertenecen al grupo "Ubicación".
b) Llevan el prefijo `android.permission.`. Ejemplo: `android.permission.CAMERA`.
c) Son permisos reservados para aplicaciones que comparten el mismo certificado de firma (por ejemplo, apps del sistema). Las apps comunes no los usan porque no cuentan con la firma del fabricante o de Google.

**B3. Manifiesto**
a) Se conceden solos al instalar: INTERNET. Hay que pedir en tiempo de ejecución: CAMERA, LOCATION, NOTIFICATIONS, STORAGE.
b) Significa que a partir de Android 13 (API 33+) ese permiso deja de tener efecto. Lo reemplazan permisos más específicos como `READ_MEDIA_IMAGES` o `READ_MEDIA_VIDEO`.
c) Le indica al sistema que si alguna librería incluyó ese permiso automáticamente, lo elimine del manifiesto final. En el `app.json` esto se genera configurando `blockedPermissions` en el plugin.
d) Va en la propiedad `expo.android.permissions` dentro del `app.json`.
e) No conviene editarlo a mano porque cada vez que se ejecuta `npx expo prebuild`, Expo regenera el archivo y sobreescribe los cambios manuales. `blockedPermissions` no tiene efecto en Expo Go porque esta app ya viene pre-compilada con todos los permisos incluidos.

**B4. Así pregunta Android**
a) No se puede incluir texto propio dentro del diálogo nativo de Android. Por lo tanto, hay que explicar el propósito en una "pantalla previa" diseñada por nosotros antes de solicitar el permiso.
b) "Mientras la app está en uso" otorga el permiso mientras la aplicación está activa. "Solo esta vez" otorga el acceso temporalmente; si la app se cierra, el permiso se revoca (existe para Ubicación, Cámara y Micrófono).
c) Si se toca "No permitir" dos veces, Android lo considera como "Bloqueado" y `canAskAgain` pasa a ser `false`.
d) Ejemplo aproximada: una app del clima. Ejemplo precisa: una app de navegación tipo GPS o mapas.
e) Android interrumpe y mata el proceso de la app en segundo plano. Al volver a abrirla, la app se reinicia desde cero para evitar inconsistencias de estado.

**B5. Versiones**
* Nacen los permisos en tiempo de ejecución: Android 6 (API 23).
* Ubicación en segundo plano separada: Android 10 (API 29).
* Dos rechazos equivalen a no volver a preguntar: Android 11 (API 30).
* Precisa vs aproximada: Android 12 (API 31).
* Notificaciones (POST_NOTIFICATIONS): Android 13 (API 33).
* Acceso parcial a fotos: Android 14 (API 34).

El `targetSdkVersion` indica la versión principal de la API para la cual la app fue probada y optimizada. Expo SDK 57 apunta a la API 34, que es el requisito actual de Google Play.

## Parte C. iOS: textos de propósito y acceso parcial

**C1. Claves Info.plist**
* Cámara: `NSCameraUsageDescription`
* Micrófono: `NSMicrophoneUsageDescription`
* Ubicación en uso: `NSLocationWhenInUseUsageDescription`
* Ubicación siempre: `NSLocationAlwaysAndWhenInUseUsageDescription`
* Fotos (leer): `NSPhotoLibraryUsageDescription`
* Fotos (solo guardar): `NSPhotoLibraryAddUsageDescription`
* Contactos: `NSContactsUsageDescription`
* Face ID: `NSFaceIDUsageDescription`
* Rastreo entre apps (ATT): `NSUserTrackingUsageDescription`
* Notificaciones: No lleva clave de propósito.

**C2. Sin texto, no hay permiso**
a) La app se cierra inesperadamente (crashea) al intentar usar el recurso. Al subir la build a App Store Connect, es rechazada con el error de "Missing Purpose String" (ITMS-90683).
b) iOS muestra el diálogo una (1) sola vez. Si la persona lo rechaza, la única alternativa es guiar al usuario para que lo habilite manualmente desde Ajustes.
c) El sistema dibuja la estructura del diálogo (título y botones), y nosotros escribimos el subtítulo descriptivo. En Expo se configura en el archivo `app.json` (usualmente en los plugins o en `ios.infoPlist`).
d) Ocurre porque la librería incluye referencias a esa API. Se resuelve bloqueando el permiso mediante un plugin o agregando un texto de propósito genérico pero válido para que Apple apruebe la revisión.

**C3. Probador de textos**
* "Necesitamos tu ubicación." -> RECHAZADO. *Mejorada: Usamos tu ubicación para mostrarte en el mapa dónde te encuentras.*
* "Para mejorar tu experiencia." -> RECHAZADO. *Mejorada: Usamos tu ubicación para sugerirte eventos cercanos a tu zona.*
* "Usamos tu ubicación para mostrarte las farmacias de turno más cercanas." -> APROBADO.
* "La app no funciona sin ubicación." -> RECHAZADO. *Mejorada: Usamos tu ubicación para calcular el costo de tu envío.*
* "Ubicación requerida por el sistema." -> RECHAZADO. *Mejorada: Usamos tu ubicación para registrar la sucursal en la que operaste.*

**C4. Acceso parcial y gradual**
* Fotos limitadas: iOS 14. En Expo: se verifica si `accessPrivileges` es `'limited'`.
* Ubicación aproximada: iOS 14. En Expo: devuelve `accuracy: 'coarse'`.
* "Permitir una vez": iOS 13.
* Ubicación escalonada: iOS 11.
* Notificaciones provisionales: iOS 12.

Expo SDK 57 requiere como mínimo iOS 13.4. En la práctica, esto significa que la mayoría de estas funciones ya están disponibles de forma nativa en cualquier dispositivo compatible con la versión actual de Expo.

## Parte D. Expo en acción

**D1. Módulos y Hooks**
* Escanear un QR: `expo-camera` -> `useCameraPermissions()`
* Grabar video con sonido: `expo-camera` -> `useMicrophonePermissions()` (además del de cámara)
* Mostrar farmacias cercanas: `expo-location` -> `useForegroundPermissions()`
* Seguir un envío en segundo plano: `expo-location` -> `useBackgroundPermissions()`
* Mostrar un recordatorio: `expo-notifications` -> `usePermissions()`
* Grabar una nota de voz: `expo-audio` -> `requestRecordingPermissionsAsync()`
* Galería propia: `expo-image-picker` -> `useMediaLibraryPermissions()`

Si un tutorial usa `import * as Permissions from 'expo-permissions'`, indica que el tutorial está muy desactualizado, ya que esa librería está deprecada.

**D2. Consultar, pedir y el hook**
a) `get` solamente consulta el estado actual del permiso sin mostrar nada en pantalla. `request` solicita activamente el permiso y puede mostrar el diálogo del sistema si `canAskAgain` es verdadero.
b) El hook devuelve un array con tres elementos: `[estadoDelPermiso, funcionParaPedir, funcionParaConsultar]`. En el primer render, el estado del permiso es `null`, por lo que la pantalla debe mostrar un indicador de carga o spinner mientras se resuelve.
c) Si `canAskAgain` es falso y se llama a `request`, la promesa se resuelve inmediatamente devolviendo el estado denegado sin mostrar nada. Si se llama dentro de un bucle, puede generar un ciclo infinito oculto que degrade el rendimiento.

**D3. Leé la respuesta**
* `null`: La app debe mostrar un indicador de carga (spinner o skeleton).
* `granted: true`: La app debe habilitar y mostrar la función requerida (ej. abrir la cámara).
* `undetermined` (canAskAgain: true): La app debe mostrar la pantalla previa explicativa con un botón para "Continuar".
* `denied` (canAskAgain: true): Igual que el anterior, mostrando la pantalla previa para volver a intentar.
* `denied` (canAskAgain: false): La app debe indicar que el permiso fue bloqueado y mostrar un botón que ofrezca "Abrir Ajustes".
* `limited`: La app debe mostrar solo el subconjunto de fotos al que el usuario dio acceso.
* `coarse`: La app debe mostrar una vista general del mapa sin precisar la ubicación exacta del usuario.

Los dos campos principales son `status` (¿cuál es el estado del permiso?) y `canAskAgain` (¿el sistema me permite mostrar el diálogo de nuevo?).

**D4. Simulación (Android 14)**
1. `getForegroundPermissionsAsync()` -> `status: undetermined`, `canAskAgain: true`, Sin diálogo.
2. `requestForeground...` (Rechazo) -> `status: denied`, `canAskAgain: true`, Sí, aparece el diálogo.
3. `requestForeground...` (Rechazo 2) -> `status: denied`, `canAskAgain: false`, Sí, aparece el diálogo.
4. `requestForeground...` -> `status: denied`, `canAskAgain: false`, NO aparece diálogo.
5. Vuelve de Ajustes -> `status: granted`.
6. Si no consulta de nuevo -> Quedará mostrando información desactualizada (denegado).

*En iOS:* En el paso 2, al denegar la primera vez, el estado pasa inmediatamente a `canAskAgain: false`. Si elige "Permitir una vez" y luego reabre la app, el permiso volverá a estar "Sin decidir" (undetermined).

**D6. Expo Go no es tu app**
a) Porque Expo Go es una aplicación precompilada que tiene su propio `Info.plist` y `AndroidManifest.xml`. Por lo tanto, no lee los textos personalizados declarados en tu `app.json`.
b) Expo Go sirve para probar UI y funciones estándar, pero para probar notificaciones Push nativas en Android, ubicación en segundo plano o código nativo personalizado, es necesaria una development build.
c) Comandos: `npx expo prebuild` (para ver los archivos nativos) y `npx expo run:android` o `eas build --profile development --platform android` (para compilar).
d) En Android (adb): `adb shell pm revoke com.tu.paquete android.permission.CAMERA`. En el simulador de iOS: Ir a Device -> Erase All Content and Settings, o Reset Location & Privacy.

## Parte E. Recetas: leer y corregir código

**E1. Errores Cámara**
Problemas principales:
1. No verifica si el estado del permiso es `null` durante el primer render (lo que causaría un error al leer `permiso.status`).
2. No contempla el estado bloqueado (`canAskAgain === false`) para ofrecer un enlace a Ajustes.
3. El botón "Permitir" llama directamente al diálogo sin mostrar adecuadamente la explicación primero.

*Versión corregida:*
```tsx
export default function Escanear() {
  const [permiso, pedirPermiso] = useCameraPermissions();

  if (!permiso) return <Text>Cargando...</Text>;
  
  if (permiso.granted) {
    return <CameraView style={{ flex: 1}} facing="back" />;
  }

  if (!permiso.canAskAgain) {
    return (
      <Explicacion texto="Permiso denegado. Habilita la cámara en los ajustes.">
        <Button title="Abrir Ajustes" onPress={Linking.openSettings} />
      </Explicacion>
    );
  }

  return (
    <Explicacion texto="Usamos la cámara para leer el QR del aula.">
      <Button title="Continuar" onPress={pedirPermiso} />
    </Explicacion>
  );
}
```

**E2. Ubicación**
a) El error es que intenta pedir el permiso en segundo plano (Background) antes de obtener el de primer plano (Foreground). En Android 11+ y en iOS, esto provoca un rechazo automático.
b) 
```typescript
export async function activarSeguimiento() {
  const enUso = await Location.requestForegroundPermissionsAsync();
  if (!enUso.granted) return false;

  const siempre = await Location.requestBackgroundPermissionsAsync();
  return siempre.granted;
}
```
d) No hace falta ubicación en segundo plano para "farmacias cercanas" (alcanza con primer plano). Si se solicita en Google Play sin una justificación clara en la funcionalidad central de la app, pueden rechazar o suspender la aplicación.

**E4. Fotos sin pedir permiso**
* Elegir una foto de perfil: Selector del sistema (`ImagePicker`). Permiso: Ninguno.
* Sacar una foto en el momento: `expo-camera`. Permiso: `CAMERA`.
* Adjuntar la foto de un comprobante: Selector del sistema. Permiso: Ninguno.

Google Play restringe el acceso total a la galería (`READ_MEDIA_IMAGES`) para promover la privacidad del usuario, ya que obliga a las apps a usar el selector del sistema cuando solo necesitan seleccionar archivos puntuales. "El mejor permiso es el que no se pide", porque reduce fricción y evita problemas de privacidad.

**E5. Volver de Ajustes**
```tsx
// Completando los espacios:
const estabaAfuera = 
  (anterior.current === 'background' || anterior.current === 'inactive') && 
  nuevo === 'active';

if (estabaAfuera) {
    revisar();
}
```
a) Los hooks de Expo guardan el estado inicial y no se actualizan automáticamente si el usuario modifica los permisos fuera de la app (en Configuración).
b) Le pasaría la función de consulta (el tercer elemento del arreglo devuelto por el hook, ej. `consultarPermiso`).
c) No conviene guardarlo de forma global persistente porque el estado real del permiso puede cambiar desde el sistema operativo en cualquier momento, haciendo que el estado global quede desincronizado.

## Parte F. Buenas prácticas y tiendas

**F1. Pedir en contexto**
* Delivery (Ubicación): Al tocar el botón "Usar mi ubicación actual". Alternativa: Ingresar la dirección manualmente.
* Billetera (Cámara): Al ingresar a la pantalla de escanear código QR. Alternativa: Ingresar el código del QR manualmente.
* Mensajería (Micrófono): Al intentar grabar una nota de voz por primera vez. Alternativa: Enviar mensajes de texto.

Pedir todos los permisos apenas se abre la app genera desconfianza y acostumbra al usuario a rechazar ("entrena el No permitir automático").

**F2. La pantalla previa**
a) Debe incluir: un texto o imagen clara sobre la función, el beneficio concreto para el usuario y un botón de acción (como "Continuar").
b) Se usa "Continuar" para que el usuario no confunda este botón con el botón "Permitir" definitivo que aparecerá en el diálogo nativo del sistema operativo.
c) Apple recomienda no incluir botones como "Ahora no" o "Cancelar" en la pantalla previa para no confundir al flujo (el usuario ya tiene la opción de cancelar en el diálogo nativo).
d) Si está bloqueado, el texto debe explicar cómo ir a Configuración para habilitarlo manualmente y el botón principal debe cambiar a "Abrir Ajustes".

**F3. Mínimo privilegio**
a) Aproximada. Es suficiente conocer el barrio para sugerir puntos de reciclaje cercanos; no se requiere la dirección exacta del usuario.
b) "En uso" (Foreground). Con un servicio en primer plano es suficiente para registrar la actividad mientras la app procesa la carrera.
c) Selector del sistema. Solo se necesita acceso al archivo de la foto del DNI, no a toda la biblioteca de imágenes.
d) Sin micrófono. Escanear un QR es un proceso puramente visual y no requiere procesar audio.

**F4. Tiendas**
a) Google Play exige justificar el uso de permisos en segundo plano y completar un formulario de seguridad de datos. App Store requiere incluir textos de propósito detallados (UsageDescriptions) y utilizar la transparencia de rastreo (App Tracking Transparency).
b) El manifiesto de privacidad (`PrivacyInfo.xcprivacy`) es un archivo donde se declaran las APIs sensibles que utiliza la app. Se configura en Expo agregando un plugin en el `app.json`.
c) Android 17 y Google Play comenzarán a exigir un uso más estricto para los contactos, limitando el acceso total a la agenda y promoviendo el uso del selector de contactos nativo para seleccionar contactos específicos sin solicitar `READ_CONTACTS`.

**F5. Errores comunes**
a) Causa: Falta el texto de propósito en el `Info.plist`. Solución: Agregarlo en el `app.json` bajo la sección `ios.infoPlist` o en la configuración del plugin respectivo.
b) Causa: La lógica intenta solicitar el permiso sin validar previamente el estado o el texto de propósito está ausente. Solución: Revisar el flujo de la solicitud y confirmar que el `app.json` esté correctamente configurado.
c) Causa: El hook o estado de la app no está escuchando los cambios en el ciclo de vida (AppState) para re-consultar el permiso tras volver de Ajustes. Solución: Implementar una validación al recuperar el foco (ej. usando un hook como `useRevisarAlVolver`).
d) Causa: El pedido del permiso (`requestPermissionsAsync`) se está ejecutando directamente en el cuerpo del componente y se dispara en cada renderizado. Solución: Mover la llamada dentro de un evento (como un `onPress`) o dentro de un `useEffect` controlado.
e) Causa: Falta una alternativa o "camino feliz" secundario. Solución: Permitir continuar a la pantalla principal y ofrecer una vista alternativa, como una bandeja de entrada interna dentro de la app para leer los turnos.