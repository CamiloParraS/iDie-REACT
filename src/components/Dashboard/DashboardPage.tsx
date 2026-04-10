import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import UpcomingAppointments from './UpcomingAppointments'
import LatestResults from './LatestResults'
import { useAuth } from '../../hooks/useAuth'
import { ApiClientError } from '../../utils/apiClient'
import { ERROR_MESSAGES } from '../../utils/constants'
import * as historyService from '../../services/historyService'
import * as laboratoryService from '../../services/laboratoryService'
import * as appointmentService from '../../services/appointmentService'
import type { Appointment, LaboratoryResult } from '../../types/api'
import LoadingSpinner from '../Common/LoadingSpinner'

export default function DashboardPage() {
    const { token, user } = useAuth()
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [laboratories, setLaboratories] = useState<LaboratoryResult[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [notice, setNotice] = useState<string | null>(null)

    const patientName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Paciente'

    const loadDashboardData = useCallback(async () => {
        if (!token || !user?.patientId) {
            setLoading(false)
            setError('No fue posible identificar al paciente autenticado.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const [history, labs] = await Promise.all([
                historyService.getHistory(user.patientId, token),
                laboratoryService.getLaboratories(user.patientId, token),
            ])

            setAppointments(history.appointments || [])
            setLaboratories(labs.length > 0 ? labs : history.laboratories || [])
        } catch (caught) {
            if (caught instanceof ApiClientError) {
                setError(
                    (caught.errorCode && ERROR_MESSAGES[caught.errorCode]) || caught.message,
                )
            } else {
                setError('No fue posible cargar el dashboard.')
            }
        } finally {
            setLoading(false)
        }
    }, [token, user?.patientId])

    useEffect(() => {
        void loadDashboardData()
    }, [loadDashboardData])

    const sortedAppointments = useMemo(
        () =>
            [...appointments].sort(
                (a, b) =>
                    new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
            ),
        [appointments],
    )

    const latestResults = useMemo(
        () =>
            [...laboratories]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5),
        [laboratories],
    )

    const onCancelAppointment = async (appointmentId: string) => {
        if (!token) {
            return
        }

        try {
            await appointmentService.cancelAppointment(appointmentId, token)
            setAppointments((prev) =>
                prev.map((appointment) =>
                    appointment.id === appointmentId
                        ? { ...appointment, status: 'CANCELLED' }
                        : appointment,
                ),
            )
            setNotice('La cita fue cancelada exitosamente.')
        } catch (caught) {
            if (caught instanceof ApiClientError) {
                setError(
                    (caught.errorCode && ERROR_MESSAGES[caught.errorCode]) || caught.message,
                )
            } else {
                setError('No fue posible cancelar la cita.')
            }
        }
    }

    if (loading) {
        return (
            <div className="idie-card p-6">
                <LoadingSpinner label="Cargando tu panel clinico..." />
            </div>
        )
    }

    return (
        <section className="grid gap-6 idie-fade-in">
            <div className="idie-card border-l-4 border-l-blue-700 p-5">
                <h2 className="text-2xl font-bold text-blue-900">Bienvenido, {patientName}</h2>
                <p className="mt-1 text-sm text-slate-700">
                    Este es tu resumen rapido de citas y resultados medicos.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <Link className="idie-btn-primary text-sm" to="/citas/nueva">
                        Agendar nueva cita
                    </Link>
                    <Link
                        className="idie-btn-secondary text-sm"
                        to="/historia"
                    >
                        Ver historia clinica completa
                    </Link>
                </div>
            </div>

            {notice && (
                <div className="idie-alert idie-alert-success">
                    {notice}
                </div>
            )}

            {error && (
                <div className="idie-alert idie-alert-error">
                    {error}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="grid gap-3">
                    <h3 className="text-lg font-bold text-blue-900">Proximas citas</h3>
                    <UpcomingAppointments
                        appointments={sortedAppointments}
                        onCancelAppointment={onCancelAppointment}
                    />
                </section>

                <section className="grid gap-3">
                    <h3 className="text-lg font-bold text-blue-900">Ultimos resultados</h3>
                    <LatestResults results={latestResults} />
                    <div>
                        <Link className="idie-link text-sm" to="/historia">
                            Ir a historia clinica completa
                        </Link>
                    </div>
                </section>
            </div>
        </section>
    )
}
