# Especificación del Proyecto: PetCare Tracker (Control de Cuidado y Salud de Mascotas)

## 1. Visión General del Producto

PetCare Tracker es una aplicación móvil diseñada para ayudar a los dueños de mascotas a gestionar la salud de sus animales domésticos. Permite centralizar la información médica básica, el historial de vacunación, desparasitaciones y los próximos turnos veterinarios en un entorno visual, limpio e intuitivo.

## 2. Historias de Usuario

- **HU-01:** Como dueño de una mascota, quiero ver un listado de mis mascotas con su foto y edad para acceder rápidamente a su información.
- **HU-02:** Como dueño de una mascota, quiero consultar la lista cronológica de turnos y vacunas para llevar un control de sus atenciones médicas.
- **HU-03:** Como dueño de una mascota, quiero ver los detalles completos de una vacuna o turno (profesional, dosis, notas) para recordar los datos de la atención médica.
- **HU-04:** Como dueño de una mascota, quiero registrar un nuevo turno o vacuna mediante un formulario validado para actualizar su ficha médica.

---

## 3. Especificación de Pantallas y Funcionalidades

### Pantalla 1: Mis Mascotas (Home / Inicio)

- **Objetivo:** Mostrar la lista de mascotas registradas con un resumen visual.
- **Componentes clave:**
  - Tarjetas de mascota con foto, nombre, especie/raza y edad.
  - Accesos directos en cada tarjeta para ver la ficha/turnos de esa mascota específica.
  - Botón flotante o superior para agregar un nuevo registro médico.
- **Criterios de Aceptación:**
  - Debe mostrar las mascotas obtenidas del servicio mock.
  - Si los datos tardan en cargar, debe mostrar una pantalla o spinner de carga.

### Pantalla 2: Registro de Turnos y Vacunas (Historial Cronológico)

- **Objetivo:** Mostrar la lista unificada de vacunas aplicadas, desparasitaciones y próximos turnos.
- **Componentes clave:**
  - Lista cronológica ordenada por fecha (próximos eventos arriba, pasados abajo).
  - Distintivos visuales (badgers o etiquetas) según el tipo de atención (Vacuna, Desparasitación, Consulta).
  - Filtro por mascota o tipo de atención (opcional).
- **Criterios de Aceptación:**
  - Debe listar todos los registros médicos simulados.
  - Al presionar un registro, debe navegar a la Pantalla 3 (Detalle de Registro).

### Pantalla 3: Detalle de Registro / Ficha Médica

- **Objetivo:** Exhibir la información completa de un turno o vacuna en particular.
- **Componentes clave:**
  - Título y tipo de atención.
  - Mascota asociada.
  - Fecha de aplicación o fecha del turno.
  - Nombre del profesional veterinario o clínica.
  - Dosis / Producto aplicado (si aplica).
  - Observaciones o notas adicionales.
  - Estado del turno (Pendiente / Realizado).
- **Criterios de Aceptación:**
  - Recibe el identificador del registro mediante la ruta (`expo-router`).
  - Muestra los datos mock correspondientes a ese ID.

### Pantalla 4: Formulario de Nueva Consulta/Vacuna

- **Objetivo:** Permitir al usuario ingresar un nuevo registro médico o agendar un turno.
- **Campos del formulario:**
  1. Mascota (Selección de lista desplegable o picker).
  2. Tipo de Atención (Vacuna, Desparasitación, Consulta, Control).
  3. Fecha de la atención o turno.
  4. Profesional / Clínica veterinaria.
  5. Costo estimado / abonado.
  6. Observaciones / Notas.
- **Criterios de Aceptación:**
  - Validación obligatoria: No se puede enviar el formulario con campos esenciales vacíos (Mascota, Tipo, Fecha).
  - Validación de formato: El campo de costo debe ser numérico.
  - Muestra mensajes de error claros debajo de los campos inválidos.
  - Al guardar exitosamente, simula la creación, muestra una confirmación y redirige al historial o detalle.

---

## 4. Manejo de Estados (Requisito SDD con Mocks)

Debido a que los datos provienen de un servicio simulado con latencia artificial (500ms - 1000ms):

1. **Estado de Carga (Loading State):**
   - Se debe mostrar un indicador explícito de carga (`ActivityIndicator` o esqueleto) mientras los mocks devuelven los datos.
2. **Estado Vacío (Empty State):**
   - Si la mascota no tiene vacunas registradas o la lista está vacía, se debe mostrar un mensaje ilustrativo ("No hay registros médicos cargados aún") junto a un botón para agregar uno.
3. **Estado de Error (Error State):**
   - Manejo básico si falla la respuesta mock.

---

## 5. Fuera de Alcance (Out of Scope)

Para acotar el prototipo a los tiempos y requisitos de la materia, **NO** se implementará:

- Autenticación de usuarios (login/registro).
- Conexión a un backend real o base de datos en la nube.
- Tomar fotos en tiempo real con la cámara (las fotos se cargarán desde assets locales estáticos o URLs fijas).
- Notificaciones Push nativas o alarmas del sistema.
- Integración directa con el calendario nativo del teléfono.

---

## 6. Stack y Mocks

- **Framework:** React Native con Expo (vía `expo-router`).
- **Persistencia Local:** `AsyncStorage` (opcional / simulada).
- **Mocks:** Funciones en `services/` que devuelven Promesas con latencia simulada (`setTimeout`).
