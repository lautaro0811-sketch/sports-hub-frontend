# Sports Hub — Frontend (React)

Aplicación SPA (*Single Page Application*) para el sistema de reserva de canchas deportivas **Sports Hub**, desarrollada con **React + Vite + Tailwind CSS**.

Consume la API REST del backend en Rails y permite a los usuarios registrarse, explorar canchas, filtrar por disciplina/fecha/horario, reservar turnos, abonar la seña del 30% y gestionar sus reservas.

---

## Stack Tecnológico

- **React:** 18.x — Componentes funcionales y hooks
- **Vite:** 5.x — Servidor de desarrollo y compilación
- **Tailwind CSS:** 3.x — Estilos utility-first
- **React Router DOM:** 6.x — Navegación y rutas protegidas
- **Axios:** 1.x — Cliente HTTP con interceptores de JWT
- **Lucide React:** Íconos SVG
- **Vitest + React Testing Library:** Tests automatizados (11 tests)

---

## Instalación y Puesta en Marcha

### Requisito previo
El **servidor de Rails (Backend)** debe estar corriendo en `http://localhost:3000` antes de iniciar el frontend.

```bash
# 1. Clonar el repositorio e ingresar
git clone https://github.com/lautaro0811-sketch/sports-hub-frontend.git
cd sports-hub-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# El archivo .env ya apunta al backend local: VITE_API_URL=http://localhost:3000/api/v1

# 4. Levantar el servidor de desarrollo (puerto 5173)
npm run dev
```

Abrí tu navegador en: **`http://localhost:5173`**

---

## Scripts Disponibles

```bash
npm run dev       # Inicia el servidor de desarrollo con hot-reload
npm run build     # Compila la aplicación para producción en /dist
npm run preview   # Previsualiza el build de producción localmente
npm run test      # Ejecuta la suite completa de tests con Vitest
```

---

## Estructura del Proyecto

```
src/
├── api/
│   ├── client.js           # Axios con interceptores de JWT y manejo de 401
│   ├── auth.js             # login(), register(), getMe()
│   ├── courts.js           # getSports(), getCourts(), getCourt()
│   └── reservations.js     # CRUD de reservas + depósito de seña
├── context/
│   └── AuthContext.jsx     # Estado global de sesión: user, token, login/logout
├── components/
│   ├── Navbar.jsx          # Barra de navegación responsive con menú mobile
│   ├── ProtectedRoute.jsx  # Guardia de rutas para usuarios no autenticados
│   ├── Alert.jsx           # Componente de alerta reutilizable (error/success/info)
│   ├── CourtCard.jsx       # Tarjeta visual de cancha con disponibilidad en tiempo real
│   └── CourtFilters.jsx    # Filtros por deporte, fecha y horario
├── pages/
│   ├── HomePage.jsx        # Landing con hero y catálogo integrado
│   ├── LoginPage.jsx       # Formulario de inicio de sesión con validaciones
│   ├── RegisterPage.jsx    # Formulario de registro con validaciones
│   ├── CourtsPage.jsx      # Catálogo de canchas con filtros reactivos
│   ├── CourtDetailPage.jsx # Detalle de cancha y grilla de turnos con precios
│   ├── NewReservationPage.jsx # Flujo de reserva en 3 pasos + pago de seña
│   └── ReservationsPage.jsx   # Panel "Mis Reservas": historial, pago y cancelación
├── utils/
│   └── imageUrl.js         # Helper para resolver URLs de Active Storage
└── setupTests.js           # Configuración de @testing-library/jest-dom
```

---

## Flujo Principal de la Aplicación

```
Inicio (/) ── Filtrar Canchas
                    │
                    ▼
         Ver Detalle de Cancha (/courts/:id)
                    │
            Seleccionar Turno
                    │
              ┌─────▼─────┐
              │ ¿Logueado? │
              └─────┬─────┘
            No ─────┘ Sí
            │             │
         /login       /reservations/new
                           │
                    Paso 1: Revisar datos y desglose 30/70%
                    Paso 2: Simular pago de seña (mock)
                    Paso 3: Voucher de confirmación
                           │
                    /reservations (Mis Reservas)
```

---

## Pruebas Automatizadas

```bash
npm run test

# Resultado esperado:
# ✓ src/pages/LoginPage.test.jsx          (3 tests)
# ✓ src/pages/CourtsPage.test.jsx         (3 tests)
# ✓ src/pages/NewReservationPage.test.jsx (2 tests)
# ✓ src/pages/ReservationsPage.test.jsx   (3 tests)
#
# Test Files: 4 passed (4)
# Tests:      11 passed (11)
```

Los tests usan respuestas simuladas (*mocks*) de la API para poder ejecutarse sin necesidad de que Rails esté corriendo.

---

## Proyectos Relacionados

- **Backend Rails:** [sports-hub](https://github.com/lautaro0811-sketch/sports-hub)
- **Contrato de la API:** [API_CONTRACT.md](https://github.com/lautaro0811-sketch/sports-hub/blob/feature/tp2-api-integration/API_CONTRACT.md)

---

## Variables de Entorno

| Variable | Descripción | Default |
|:---|:---|:---|
| `VITE_API_URL` | URL base del backend Rails | `http://localhost:3000/api/v1` |

