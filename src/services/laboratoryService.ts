import { apiRequest } from '../utils/apiClient'
import type { LaboratoryResult } from '../types/api'

export async function getLaboratories(
    patientId: string,
    token: string,
): Promise<LaboratoryResult[]> {
    return apiRequest<LaboratoryResult[]>(`/api/clinic/laboratory/${patientId}`, {
        method: 'GET',
        token,
    })
}

export async function requestLaboratory(
    payload: { patientId: string; testType: string },
    token: string,
): Promise<void> {
    await apiRequest('/api/clinic/laboratory', {
        method: 'POST',
        token,
        body: payload,
    })
}
