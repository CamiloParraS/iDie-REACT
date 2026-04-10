import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ApiClientError } from '../../utils/apiClient'
import { ERROR_MESSAGES, getRouteByRole } from '../../utils/constants'

interface LoginFormState {
    username: string
    password: string
}

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    const [form, setForm] = useState<LoginFormState>({ username: '', password: '' })
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fromPath =
        typeof location.state === 'object' &&
            location.state !== null &&
            'from' in location.state &&
            typeof location.state.from === 'string'
            ? location.state.from
            : null

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        if (!form.username.trim() || !form.password.trim()) {
            setError('Completa usuario y contrasena para continuar.')
            return
        }

        setIsSubmitting(true)

        try {
            const loggedUser = await login({
                email: form.username.trim(),
                password: form.password,
            })
            navigate(fromPath ?? getRouteByRole(loggedUser.role), { replace: true })
        } catch (caught) {
            if (caught instanceof ApiClientError) {
                setError(
                    (caught.errorCode && ERROR_MESSAGES[caught.errorCode]) ||
                    caught.message ||
                    'No fue posible iniciar sesion.',
                )
            } else {
                setError('No fue posible iniciar sesion.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto mt-8 w-full max-w-lg idie-fade-in sm:mt-16">
            <div className="idie-card p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-blue-900">Iniciar sesion</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Ingresa con tus credenciales para acceder a tu informacion clinica.
                </p>

                <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Usuario
                        <input
                            className="idie-input"
                            type="text"
                            value={form.username}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, username: event.target.value }))
                            }
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Contrasena
                        <input
                            className="idie-input"
                            type="password"
                            value={form.password}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, password: event.target.value }))
                            }
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {error && (
                        <div className="idie-alert idie-alert-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="idie-btn-primary mt-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Validando...' : 'Entrar'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-700">
                    No tienes cuenta?{' '}
                    <Link className="idie-link" to="/registro">
                        Registrate aqui
                    </Link>
                </p>
            </div>
        </div>
    )
}
