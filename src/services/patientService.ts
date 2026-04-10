import { apiRequest } from '../utils/apiClient'
import type {
    Patient,
    RegisterPatientRequest,
    RegisterPatientResponse,
} from '../types/api'

export async function registerPatient(
    payload: RegisterPatientRequest,
): Promise<RegisterPatientResponse> {
    return apiRequest<RegisterPatientResponse>('/api/clinic/patient', {
        method: 'POST',
        body: payload,
    })
}

export async function getPatientById(
    patientId: string,
    token: string,
): Promise<Patient> {
    return apiRequest<Patient>(`/api/clinic/patient/${patientId}`, {
        method: 'GET',
        token,
    })
}
