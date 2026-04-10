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
                (a, b) =>
                    new Date(b.prescriptionDate).getTime() -
                    new Date(a.prescriptionDate).getTime(),
            ),
        [prescriptions],
    )

    return (
        <div className="overflow-x-auto border border-slate-200 bg-white">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold">Fecha</th>
                        <th className="px-3 py-2 text-left font-semibold">Estado</th>
                        <th className="px-3 py-2 text-left font-semibold">Medicamentos</th>
                        <th className="px-3 py-2 text-left font-semibold">Duracion</th>
                        <th className="px-3 py-2 text-left font-semibold">Detalle</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPrescriptions.map((prescription) => (
                        <Fragment key={prescription.id}>
                            <tr className="border-t border-slate-200">
                                <td className="px-3 py-2">{formatDate(prescription.prescriptionDate)}</td>
                                <td className="px-3 py-2">
                                    <span
                                        className={[
                                            'border px-2 py-1 text-xs font-semibold',
                                            prescription.status === 'ACTIVE'
                                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                                : 'border-slate-300 bg-slate-100 text-slate-700',
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
                                        className="border border-blue-300 bg-white px-2 py-1 text-xs font-semibold text-blue-700"
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
                                                <li key={`${medication.name}-${medication.dosage}-${medication.frequency}`} className="border border-slate-200 bg-white p-2">
                                                    <p className="font-semibold text-slate-800">{medication.name}</p>
                                                    <p className="text-xs text-slate-700">
                                                        Dosis: {medication.dosage} | Frecuencia: {medication.frequency} | Duracion:{' '}
                                                        {medication.duration}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                        {prescription.allergyWarnings.length > 0 && (
                                            <p className="mt-2 border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                                                {prescription.allergyWarnings.join(' ')}
                                            </p>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                    {sortedPrescriptions.length === 0 && (
                        <tr>
                            <td className="px-3 py-3 text-slate-600" colSpan={5}>
                                No hay prescripciones registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
