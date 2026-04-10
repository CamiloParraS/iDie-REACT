import { APPOINTMENT_STATUS } from '../../utils/constants'
import { formatDateTime, isFutureDate } from '../../utils/dateFormatting'
import type { Appointment } from '../../types/api'

interface UpcomingAppointmentsProps {
    appointments: Appointment[]
    onCancelAppointment: (appointmentId: string) => Promise<void>
}

export default function UpcomingAppointments({
    appointments,
    onCancelAppointment,
}: UpcomingAppointmentsProps) {
    if (appointments.length === 0) {
        return (
            <div className="idie-card p-4 text-sm text-slate-600">
                No tienes citas registradas por el momento.
            </div>
        )
    }

    return (
        <div className="grid gap-3">
            {appointments.map((appointment) => {
                const isFuture = isFutureDate(appointment.scheduledAt)
                const canCancel = appointment.status === 'SCHEDULED' && isFuture

                return (
                    <article key={appointment.id} className="idie-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h4 className="text-base font-bold text-blue-900">{appointment.specialty}</h4>
                                <p className="text-sm text-slate-700">Dr. {appointment.doctorName}</p>
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={[
                                        'idie-badge',
                                        isFuture
                                            ? 'idie-badge-success'
                                            : 'idie-badge-warn',
                                    ].join(' ')}
                                >
                                    {isFuture ? 'Proxima' : 'Historica'}
                                </span>
                                <span className="idie-badge idie-badge-info">
                                    {APPOINTMENT_STATUS[appointment.status] || appointment.status}
                                </span>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-slate-800">{formatDateTime(appointment.scheduledAt)}</p>

                        {canCancel && (
                            <button
                                type="button"
                                className="idie-btn-danger idie-btn-danger-compact mt-3"
                                onClick={async () => {
                                    const accepted = window.confirm(
                                        'Vas a cancelar esta cita. Deseas continuar?',
                                    )

                                    if (accepted) {
                                        await onCancelAppointment(appointment.id)
                                    }
                                }}
                            >
                                Cancelar cita
                            </button>
                        )}
                    </article>
                )
            })}
        </div>
    )
}
