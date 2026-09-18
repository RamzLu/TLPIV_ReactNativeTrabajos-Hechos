# Lista de Tareas (tasks.md) - PetCare Tracker

> **Regla de desarrollo:** Cada tarea se ejecuta de forma individual, se prueba en Expo Go y se commitea con un mensaje referente a su ID (ej. `feat: T01 - navegación base`) antes de pasar a la siguiente.

---

## Fase 1: Arquitectura Base y Mocks

- **T01: Navegación base con Expo Router**
  - **Descripción:** Configurar la estructura de navegación con `expo-router` definiendo el Layout Raíz (`app/_layout.jsx`) y el Tab Bar principal (`app/(tabs)/_layout.jsx`) con pestañas para "Mascotas" e "Historial".
  - **Verificación:** Probar en el teléfono que las pestañas vacías funcionan y permiten alternar entre pantallas.

- **T02: Capa de Mocks y Servicios Simulados**
  - **Descripción:** Crear los datos estáticos iniciales en `services/mockData.js` (mascotas y registros médicos) y las funciones asíncronas en `services/petService.js` y `services/recordService.js` utilizando `setTimeout` para simular latencia de red (800 ms).
  - **Verificación:** Ejecutar un `console.log` o `useEffect` básico que obtenga los datos mock tras el tiempo de espera.

---

## Fase 2: Componentes UI Reutilizables y Estados

- **T03: Componentes para Estados de Carga y Vacío**
  - **Descripción:** Crear `components/LoadingState.jsx` (indicador de carga visual) y `components/EmptyState.jsx` (mensaje visual con icono para listas sin datos).
  - **Verificación:** Renderizar ambos componentes de prueba en la pantalla principal y confirmar que se vean correctamente en el teléfono.

- **T04: Componente StatusBadge**
  - **Descripción:** Crear `components/StatusBadge.jsx` para representar visualmente el tipo de atención (Vacuna, Desparasitación, Consulta) y su estado (Pendiente / Realizado) con diferentes colores distintivos.
  - **Verificación:** Renderizar la etiqueta con distintos props de tipo y estado.

---

## Fase 3: Pantalla 1 - Mis Mascotas (Home)

- **T05: Componente PetCard**
  - **Descripción:** Crear `components/PetCard.jsx` para mostrar la tarjeta de cada mascota con su foto (local o URI), nombre, raza, edad y un botón de acceso directo a su historial.
  - **Verificación:** Probar el componente pasando datos simulados mediante props.

- **T06: Implementación de la Pantalla Mis Mascotas**
  - **Descripción:** Desarrollar `app/(tabs)/index.jsx` consumiendo `petService.getPets()`. Debe gestionar los estados de carga (`loading`), renderizar un `FlatList` con las `PetCard` y mostrar el `EmptyState` si no hay mascotas.
  - **Verificación:** Probar la pantalla en el teléfono: ver el spinner durante la latencia y luego la lista de mascotas cargada.

---

## Fase 4: Pantalla 2 - Registro de Turnos y Vacunas (Historial)

- **T07: Componente RecordItem**
  - **Descripción:** Crear `components/RecordItem.jsx` para renderizar la fila de la lista cronológica con fecha, título, mascota asociada y el `StatusBadge` correspondiente.
  - **Verificación:** Verificar que la fila al ser presionada ejecute un evento de navegación.

- **T08: Implementación de la Pantalla Historial**
  - **Descripción:** Desarrollar `app/(tabs)/records.jsx` consumiendo `recordService.getRecords()`. Ordenar cronológicamente los registros médicos, incluir manejo de `LoadingState` y permitir filtrar por mascota o tipo de atención.
  - **Verificación:** Navegar entre la solapa de Mascotas e Historial y comprobar que los turnos se muestran ordenados por fecha.

---

## Fase 5: Pantalla 3 - Detalle de Registro / Ficha Médica

- **T09: Pantalla de Detalle de Registro**
  - **Descripción:** Crear `app/records/[id].jsx` utilizando rutas dinámicas de `expo-router`. Obtener el ID de la URL, buscar el detalle mediante `recordService.getRecordById(id)` y mostrar toda la información (profesional, costo, notas, dosis).
  - **Verificación:** Presionar un ítem del historial en la Pantalla 2 y confirmar que abre la pantalla de detalle mostrando la información correcta.

---

## Fase 6: Seleccionador de Foto y Formularios de Alta

- **T10: Componente Seleccionador de Imagen (ImagePickerInput)**
- **Descripción:** Instalar `expo-image-picker` y crear `components/ImagePickerInput.jsx` para seleccionar fotos desde la galería del teléfono o tomar una captura.
- **Verificación:** Probar el selector en el teléfono, otorgar permisos y verificar que devuelva la vista previa de la imagen seleccionada.

- **T11: Formulario de Alta de Mascota**
- **Descripción:** Crear `app/pets/new.jsx` para registrar una nueva mascota integrando `ImagePickerInput`, validación de campos obligatorios (nombre, especie, edad) y llamada al mock `petService.addPet()`.
- **Verificación:** Llenar el formulario, guardar y comprobar que la nueva mascota aparece en la Pantalla 1.

- **T12: Pantalla 4 - Formulario de Nueva Consulta/Vacuna**
- **Descripción:** Crear `app/records/new.jsx` con selectores para mascota y tipo de atención, fecha, costo y observaciones. Incluir validación sincrónica (campos vacíos y costo numérico) con mensajes de error descriptivos bajo los campos inválidos.
- **Verificación:** Intentar enviar el formulario vacío para comprobar los errores visuales; luego llenarlo correctamente, guardar y verificar que el nuevo registro figure en el historial.

---

## Fase 7: Ajustes Finales y Documentación

- **T13: Auditoría Final del Código y Documentación del Proceso**
  - **Descripción:** Revisar que no quede código muerto ni comentarios inapropiados. Completar el archivo `PROCESO.md` con los prompts ejecutados, capturas en Expo Go y reflexiones para la defensa oral.
  - **Verificación:** Realizar un recorrido completo de la app desde Expo Go en el teléfono real antes de la entrega.
