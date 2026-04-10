import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react'
import type { AuthSession, AuthUser, LoginRequest, RegisterPatientRequest } from '../types/api'
import { ApiClientError } from '../utils/apiClient'
import { registerPatient } from '../services/patientService'
import * as authService from '../services/authService'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null)
    const [user, setUser] = useState<AuthUser | null>(null)
    const [isBootstrapping, setIsBootstrapping] = useState(true)

    const applySession = useCallback((session: AuthSession | null) => {
        setToken(session?.token ?? null)
        setUser(session?.user ?? null)
    }, [])

    const validateToken = useCallback(async (): Promise<boolean> => {
        if (!token) {
            return false
        }

        try {
            const session = await authService.validate(token)
            applySession(session)
            return true
        } catch (error) {
            if (
                error instanceof ApiClientError &&
                (error.errorCode === 'INVALID_TOKEN' || error.status === 401)
            ) {
                applySession(null)
                return false
            }

            throw error
        }
    }, [applySession, token])

    useEffect(() => {
        let active = true

        const bootstrap = async () => {
            try {
                if (token) {
                    await validateToken()
                }
            } finally {
                if (active) {
                    setIsBootstrapping(false)
                }
            }
        }

        void bootstrap()

        return () => {
            active = false
        }
    }, [token, validateToken])

    useEffect(() => {
        if (!token) {
            return
        }

        const intervalId = window.setInterval(() => {
            void validateToken()
        }, 60_000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [token, validateToken])

    const login = useCallback(
        async (credentials: LoginRequest) => {
            const session = await authService.login(credentials)
            applySession(session)
            return session.user
        },
        [applySession],
    )

    const register = useCallback(
        async (payload: RegisterPatientRequest): Promise<boolean> => {
            const response = await registerPatient(payload)
            const session = authService.sessionFromRegister(response)

            if (session) {
                applySession(session)
                return true
            }

            return false
        },
        [applySession],
    )

    const logout = useCallback(async () => {
        try {
            if (token) {
                await authService.logout(token)
            }
        } finally {
            applySession(null)
        }
    }, [applySession, token])

    const value = useMemo<AuthContextValue>(
        () => ({
            token,
            user,
            isAuthenticated: Boolean(token && user),
            isBootstrapping,
            login,
            register,
            logout,
            validateToken,
        }),
        [isBootstrapping, login, logout, register, token, user, validateToken],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
