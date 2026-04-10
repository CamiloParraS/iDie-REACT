export type BackendErrorCode =
    | 'INVALID_CREDENTIALS'
    | 'INVALID_TOKEN'
    | 'DUPLICATE_DOCUMENT'
    | 'NO_AVAILABLE_DOCTOR'
    | 'PATIENT_NOT_FOUND'
    | 'APPOINTMENT_NOT_FOUND'
    | 'VALIDATION_ERROR'
    | 'INTERNAL_ERROR'

export interface ApiFieldError {
    field: string
    message: string
}

export interface ApiEnvelope<T> {
    success?: boolean
    data?: T
    errorCode?: BackendErrorCode
    message?: string
    errors?: ApiFieldError[]
}

export type AuthRole = 'PATIENT' | 'DOCTOR' | 'ADMIN' | 'UNKNOWN'

export interface AuthUser {
    id: string
    username: string
    role: AuthRole
    patientId?: string
    firstName?: string
    lastName?: string
    email?: string
}

export interface AuthSession {
    token: string
    user: AuthUser
}

export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterPatientRequest {
    firstName: string
    lastName: string
    documentType: string
    documentNumber: string
    email: string
    phone: string
    birthDate: string
}

export interface RegisterPatientResponse {
    patientId: string
    token?: string
    user?: Partial<AuthUser>
}

export interface Patient {
    id: string
    firstName: string
    lastName: string
    documentType: string
    documentNumber: string
    email: string
    phone: string
    birthDate: string
    registeredAt?: string
}

export type SeverityKey = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Allergy {
    id: string
    name: string
    severity: SeverityKey
}

export interface Consultation {
    id: string
    date: string
    doctorName: string
    diagnosis: string
    notes: string
}

export interface Medication {
    id: string
    name: string
    dose: string
    frequency: string
    duration: string
}

export type PrescriptionStatus = 'ACTIVE' | 'EXPIRED'

export interface Prescription {
    id: string
    date: string
    status: PrescriptionStatus
    duration: string
    medications: Medication[]
    allergyWarning?: boolean
}

export type LaboratoryStatus = 'PENDING' | 'COMPLETED'

export interface LaboratoryResult {
    id: string
    date: string
    testType: string
    value: number | null
    referenceMin: number | null
    referenceMax: number | null
    status: LaboratoryStatus
}

export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED'

export interface Appointment {
    id: string
    specialty: string
    doctorId: string
    doctorName: string
    scheduledAt: string
    status: AppointmentStatus
}

export interface ClinicalHistory {
    patient: Patient
    allergies: Allergy[]
    consultations: Consultation[]
    prescriptions: Prescription[]
    laboratories?: LaboratoryResult[]
    appointments?: Appointment[]
}

export interface Doctor {
    id: string
    name: string
    specialty: string
    availableSlots: string[]
}

export interface CreateAppointmentRequest {
    patientId: string
    doctorId: string
    specialty: string
    scheduledAt: string
}

export interface CreateAppointmentResponse {
    appointment: Appointment
    reminder?: string
}
