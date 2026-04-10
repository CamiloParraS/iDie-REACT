import { apiRequest } from '../utils/apiClient'
import type { CompleteHistoryResponse } from '../types/api'

export async function getHistory(
    patientId: string,
    token?: string,
): Promise<CompleteHistoryResponse> {
    return apiRequest<CompleteHistoryResponse>(`/api/clinic/history/${patientId}`, {
        method: 'GET',
        token,
    })
}
