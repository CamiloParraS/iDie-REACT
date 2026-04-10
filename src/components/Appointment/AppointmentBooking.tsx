import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SpecialtySelector from './SpecialtySelector'
import { useAuth } from '../../hooks/useAuth'
import { SPECIALTIES, ERROR_MESSAGES } from '../../utils/constants'
import { formatDateTime, isFutureDate } from '../../utils/dateFormatting'
import { ApiClientError } from '../../utils/apiClient'
import * as appointmentService from '../../services/appointmentService'
import type { CreateAppointmentResponse, Doctor } from '../../types/api'

type Step = 1 | 2 | 3

export default function AppointmentBooking() {
    const navigate = useNavigate()
    const { token, user } = useAuth()

    const [step, setStep] = useState<Step>(1)
    const [specialtyKey, setSpecialtyKey] = useState<keyof typeof SPECIALTIES | ''>('')
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [selectedDoctorId, setSelectedDoctorId] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [confirmation, setConfirmation] = useState<CreateAppointmentResponse | null>(null)

    const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId)

    const availableSlots = useMemo(
        () =>
            (selectedDoctor?.availableSlots || [])
                .filter((slot) => isFutureDate(slot))
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
        [selectedDoctor],
    )

    const onSelectSpecialty = async (nextSpecialty: keyof typeof SPECIALTIES) => {
        if (!token) {
            setError('Tu sesion no es valida. Inicia sesion nuevamente.')
            return
        }

        setSpecialtyKey(nextSpecialty)
        setSelectedDoctorId('')
        setSelectedSlot('')
        setDoctors([])
        setConfirmation(null)
        setError(null)
        setIsLoadingDoctors(true)

        try {
            const doctorsResponse = await appointmentService.getDoctorsBySpecialty(
                nextSpecialty.toUpperCase(),
                token,
            )

            setDoctors(doctorsResponse)
            setStep(2)

            if (doctorsResponse.length === 0) {
                setError(ERROR_MESSAGES.NO_AVAILABLE_DOCTOR)
            }
        } catch (caught) {
            if (caught instanceof ApiClientError) {
                setError(
                    (caught.errorCode && ERROR_MESSAGES[caught.errorCode]) || caught.message,
                )
            } else {
                setError('No fue posible consultar los medicos disponibles.')
            }
        } finally {
            setIsLoadingDoctors(false)
        }
    }

    const goToConfirmation = () => {
        setError(null)

        if (!selectedDoctorId || !selectedSlot) {
            setError('Selecciona un medico y un horario para continuar.')
            return
        }

        if (!isFutureDate(selectedSlot)) {
            setError('Debes escoger un horario en el futuro.')
            return
        }

        setStep(3)
    }

    const onConfirmAppointment = async () => {
        if (!token || !user?.patientId || !selectedDoctor || !specialtyKey || !selectedSlot) {
            setError('No hay informacion suficiente para confirmar la cita.')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await appointmentService.createAppointment(
                {
                    patientId: user.patientId,
                    doctorId: selectedDoctor.id,
                    specialty: specialtyKey.toUpperCase(),
                    scheduledAt: selectedSlot,
                },
                token,
            )

            setConfirmation(response)
        } catch (caught) {
            if (caught instanceof ApiClientError) {
                setError(
                    (caught.errorCode && ERROR_MESSAGES[caught.errorCode]) || caught.message,
                )
            } else {
                setError('No fue posible registrar la cita.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="idie-card grid gap-6 p-6 idie-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-blue-900">Agendamiento de citas</h2>
                <p className="mt-1 text-sm text-slate-600">
                    Completa los 3 pasos para programar una nueva consulta medica.
                </p>
            </div>

            <div className="grid gap-2 sm:flex sm:items-center">
                {[1, 2, 3].map((current) => (
                    <div
                        key={current}
                        className={[
                            'border px-3 py-2 text-xs font-bold uppercase tracking-wide',
                            current === step
                                ? 'border-blue-800 bg-blue-800 text-white'
                                : 'border-blue-200 bg-blue-50 text-blue-700',
                        ].join(' ')}
                    >
                        Paso {current}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <div className="grid gap-3">
                    <SpecialtySelector value={specialtyKey} onChange={onSelectSpecialty} />
                    <p className="text-xs text-slate-500">
                        Especialidades disponibles: Cardiologia, Dermatologia, Pediatria, Neurologia y Oftalmologia.
                    </p>
                    {isLoadingDoctors && <p className="text-sm text-blue-700">Consultando medicos disponibles...</p>}
                </div>
            )}

            {step === 2 && (
                <div className="grid gap-4">
                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Medico disponible
                        <select
                            className="idie-input"
                            value={selectedDoctorId}
                            onChange={(event) => {
                                setSelectedDoctorId(event.target.value)
                                setSelectedSlot('')
                            }}
                        >
                            <option value="">Selecciona un medico</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    Dr. {doctor.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="grid gap-1 text-sm font-semibold text-slate-700">
                        Horario disponible
                        <select
                            className="idie-input"
                            value={selectedSlot}
                            onChange={(event) => setSelectedSlot(event.target.value)}
                            disabled={!selectedDoctorId}
                        >
                            <option value="">Selecciona un horario</option>
                            {availableSlots.map((slot) => (
                                <option key={slot} value={slot}>
                                    {formatDateTime(slot)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="idie-btn-secondary text-sm"
                            onClick={() => setStep(1)}
                        >
                            Volver
                        </button>
                        <button
                            type="button"
                            className="idie-btn-primary text-sm"
                            onClick={goToConfirmation}
                        >
                            Continuar a confirmacion
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="grid gap-4">
                    <div className="border border-blue-200 bg-blue-50 p-4 text-sm text-slate-800">
                        <p>
                            <strong>Especialidad:</strong> {specialtyKey ? SPECIALTIES[specialtyKey] : '-'}
                        </p>
                        <p>
                            <strong>Medico:</strong> {selectedDoctor ? `Dr. ${selectedDoctor.name}` : '-'}
                        </p>
                        <p>
                            <strong>Fecha y hora:</strong> {selectedSlot ? formatDateTime(selectedSlot) : '-'}
                        </p>
                    </div>

                    {!confirmation ? (
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                className="idie-btn-secondary text-sm"
                                onClick={() => setStep(2)}
                            >
                                Volver
                            </button>
                            <button
                                type="button"
                                className="idie-btn-primary text-sm"
                                onClick={onConfirmAppointment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Confirmando...' : 'Confirmar cita'}
                            </button>
                        </div>
                    ) : (
                        <div className="idie-alert idie-alert-success grid gap-3 p-4 text-sm">
                            <p className="font-semibold">Cita programada correctamente.</p>
                            <p>
                                <strong>ID:</strong> {confirmation.appointment.id}
                            </p>
                            <p>
                                <strong>Recordatorio:</strong>{' '}
                                {confirmation.reminder || 'Se enviara recordatorio por los canales disponibles.'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="idie-btn-primary text-sm"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Ir al dashboard
                                </button>
                                <Link
                                    className="idie-btn-secondary text-sm"
                                    to="/historia"
                                >
                                    Ver historia clinica
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="idie-alert idie-alert-error">{error}</div>
            )}
        </section>
    )
}
