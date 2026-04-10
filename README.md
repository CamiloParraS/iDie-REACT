# iDie Frontend

Aplicacion web de gestion clinica para pacientes, desarrollada con React + TypeScript + Vite.

## Tecnologias

- React 19
- TypeScript (modo `strict`)
- React Router v7
- Tailwind CSS v4
- Fetch API nativa
- ESLint

## Requisitos

- Node.js 18+
- Backend disponible en `http://localhost:8080`

## Configuracion

1. Instala dependencias:

```bash
npm install
```

2. Crea un archivo `.env` en la raiz del proyecto (opcional):

```env
VITE_API_BASE_URL=http://localhost:8080
```

Si no se define, la app usa `http://localhost:8080` por defecto.

## Scripts

```bash
npm run dev      # entorno de desarrollo
npm run build    # compilacion de produccion
npm run preview  # previsualizacion build
npm run lint     # analisis estatico
```

## Funcionalidades implementadas

- Login y registro de pacientes
- Manejo de token JWT en memoria (sin localStorage)
- Validacion periodica de sesion (`/api/auth/validate`)
- Rutas protegidas con `ProtectedRoute`
- Dashboard con:
  - Proximas citas y cancelacion
  - Ultimos resultados de laboratorio con indicador visual de rango
- Agendamiento de citas en 3 pasos:
  - Especialidad
  - Medico y horario
  - Confirmacion
- Historia clinica completa en tabs:
  - Informacion del paciente y alergias
  - Consultas (con busqueda y detalle expandible)
  - Prescripciones (con detalle expandible y advertencias)
  - Laboratorios (estado, valor, rango de referencia)

## Estructura principal

```text
src/
├── components/
│   ├── Appointment/
│   ├── Auth/
│   ├── Common/
│   ├── Dashboard/
│   └── History/
├── context/
├── hooks/
├── services/
├── types/
└── utils/
```

## Notas de seguridad

- El token se conserva unicamente en estado de React.
- Se limpia sesion al hacer logout.
- Errores del backend se manejan por `errorCode`.
- Las solicitudes usan timeout de 10 segundos y reintentos automaticos para errores de red.

## Flujo principal

1. Usuario ingresa a login o registro.
2. Con autenticacion correcta, accede a dashboard.
3. Desde dashboard puede:
   - Agendar o cancelar citas
   - Abrir historia clinica
4. Puede cerrar sesion en cualquier momento desde el header.
