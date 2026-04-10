import { apiRequest } from '../utils/apiClient'
import type {
    LabResultResponse,
    RequestLabTestRequest,
    RequestLabTestResponse,
} from '../types/api'

export async function getLaboratories(
    patientId: string,
    token?: string,
): Promise<LabResultResponse[]> {
    return apiRequest<LabResultResponse[]>(`/api/clinic/laboratory/${patientId}`, {
        method: 'GET',
        token,
    })
}

export async function requestLaboratory(
    payload: RequestLabTestRequest,
    token?: string,
): Promise<RequestLabTestResponse> {
    return apiRequest<RequestLabTestResponse>('/api/clinic/laboratory', {
        method: 'POST',
        token,
        body: payload,
    })
}
