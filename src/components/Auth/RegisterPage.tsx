import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ApiClientError } from '../../utils/apiClient'
import { ERROR_MESSAGES } from '../../utils/constants'
import type { RegisterFlowRequest } from '../../types/api'

const DOCUMENT_TYPES = ['CC', 'TI', 'PASAPORTE']

interface RegisterFormState {
    firstName: string
    lastName: string
    documentType: string
    document: string
    email: string
    phone: string
    birthDate: string
    password: string
}

const initialForm: RegisterFormState = {
    firstName: '',
    lastName: '',
    documentType: 'CC',
    document: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
}

function validate(form: RegisterFormState): Partial<Record<keyof RegisterFormState, string>> {
    const errors: Partial<Record<keyof RegisterFormState, string>> = {}

    if (!form.firstName.trim()) errors.firstName = 'El nombre es obligatorio.'
    if (!form.lastName.trim()) errors.lastName = 'El apellido es obligatorio.'
    if (!form.documentType.trim()) errors.documentType = 'Selecciona el tipo de documento.'
    if (!form.document.trim()) errors.document = 'El documento es obligatorio.'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
        errors.email = 'Ingresa un email valido.'
    }

    if (!form.phone.trim()) errors.phone = 'El telefono es obligatorio.'
    if (!form.birthDate.trim()) errors.birthDate = 'La fecha de nacimiento es obligatoria.'
    if (!form.password.trim()) errors.password = 'La contrasena es obligatoria.'

    return errors
}

export default function RegisterPage() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [form, setForm] = useState<RegisterFormState>(initialForm)
    const [serverError, setServerError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fieldErrors = useMemo(() => validate(form), [form])

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setServerError(null)

        const errors = validate(form)
        if (Object.keys(errors).length > 0) {
            setServerError('Corrige los campos del formulario para continuar.')
            return
        }

        const payload: RegisterFlowRequest = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            documentType: form.documentType.toUpperCase(),
            document: form.document.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            birthDate: form.birthDate,
            password: form.password,
        }

        setIsSubmitting(true)

        try {
            const hasSession = await register(payload)

            if (hasSession) {
                navigate('/dashboard', { replace: true })
            } else {
                navigate('/login', {
                    replace: true,
                    state: {
                        message:
                            'Registro exitoso. Inicia sesion con tus credenciales para continuar.',
                    },
                })
            }
        } catch (caught) {
            if (caught instanceof ApiClientError) {
                setServerError(
                    (caught.errorCode && ERROR_MESSAGES[caught.errorCode]) || caught.message,
                )
            } else {
                setServerError('No fue posible completar el registro.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto mt-6 w-full max-w-2xl idie-fade-in sm:mt-10">
            <div className="idie-card p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-blue-900">Registro de paciente</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Completa tus datos personales para crear tu cuenta en iDie.
                </p>

                <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit} noValidate>
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Nombres *
                        <input
                            className="idie-input"
                            value={form.firstName}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, firstName: event.target.value }))
                            }
                        />
                        {fieldErrors.firstName && <span className="text-xs text-red-700">{fieldErrors.firstName}</span>}
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Apellidos *
                        <input
                            className="idie-input"
                            value={form.lastName}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, lastName: event.target.value }))
                            }
                        />
                        {fieldErrors.lastName && <span className="text-xs text-red-700">{fieldErrors.lastName}</span>}
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Tipo de documento *
                        <select
                            className="idie-input"
                            value={form.documentType}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, documentType: event.target.value }))
                            }
                        >
                            {DOCUMENT_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Numero de documento *
                        <input
                            className="idie-input"
                            value={form.document}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, document: event.target.value }))
                            }
                        />
                        {fieldErrors.document && (
                            <span className="text-xs text-red-700">{fieldErrors.document}</span>
                        )}
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Email *
                        <input
                            className="idie-input"
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, email: event.target.value }))
                            }
                        />
                        {fieldErrors.email && <span className="text-xs text-red-700">{fieldErrors.email}</span>}
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Telefono *
                        <input
                            className="idie-input"
                            value={form.phone}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, phone: event.target.value }))
                            }
                        />
                        {fieldErrors.phone && <span className="text-xs text-red-700">{fieldErrors.phone}</span>}
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">
                        Fecha de nacimiento *
                        <input
                            className="idie-input"
                            type="date"
                            value={form.birthDate}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, birthDate: event.target.value }))
                            }
                        />
                        {fieldErrors.birthDate && (
                            <span className="text-xs text-red-700">{fieldErrors.birthDate}</span>
                        )}
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700 md:col-span-2">
                        Contrasena *
                        <input
                            className="idie-input"
                            type="password"
                            value={form.password}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, password: event.target.value }))
                            }
                            autoComplete="new-password"
                        />
                        {fieldErrors.password && (
                            <span className="text-xs text-red-700">{fieldErrors.password}</span>
                        )}
                    </label>

                    {serverError && (
                        <div className="idie-alert idie-alert-error md:col-span-2">
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="idie-btn-primary md:col-span-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-700">
                    Ya tienes cuenta?{' '}
                    <Link className="idie-link" to="/login">
                        Inicia sesion
                    </Link>
                </p>
            </div>
        </div>
    )
}
