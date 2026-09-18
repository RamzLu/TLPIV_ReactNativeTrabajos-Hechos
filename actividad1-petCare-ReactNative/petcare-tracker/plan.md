# Plan Técnico: PetCare Tracker

## 1. Estructura de Directorios del Proyecto

El proyecto utilizará la convención de carpetas estándar de Expo con `expo-router` para la navegación por archivos:

```text
petcare-tracker/
├── app/                        # Rutas y navegación (Expo Router)
│   ├── _layout.jsx             # Layout raíz (Stack / Tabs principal)
│   ├── (tabs)/                 # Navegación por pestañas
│   │   ├── _layout.jsx         # Configuración de los Tab Bars
│   │   ├── index.jsx           # Pantalla 1: Mis Mascotas (Home)
│   │   └── records.jsx         # Pantalla 2: Historial de Turnos/Vacunas
│   ├── records/
│   │   ├── [id].jsx            # Pantalla 3: Detalle de Registro/Ficha Médica
│   │   └── new.jsx             # Pantalla 4: Formulario de Nueva Consulta/Vacuna
│   └── pets/
│       └── new.jsx             # Formulario secundario para agregar mascota (con foto)
├── assets/                     # Imágenes locales y fotos por defecto para los mocks
│   └── images/
├── components/                 # Componentes de UI reutilizables
│   ├── PetCard.jsx             # Tarjeta visual de cada mascota
│   ├── RecordItem.jsx          # Fila/tarjeta de cada vacuna o turno
│   ├── StatusBadge.jsx         # Etiqueta visual para tipo/estado de atención
│   ├── LoadingState.jsx        # Spinner / UI de carga con latencia
│   ├── EmptyState.jsx          # Mensaje visual cuando no hay datos
│   └── ImagePickerInput.jsx    # Componente para seleccionar foto de la mascota
├── services/                   # Capa de datos simulados (Mocks)
│   ├── mockData.js             # Objetos de datos iniciales estáticos
│   ├── petService.js           # Promesas simuladas para mascotas
│   └── recordService.js        # Promesas simuladas para vacunas y turnos
├── utils/                      # Funciones auxiliares (formateo de fechas, validaciones)
│   └── formatters.js
├── AGENTS.md                   # Convenciones e instrucciones para el agente de IA
├── spec.md                     # Especificación funcional del proyecto
├── plan.md                     # Este plan técnico
├── tasks.md                    # Lista de tareas atómicas a ejecutar
└── PROCESO.md                  # Registro continuo del proceso de desarrollo
```
