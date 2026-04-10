import { apiRequest, ApiClientError } from '../utils/apiClient'
import type {
    AuthRole,
    AuthSession,
    AuthUser,
    LoginPayload,
    LoginRequest,
    LoginResponse,
    RegisterPatientResponse,
    ValidateResponse,
} from '../types/api'

function parseRole(role: string | undefined): AuthRole {
    const normalized = role?.toUpperCase() || 'UNKNOWN'
    if (normalized === 'ADMIN' || normalized === 'DOCTOR' || normalized === 'RECEPTIONIST') {
        return normalized
    }
    return 'UNKNOWN'
}

function normalizeUser(payload: {
    username?: string
    role?: string
    patientId?: string
    id?: string
    firstName?: string
    lastName?: string
    email?: string
}): AuthUser {
    return {
        id: payload.id || payload.patientId || payload.username || payload.email || 'unknown',
        username: payload.username || payload.email || 'user',
        role: parseRole(payload.role),
        patientId: payload.patientId,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
    }
}

function toSession(payload: LoginResponse): AuthSession {
    if (!payload.token) {
        throw new ApiClientError({
            message: 'El servidor no retorno un token de sesion.',
        })
    }

    return {
        token: payload.token,
        user: normalizeUser({ username: payload.username, role: payload.role }),
    }
}

async function toSha256Hex(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashBytes = Array.from(new Uint8Array(hashBuffer))
    return hashBytes.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function login(credentials: LoginRequest): Promise<AuthSession> {
    const payload: LoginPayload = {
        username: credentials.username,
        passwordHash: await toSha256Hex(credentials.password),
    }

    const response = await apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: payload,
    })

    return toSession(response)
}

export async function validate(token: string): Promise<AuthSession> {
    const response = await apiRequest<ValidateResponse>('/api/auth/validate', {
        method: 'GET',
        token,
    })

    return {
        token,
        user: normalizeUser({ username: response.username, role: response.role }),
    }
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
    void payload
    return null
}
