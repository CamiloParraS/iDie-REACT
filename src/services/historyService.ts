import { apiRequest } from '../utils/apiClient'
import type { ClinicalHistory } from '../types/api'

export async function getHistory(
    patientId: string,
    token: string,
): Promise<ClinicalHistory> {
    return apiRequest<ClinicalHistory>(`/api/clinic/history/${patientId}`, {
        method: 'GET',
        token,
    })
}
