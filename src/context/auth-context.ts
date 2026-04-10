import { createContext } from 'react'
import type { AuthUser, LoginRequest, RegisterFlowRequest } from '../types/api'

export interface AuthContextValue {
    token: string | null
    user: AuthUser | null
    isAuthenticated: boolean
    isBootstrapping: boolean
    login: (credentials: LoginRequest) => Promise<AuthUser>
    register: (payload: RegisterFlowRequest) => Promise<boolean>
    logout: () => Promise<void>
    validateToken: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
