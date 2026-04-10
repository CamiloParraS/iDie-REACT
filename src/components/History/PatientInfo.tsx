import type { Allergy, Patient } from '../../types/api'
import { formatDate } from '../../utils/dateFormatting'
import { SEVERITY } from '../../utils/constants'

interface PatientInfoProps {
    patient: Patient
    allergies: Allergy[]
}

export default function PatientInfo({ patient, allergies }: PatientInfoProps) {
    return (
        <section className="grid gap-6">
            <div className="idie-card grid gap-3 p-4 text-sm sm:grid-cols-2">
                <p>
                    <strong>Nombres:</strong> {patient.firstName}
                </p>
                <p>
                    <strong>Apellidos:</strong> {patient.lastName}
                </p>
                <p>
                    <strong>Documento:</strong> {patient.documentType} {patient.document}
                </p>
                <p>
                    <strong>Email:</strong> {patient.email}
                </p>
                <p>
                    <strong>Telefono:</strong> {patient.phone}
                </p>
                <p>
                    <strong>Fecha de nacimiento:</strong> {formatDate(patient.birthDate)}
                </p>
                <p className="sm:col-span-2">
                    <strong>Fecha de registro:</strong>{' '}
                    {patient.createdAt ? formatDate(patient.createdAt) : 'No disponible'}
                </p>
            </div>

            <div className="idie-card p-4">
                <h3 className="text-lg font-bold text-blue-900">Alergias</h3>
                {allergies.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-600">No se registran alergias para el paciente.</p>
                ) : (
                    <ul className="mt-3 grid gap-2">
                        {allergies.map((allergy) => {
                            const severityLabel = SEVERITY[allergy.severity]
                            const severityClass =
                                allergy.severity === 'HIGH'
                                    ? 'border-red-300 bg-red-50 text-red-700'
                                    : allergy.severity === 'MEDIUM'
                                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                                        : 'border-emerald-300 bg-emerald-50 text-emerald-700'

                            return (
                                <li
                                    key={allergy.id}
                                    className="flex flex-wrap items-center justify-between gap-2 border border-slate-200 p-3"
                                >
                                    <span className="font-semibold text-slate-800">{allergy.allergyName}</span>
                                    <span className={`border px-2 py-1 text-xs font-semibold ${severityClass}`}>
                                        Severidad {severityLabel}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </section>
    )
}
