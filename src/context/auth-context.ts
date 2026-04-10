import { createContext } from 'react'
import type { AuthUser, LoginRequest, RegisterPatientRequest } from '../types/api'

export interface AuthContextValue {
    token: string | null
    user: AuthUser | null
    isAuthenticated: boolean
    isBootstrapping: boolean
    login: (credentials: LoginRequest) => Promise<AuthUser>
    register: (payload: RegisterPatientRequest) => Promise<boolean>
    logout: () => Promise<void>
    validateToken: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
