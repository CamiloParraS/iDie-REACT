import { apiRequest, ApiClientError } from '../utils/apiClient'
import type {
    AuthRole,
    AuthSession,
    AuthUser,
    LoginPayload,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    ValidateResponse,
} from '../types/api'

const PATIENT_ID_MAP_STORAGE_KEY = 'clinic.auth.patient-id-map'

function normalizeEmail(email: string | undefined): string {
    return (email || '').trim().toLowerCase()
}

function readPatientIdMap(): Record<string, string> {
    try {
        const raw = window.localStorage.getItem(PATIENT_ID_MAP_STORAGE_KEY)
        if (!raw) {
            return {}
        }

        const parsed = JSON.parse(raw) as unknown
        if (!parsed || typeof parsed !== 'object') {
            return {}
        }

        const entries = Object.entries(parsed as Record<string, unknown>)
        return entries.reduce<Record<string, string>>((acc, [key, value]) => {
            if (typeof key === 'string' && typeof value === 'string' && key && value) {
                acc[key] = value
            }
            return acc
        }, {})
    } catch {
        return {}
    }
}

function writePatientIdMap(map: Record<string, string>): void {
    try {
        window.localStorage.setItem(PATIENT_ID_MAP_STORAGE_KEY, JSON.stringify(map))
    } catch {
        // Ignore storage write issues and continue with in-memory auth flow.
    }
}

function resolvePatientIdByEmail(email: string | undefined): string | undefined {
    const normalized = normalizeEmail(email)
    if (!normalized) {
        return undefined
    }

    const map = readPatientIdMap()
    return map[normalized]
}

export function linkPatientToEmail(email: string, patientId: string): void {
    const normalized = normalizeEmail(email)
    if (!normalized || !patientId) {
        return
    }

    const map = readPatientIdMap()
    map[normalized] = patientId
    writePatientIdMap(map)
}

function parseRole(role: string | undefined): AuthRole {
    const normalized = role?.toUpperCase() || 'UNKNOWN'
    if (normalized === 'ADMIN' || normalized === 'DOCTOR' || normalized === 'RECEPTIONIST') {
        return normalized
    }
    return 'UNKNOWN'
}

function normalizeUser(payload: {
    role?: string
    patientId?: string
    id?: string
    firstName?: string
    lastName?: string
    email?: string
}): AuthUser {
    const resolvedPatientId = payload.patientId || resolvePatientIdByEmail(payload.email)

    return {
        id: payload.id || resolvedPatientId || payload.email || 'unknown',
        username: payload.email || 'user',
        role: parseRole(payload.role),
        patientId: resolvedPatientId,
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
        user: normalizeUser({ email: payload.email, role: payload.role }),
    }
}

function toSessionFromRegister(payload: RegisterResponse): AuthSession {
    if (!payload.token) {
        throw new ApiClientError({
            message: 'El servidor no retorno un token de sesion.',
        })
    }

    return {
        token: payload.token,
        user: normalizeUser({ id: payload.id, email: payload.email, role: payload.role }),
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
        email: credentials.email,
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
        user: normalizeUser({ email: response.email, role: response.role }),
    }
}

export async function register(payload: RegisterRequest): Promise<AuthSession> {
    const response = await apiRequest<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: payload,
    })

    return toSessionFromRegister(response)
}

export async function logout(token: string): Promise<void> {
    await apiRequest('/api/auth/logout', {
        method: 'POST',
        token,
    })
}

export function sessionFromRegister(payload: RegisterResponse): AuthSession {
    return toSessionFromRegister(payload)
}
