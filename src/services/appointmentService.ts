import { apiRequest } from '../utils/apiClient'
import type {
    CancelAppointmentResponse,
    DoctorResponse,
    ScheduleAppointmentRequest,
    ScheduleAppointmentResponse,
    Specialty,
} from '../types/api'

export async function getDoctorsBySpecialty(
    specialty: Specialty,
    token?: string,
): Promise<DoctorResponse[]> {
    return apiRequest<DoctorResponse[]>(
        `/api/clinic/doctors?specialty=${encodeURIComponent(specialty)}`,
        {
            method: 'GET',
            token,
        },
    )
}

export async function createAppointment(
    payload: ScheduleAppointmentRequest,
    token?: string,
): Promise<ScheduleAppointmentResponse> {
    return apiRequest<ScheduleAppointmentResponse>('/api/clinic/appointment', {
        method: 'POST',
        token,
        body: payload,
    })
}

export async function cancelAppointment(
    appointmentId: string,
    token?: string,
): Promise<CancelAppointmentResponse> {
    return apiRequest<CancelAppointmentResponse>(`/api/clinic/appointment/${appointmentId}`, {
        method: 'DELETE',
        token,
    })
}
