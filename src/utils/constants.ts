import type { BackendErrorCode } from '../types/api'

export const APP_NAME = 'iDie'

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL

export const REQUEST_TIMEOUT_MS = 10_000
export const REQUEST_RETRIES = 3

export const SPECIALTIES = {
    CARDIOLOGY: 'Cardiologia',
    DERMATOLOGY: 'Dermatologia',
    PEDIATRICS: 'Pediatria',
    NEUROLOGY: 'Neurologia',
    OPHTHALMOLOGY: 'Oftalmologia',
} as const

export const APPOINTMENT_STATUS = {
    SCHEDULED: 'Programada',
    CANCELLED: 'Cancelada',
} as const

export const PRESCRIPTION_STATUS = {
    ACTIVE: 'Activa',
    EXPIRED: 'Vencida',
} as const

export const LAB_STATUS = {
    PENDING: 'Pendiente',
    COMPLETED: 'Completado',
} as const

export const SEVERITY = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
} as const

export const ERROR_MESSAGES: Record<BackendErrorCode, string> = {
    INVALID_CREDENTIALS: 'Usuario o contrasena incorrectos.',
    INVALID_TOKEN: 'Tu sesion expiro. Inicia sesion nuevamente.',
    DUPLICATE_DOCUMENT: 'El numero de documento ya esta registrado.',
    DUPLICATE_EMAIL: 'El correo ya esta registrado.',
    NO_AVAILABLE_DOCTOR: 'No hay medicos disponibles para la especialidad seleccionada.',
    PATIENT_NOT_FOUND: 'No se encontro el paciente solicitado.',
    APPOINTMENT_NOT_FOUND: 'La cita ya no existe o fue eliminada.',
    ALLERGY_CONFLICT: 'La prescripcion presenta conflicto con alergias registradas.',
    VALIDATION_ERROR: 'Hay datos invalidos. Revisa los campos marcados.',
    INTERNAL_ERROR: 'Ocurrio un error interno. Intenta de nuevo en unos minutos.',
}

export function getRouteByRole(role: string | undefined): string {
    const normalizedRole = role?.toUpperCase()

    if (normalizedRole === 'DOCTOR') {
        return '/dashboard'
    }

    if (normalizedRole === 'RECEPTIONIST') {
        return '/dashboard'
    }

    if (normalizedRole === 'ADMIN') {
        return '/dashboard'
    }

    return '/dashboard'
}
