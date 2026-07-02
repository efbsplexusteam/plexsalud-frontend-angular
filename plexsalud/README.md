# Plexsalud

Plataforma web de gestión de turnos médicos con autenticación JWT y control de acceso basado en roles (Paciente, Doctor, Enfermero).

Construida con **Angular 20**, **Angular Material**, **Signals**, **FullCalendar**, y **Vitest**. Sigue una arquitectura de componentes standalone con lazy loading y detección de cambios sin Zone.js.

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Angular 20.3.2 (standalone components) |
| Lenguaje | TypeScript 5.9 |
| UI | Angular Material 20 (MatSidenav, MatToolbar, MatStepper, MatSnackBar, etc.) |
| Calendario | FullCalendar 6 (dayGrid, timeGrid, interaction) |
| Estado | Signals (sin NgRx, sin Zone.js) |
| Formularios | Reactive Forms con validación personalizada |
| HTTP | Angular HttpClient con interceptores funcionales |
| Testing | Vitest + jsdom + Angular TestBed |
| Linting | Prettier + SonarQube |
| Dev Environment | Docker + Dev Container |

---

## Arquitectura

```
src/
├── app/
│   ├── core/                        # Servicios globales, guards, interceptors
│   │   ├── guards/                  # 5 guards: jwt, logued, role-{patient,doctor,nurse}
│   │   ├── interceptors/            # JWT interceptor + spinner interceptor
│   │   └── services/               # Spinner (loading state)
│   ├── modules/
│   │   ├── auth/                    # Login, Register, Auth service, State service
│   │   ├── landing/                 # Landing page
│   │   ├── patient/                 # Perfil, formulario, reserva de turnos
│   │   ├── doctor/                  # Perfil, formulario con especialidad
│   │   └── nurse/                   # Perfil, formulario
│   └── shared/
│       ├── components/              # Calendar, Sidenav, Spinner, Toolbar
│       └── services/               # Appointment CRUD
```

### Puntos clave

- **Standalone components**: sin NgModules, bootstrap directo con `bootstrapApplication`.
- **Lazy loading**: cada módulo de rol se carga bajo demanda por ruta.
- **Zoneless change detection**: Angular 18+ con Signals, sin Zone.js.
- **Functional interceptors**: `jwtInterceptor` (token + refresh) y `spinnerInterceptor` (loading UI).
- **Guards role-based**: `jwtGuard` + `rolePatientGuard` / `roleDoctorGuard` / `roleNurseGuard`.
- **Estado reactivo**: Signals en `State` service para `role` y `existToken`.
- **134 tests unitarios** cubriendo componentes, servicios, guards e interceptors.

---

## Funcionalidades

### Autenticación
- Login y registro por rol (paciente, doctor, enfermero).
- JWT almacenado en sessionStorage.
- Refresh automático de token ante 401.
- Snackbar de feedback para errores.

### Paciente
- Creación de perfil.
- Visualización de turnos propios en calendario.
- Reserva de turno en 3 pasos: seleccionar especialidad → elegir doctor → elegir fecha/hora.
- Cancelación de turnos.

### Doctor
- Creación de perfil con especialidad (25 especialidades disponibles).
- Visualización de turnos asignados en calendario.
- Cancelación de turnos.

### Enfermero
- Creación de perfil.
- Visualización de información personal.

---

## Cómo ejecutar

```bash
# Prerequisitos: Node.js 22+, Angular CLI 20
cd plexsalud

# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Abrir en http://localhost:4200

# Build de producción
ng build

# Ejecutar tests (134 tests)
ng test

# Coverage
npx vitest run --coverage
```

### Con Docker (dev container)

```bash
# Desde la raíz del repositorio
# Abrir en VS Code -> "Reopen in Container"
# O manualmente:
docker compose -f .devcontainer/docker-compose.yml up -d
```

---

## Testing

- **Framework**: Vitest con jsdom y Angular TestBed.
- **Builder**: `@angular/build:unit-test` (nuevo en Angular 20).
- **134 tests**, 30 archivos, 0 fallos.
- Cobertura: componentes, servicios API, guards, interceptores.

### Qué se testea

| Capa | Tests |
|------|-------|
| Guards | Lógica de autorización + snackbar + redirect |
| Interceptors | JWT header, refresh en 401, spinner show/hide |
| Auth services | Login, register, refresh, logout HTTP calls |
| Appointment service | CRUD endpoints y métodos HTTP |
| Login / Register | Validación de forms, flujo completo auth |
| Patient Profile / Form | Creación, carga, error handling |
| Doctor Profile / Form | Creación con especialidad, carga |
| Nurse Profile / Form | Creación, carga |
| Calendar | Navegación, validación de fechas, eventos |
| Toolbar | Sesión, logout, botones condicionales |
| Spinner | Loading overlay según signal |
| Sidenav | Layout shell con router-outlet |

---

## API

El frontend consume una API REST en `http://localhost:8080/api/v1` (configurable por entorno).

| Endpoint | Método | Propósito |
|----------|--------|-----------|
| `/auth/login` | POST | Iniciar sesión |
| `/auth/signup` | POST | Registrar usuario |
| `/auth/refresh` | GET | Refrescar JWT |
| `/auth/logout` | GET | Cerrar sesión |
| `/patients/self` | GET | Perfil del paciente |
| `/patients` | POST | Crear paciente |
| `/doctor/self` | GET | Perfil del doctor |
| `/doctor/specialties` | GET | Lista de especialidades |
| `/doctor/doctors-by-specialty` | GET | Doctores por especialidad |
| `/doctor` | POST | Crear doctor |
| `/nurses/self` | GET | Perfil del enfermero |
| `/nurses` | POST | Crear enfermero |
| `/appointment` | POST | Crear turno |
| `/appointment/patient` | GET | Turnos del paciente |
| `/appointment/doctor` | GET | Turnos del doctor |
| `/appointment/doctor-search-by-patient` | GET | Turnos de un doctor específico |
| `/appointment/:uuid` | DELETE | Cancelar turno |

---

## Ambiente de desarrollo

- **File replacements**: `environment.ts` (producción) ↔ `environment.development.ts` (desarrollo).
- **SonarQube**: configurado con exclusiones para spec files.
- **Prettier**: printWidth 100, singleQuote, Angular HTML formatter.
- **Dev Container**: Docker con Node 22, pnpm, Angular CLI, extensiones VS Code.
