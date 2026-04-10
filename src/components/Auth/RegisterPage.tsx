import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ApiClientError } from '../../utils/apiClient'
import { ERROR_MESSAGES } from '../../utils/constants'
import type { RegisterPatientRequest } from '../../types/api'

const DOCUMENT_TYPES = ['CC', 'TI', 'PASAPORTE']

interface RegisterFormState {
    firstName: string
    lastName: string
    documentType: string
    documentNumber: string
    email: string
    phone: string
    birthDate: string
}

const initialForm: RegisterFormState = {
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    email: '',
    phone: '',
    birthDate: '',
}

function validate(form: RegisterFormState): Partial<Record<keyof RegisterFormState, string>> {
    const errors: Partial<Record<keyof RegisterFormState, string>> = {}

    if (!form.firstName.trim()) errors.firstName = 'El nombre es obligatorio.'
    if (!form.lastName.trim()) errors.lastName = 'El apellido es obligatorio.'
    if (!form.documentType.trim()) errors.documentType = 'Selecciona el tipo de documento.'
    if (!form.documentNumber.trim()) errors.documentNumber = 'El documento es obligatorio.'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email.trim())) {
        errors.email = 'Ingresa un email valido.'
    }

    if (!form.phone.trim()) errors.phone = 'El telefono es obligatorio.'
    if (!form.birthDate.trim()) errors.birthDate = 'La fecha de nacimiento es obligatoria.'

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

        const payload: RegisterPatientRequest = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            documentType: form.documentType.toUpperCase(),
            documentNumber: form.documentNumber.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            birthDate: form.birthDate,
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
                            className="idie-input px-3 py-2"
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
                            className="idie-input px-3 py-2"
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
                            className="idie-input px-3 py-2"
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
                            className="idie-input px-3 py-2"
                            value={form.documentNumber}
                            onChange={(event) =>
                                setForm((prev) => ({ ...prev, documentNumber: event.target.value }))
                            }
                        />
                        {fieldErrors.documentNumber && (
                            <span className="text-xs text-red-700">{fieldErrors.documentNumber}</span>
                        )}
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Email *
                        <input
                            className="idie-input px-3 py-2"
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
                            className="idie-input px-3 py-2"
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
                            className="idie-input px-3 py-2"
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

                    {serverError && (
                        <div className="md:col-span-2 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="idie-btn-primary md:col-span-2 px-4 py-2 font-semibold disabled:opacity-60"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-700">
                    Ya tienes cuenta?{' '}
                    <Link className="font-semibold text-blue-700 underline" to="/login">
                        Inicia sesion
                    </Link>
                </p>
            </div>
        </div>
    )
}
