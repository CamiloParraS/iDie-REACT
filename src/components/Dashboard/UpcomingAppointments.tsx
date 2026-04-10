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
                const isFuture = isFutureDate(appointment.appointmentDate)
                const canCancel = appointment.status === 'SCHEDULED' && isFuture

                return (
                    <article key={appointment.appointmentId} className="idie-card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h4 className="text-base font-bold text-blue-900">{appointment.specialty}</h4>
                                <p className="text-sm text-slate-700">Dr. {appointment.doctorName}</p>
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={[
                                        'border px-2 py-1 text-xs font-semibold',
                                        isFuture
                                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                            : 'border-amber-300 bg-amber-50 text-amber-700',
                                    ].join(' ')}
                                >
                                    {isFuture ? 'Proxima' : 'Historica'}
                                </span>
                                <span className="border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800">
                                    {APPOINTMENT_STATUS[appointment.status] || appointment.status}
                                </span>
                            </div>
                        </div>

                        <p className="mt-3 text-sm text-slate-800">{formatDateTime(appointment.appointmentDate)}</p>

                        {canCancel && (
                            <button
                                type="button"
                                className="mt-3 border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-100"
                                onClick={async () => {
                                    const accepted = window.confirm(
                                        'Vas a cancelar esta cita. Deseas continuar?',
                                    )

                                    if (accepted) {
                                        await onCancelAppointment(appointment.appointmentId)
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
