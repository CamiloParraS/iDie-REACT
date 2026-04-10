export type BackendErrorCode =
    | 'PATIENT_NOT_FOUND'
    | 'DUPLICATE_DOCUMENT'
    | 'APPOINTMENT_NOT_FOUND'
    | 'NO_AVAILABLE_DOCTOR'
    | 'INVALID_CREDENTIALS'
    | 'INVALID_TOKEN'
    | 'ALLERGY_CONFLICT'
    | 'VALIDATION_ERROR'
    | 'INTERNAL_ERROR'

export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
    errorCode?: BackendErrorCode
    timestamp: string
}

export interface ApiSuccessResponse<T> extends ApiResponse<T> {
    success: true
    data: T
}

export interface ApiErrorResponse extends ApiResponse<never> {
    success: false
    data?: undefined
    errorCode: BackendErrorCode
}

export type ApiEnvelope<T> = ApiResponse<T>

export type Role = 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST'
export type AuthRole = Role | 'UNKNOWN'
export type Specialty =
    | 'CARDIOLOGY'
    | 'DERMATOLOGY'
    | 'PEDIATRICS'
    | 'NEUROLOGY'
    | 'OPHTHALMOLOGY'
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH'
export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED'
export type PrescriptionStatus = 'ACTIVE' | 'EXPIRED'
export type LabResultStatus = 'PENDING' | 'COMPLETED'

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

export interface LoginPayload {
    username: string
    passwordHash: string
}

export interface LoginResponse {
    token: string
    username: string
    role: Role
    expiresIn: number
}

export interface ValidateResponse {
    valid: boolean
    username: string
    role: Role
}

export interface LogoutResponse {
    username: string
}

export interface RegisterPatientRequest {
    firstName: string
    lastName: string
    documentType: string
    document: string
    email: string
    phone: string
    birthDate: string
}

export interface PatientResponse {
    id: string
    firstName: string
    lastName: string
    documentType: string
    document: string
    email: string
    phone: string
    birthDate: string
    createdAt: string
    updatedAt: string
}

export type RegisterPatientResponse = PatientResponse
export type Patient = PatientResponse
export type PatientProfileResponse = PatientResponse

export interface ScheduleAppointmentRequest {
    patientId: string
    specialty: Specialty
    date: string
}

export interface ScheduleAppointmentResponse {
    appointmentId: string
    patientId: string
    doctorId: string
    doctorName: string
    specialty: Specialty
    appointmentDate: string
    status: AppointmentStatus
    reminder: string
}

export interface CancelAppointmentResponse {
    appointmentId: string
    status: AppointmentStatus
}

export interface DoctorResponse {
    id: string
    name: string
    specialty: Specialty
    availableSlots: string[]
}

export type Doctor = DoctorResponse

export interface ConsultationRequest {
    patientId: string
    doctorName: string
    diagnosis: string
    notes?: string
}

export interface ConsultationResponse {
    id: string
    patientId: string
    consultationDate: string
    doctorName: string
    diagnosis: string
    notes?: string
}

export type Consultation = ConsultationResponse

export interface AllergyRequest {
    patientId: string
    allergyName: string
    severity: Severity
}

export interface AllergyResponse {
    id: string
    patientId: string
    allergyName: string
    severity: Severity
}

export type Allergy = AllergyResponse

export interface MedicationRequest {
    name: string
    dosage: string
    frequency: string
    duration: string
}

export interface CreatePrescriptionRequest {
    patientId: string
    medications: MedicationRequest[]
}

export interface MedicationResponse {
    name: string
    dosage: string
    frequency: string
    duration: string
}

export interface PrescriptionResponse {
    id: string
    patientId: string
    medications: MedicationResponse[]
    prescriptionDate: string
    duration: string
    status: PrescriptionStatus
    allergyWarnings: string[]
}

export type Prescription = PrescriptionResponse

export interface RequestLabTestRequest {
    patientId: string
    testNames: string[]
}

export interface RequestLabTestResponse {
    patientId: string
    requestedTests: string[]
    requestDate: string
    estimatedCompletionDate: string
    status: LabResultStatus
}

export interface LabResultResponse {
    id: string
    patientId: string
    testName: string
    resultValue: number | null
    referenceMin: number
    referenceMax: number
    testDate: string
    status: LabResultStatus
}

export type LaboratoryResult = LabResultResponse

export interface Appointment {
    appointmentId: string
    doctorId: string
    appointmentDate: string
    status: AppointmentStatus
    doctorName?: string
    specialty?: Specialty
}

export interface CompleteHistoryResponse {
    patient: PatientResponse
    appointments: Appointment[]
    consultations: ConsultationResponse[]
    allergies: AllergyResponse[]
    activePrescriptions: PrescriptionResponse[]
    laboratoryResults: LabResultResponse[]
}

export type ClinicalHistory = CompleteHistoryResponse
