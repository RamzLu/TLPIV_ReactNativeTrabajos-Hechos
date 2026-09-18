# AGENTS.md — Reglas y Convenciones del Proyecto para Agentes de IA

Este documento contiene las reglas obligatorias que todo agente de IA debe seguir al generar o modificar código en este repositorio.

---

## 1. Reglas Generales de Trabajo (Spec-Driven Development)

1. **La spec y el plan mandan:** No programes funcionalidades que no estén explícitamente definidas en `spec.md` o en la tarea actual de `tasks.md`.
2. **Desarrollo atómico (Una tarea a la vez):** Procesa únicamente la tarea solicitada por el usuario. Queda prohibido generar código para múltiples tareas simultáneamente.
3. **Código completo:** Entrega siempre el código fuente completo de los archivos solicitados, sin omitir partes ni usar comentarios del tipo `// ... resto del código`.
4. **Explicabilidad:** Añade comentarios breves y didácticos explicativos en bloques lógicos complejos, ya que el código será defendido oralmente línea por línea.

---

## 2. Stack Tecnológico y Restricciones

- **Framework:** React Native con Expo.
- **Navegación:** `expo-router` (navegación basada en la estructura de la carpeta `app/`). Prohibido usar React Navigation clásico (`@react-navigation/native`) directamente.
- **Lenguaje:** JavaScript ES6+ (Componentes funcionales y Hooks).
- **Estilos:** `StyleSheet.create` de React Native. Prohibido usar CSS puro o clases de Tailwind/NativeWind a menos que se indique lo contrario.

---

## 3. Reglas de Componentes Mobile

1. **Sin elementos DOM Web:** Nunca utilices etiquetas HTML (`div`, `span`, `p`, `button`, `img`, `input`). Utiliza únicamente componentes nativos de React Native:
   - `<View>` en lugar de `<div>`
   - `<Text>` en lugar de `<span>` o `<p>` (Todo texto debe estar dentro de un `<Text>`)
   - `<Pressable>` o `<TouchableOpacity>` en lugar de `<button>`
   - `<Image>` de `react-native` o `expo-image` en lugar de `<img>`
   - `<TextInput>` en lugar de `<input>`
2. **Listas Eficientes:** Usa `<FlatList>` para renderizar colecciones de datos, nunca `.map()` dentro de un `<ScrollView>` para listas largas.

---

## 4. Reglas para Mocks y Servicios (`services/`)

1. **Cero Backend Real:** No realices llamadas `fetch()` ni `axios` a servidores externos o APIs reales.
2. **Latencia Simulada:** Todas las funciones de datos en `services/` deben devolver una `Promise` que se resuelve tras un `setTimeout` de entre 500ms y 1000ms.
3. **Gestión de Estados Obligatoria:**
   - En las vistas que consumen mocks, gestiona siempre un estado `loading` que muestre un `ActivityIndicator` mientras la promesa se resuelve.
   - Gestiona un estado `empty` si el arreglo devuelto está vacío.

---

## 5. Idioma y Convenciones de Código

- **Idioma del Código:** Variables, funciones y componentes deben nombrarse en inglés (ej. `getPetById`, `PetCard`, `loading`).
- **Idioma de Interfaz y Comentarios:** El texto visible para el usuario (UI) y los comentarios del código deben estar en español.
- **Formato de Archivos:** Usa extensión `.jsx` para componentes y pantallas React, y `.js` para utilidades y mocks.
