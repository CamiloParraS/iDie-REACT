import { Fragment, useMemo, useState } from 'react'
import type { Prescription } from '../../types/api'
import { PRESCRIPTION_STATUS } from '../../utils/constants'
import { formatDate } from '../../utils/dateFormatting'

interface PrescriptionsTabProps {
    prescriptions: Prescription[]
}

export default function PrescriptionsTab({ prescriptions }: PrescriptionsTabProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const sortedPrescriptions = useMemo(
        () =>
            [...prescriptions].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            ),
        [prescriptions],
    )

    return (
        <div className="idie-table-wrap">
            <table className="idie-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Medicamentos</th>
                        <th>Duracion</th>
                        <th>Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPrescriptions.map((prescription) => (
                        <Fragment key={prescription.id}>
                            <tr className="border-t border-slate-200">
                                <td className="px-3 py-2">{formatDate(prescription.date)}</td>
                                <td className="px-3 py-2">
                                    <span
                                        className={[
                                            'idie-badge',
                                            prescription.status === 'ACTIVE'
                                                ? 'idie-badge-success'
                                                : 'idie-badge-neutral',
                                        ].join(' ')}
                                    >
                                        {PRESCRIPTION_STATUS[prescription.status]}
                                    </span>
                                </td>
                                <td className="px-3 py-2">{prescription.medications.length}</td>
                                <td className="px-3 py-2">{prescription.duration}</td>
                                <td className="px-3 py-2">
                                    <button
                                        type="button"
                                        className="idie-btn-secondary idie-btn-secondary-compact"
                                        onClick={() =>
                                            setExpandedId((current) =>
                                                current === prescription.id ? null : prescription.id,
                                            )
                                        }
                                    >
                                        {expandedId === prescription.id ? 'Ocultar' : 'Ver mas'}
                                    </button>
                                </td>
                            </tr>
                            {expandedId === prescription.id && (
                                <tr className="border-t border-slate-100 bg-slate-50">
                                    <td className="px-3 py-3" colSpan={5}>
                                        <ul className="grid gap-2">
                                            {prescription.medications.map((medication) => (
                                                <li key={medication.id} className="border border-slate-200 bg-white p-2">
                                                    <p className="font-semibold text-slate-800">{medication.name}</p>
                                                    <p className="text-xs text-slate-700">
                                                        Dosis: {medication.dose} | Frecuencia: {medication.frequency} | Duracion:{' '}
                                                        {medication.duration}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                        {prescription.allergyWarning && (
                                            <p className="idie-alert idie-alert-error mt-2 text-xs">
                                                Advertencia de alergia detectada para esta prescripcion.
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                    {sortedPrescriptions.length === 0 && (
                        <tr>
                            <td className="idie-table-empty" colSpan={5}>
                                No hay prescripciones registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
