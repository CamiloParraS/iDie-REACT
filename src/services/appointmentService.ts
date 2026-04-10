import { apiRequest } from '../utils/apiClient'
import type {
    CreateAppointmentRequest,
    CreateAppointmentResponse,
    Doctor,
} from '../types/api'

interface DoctorResponse {
    id: string
    name: string
    specialty: string
    availableSlots?: string[]
    slots?: string[]
}

function normalizeDoctor(doctor: DoctorResponse): Doctor {
    return {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        availableSlots: doctor.availableSlots || doctor.slots || [],
    }
}

export async function getDoctorsBySpecialty(
    specialty: string,
    token: string,
): Promise<Doctor[]> {
    const doctors = await apiRequest<DoctorResponse[]>(
        `/api/clinic/doctors?specialty=${encodeURIComponent(specialty)}`,
        {
            method: 'GET',
            token,
        },
    )

    return doctors.map(normalizeDoctor)
}

export async function createAppointment(
    payload: CreateAppointmentRequest,
    token: string,
): Promise<CreateAppointmentResponse> {
    return apiRequest<CreateAppointmentResponse>('/api/clinic/appointment', {
        method: 'POST',
        token,
        body: payload,
    })
}

export async function cancelAppointment(
    appointmentId: string,
    token: string,
): Promise<void> {
    await apiRequest(`/api/clinic/appointment/${appointmentId}`, {
        method: 'DELETE',
        token,
    })
}
