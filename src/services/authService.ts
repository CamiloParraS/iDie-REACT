import { apiRequest, ApiClientError } from '../utils/apiClient'
import type {
    AuthRole,
    AuthSession,
    AuthUser,
    LoginRequest,
    RegisterPatientResponse,
} from '../types/api'

interface AuthResponse {
    token?: string
    role?: string
    patientId?: string
    user?: Partial<AuthUser>
    id?: string
    username?: string
    firstName?: string
    lastName?: string
    email?: string
}

function parseRole(role: string | undefined): AuthRole {
    const normalized = role?.toUpperCase() || 'UNKNOWN'
    if (normalized === 'PATIENT' || normalized === 'DOCTOR' || normalized === 'ADMIN') {
        return normalized
    }
    return 'UNKNOWN'
}

function normalizeUser(payload: AuthResponse): AuthUser {
    const sourceUser = payload.user
    return {
        id: sourceUser?.id || payload.id || payload.patientId || payload.username || payload.email || 'desconocido',
        username: sourceUser?.username || payload.username || sourceUser?.email || payload.email || 'paciente',
        role: parseRole(sourceUser?.role || payload.role),
        patientId: sourceUser?.patientId || payload.patientId,
        firstName: sourceUser?.firstName || payload.firstName,
        lastName: sourceUser?.lastName || payload.lastName,
        email: sourceUser?.email || payload.email,
    }
}

function toSession(payload: AuthResponse): AuthSession {
    if (!payload.token) {
        throw new ApiClientError({
            message: 'El servidor no retorno un token de sesion.',
        })
    }

    return {
        token: payload.token,
        user: normalizeUser(payload),
    }
}

export async function login(credentials: LoginRequest): Promise<AuthSession> {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials,
    })

    return toSession(response)
}

export async function validate(token: string): Promise<AuthSession> {
    const response = await apiRequest<AuthResponse>('/api/auth/validate', {
        method: 'GET',
        token,
    })

    if (!response.token) {
        response.token = token
    }

    return toSession(response)
}

export async function logout(token: string): Promise<void> {
    await apiRequest('/api/auth/logout', {
        method: 'POST',
        token,
    })
}

export function sessionFromRegister(
    payload: RegisterPatientResponse,
): AuthSession | null {
    if (!payload.token) {
        return null
    }

    return toSession({
        token: payload.token,
        patientId: payload.patientId,
        user: payload.user,
        email: payload.user?.email,
        username: payload.user?.username || payload.user?.email,
    })
}
