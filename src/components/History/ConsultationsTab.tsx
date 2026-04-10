import { Fragment, useMemo, useState } from 'react'
import type { Consultation } from '../../types/api'
import { formatDateTime } from '../../utils/dateFormatting'

interface ConsultationsTabProps {
    consultations: Consultation[]
}

export default function ConsultationsTab({ consultations }: ConsultationsTabProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    const filteredConsultations = useMemo(() => {
        const normalized = search.trim().toLowerCase()

        return [...consultations]
            .sort(
                (a, b) =>
                    new Date(b.consultationDate).getTime() -
                    new Date(a.consultationDate).getTime(),
            )
            .filter((consultation) => {
                if (!normalized) {
                    return true
                }

                return [consultation.doctorName, consultation.diagnosis, consultation.notes || '']
                    .join(' ')
                    .toLowerCase()
                    .includes(normalized)
            })
    }, [consultations, search])

    return (
        <section className="grid gap-3">
            <input
                className="idie-input max-w-md text-sm"
                placeholder="Buscar por medico, diagnostico o nota"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <div className="idie-table-wrap">
                <table className="idie-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Medico</th>
                            <th>Diagnostico</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredConsultations.map((consultation) => (
                            <Fragment key={consultation.id}>
                                <tr className="border-t border-slate-200">
                                    <td className="px-3 py-2">{formatDateTime(consultation.consultationDate)}</td>
                                    <td className="px-3 py-2">Dr. {consultation.doctorName}</td>
                                    <td className="px-3 py-2">{consultation.diagnosis}</td>
                                    <td className="px-3 py-2">
                                        <button
                                            type="button"
                                            className="idie-btn-secondary idie-btn-secondary-compact"
                                            onClick={() =>
                                                setExpandedId((current) =>
                                                    current === consultation.id ? null : consultation.id,
                                                )
                                            }
                                        >
                                            {expandedId === consultation.id ? 'Ocultar' : 'Ver mas'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === consultation.id && (
                                    <tr className="border-t border-slate-100 bg-slate-50">
                                        <td className="px-3 py-3 text-slate-700" colSpan={4}>
                                            <strong>Notas:</strong> {consultation.notes || 'Sin notas'}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        {filteredConsultations.length === 0 && (
                            <tr>
                                <td className="idie-table-empty" colSpan={4}>
                                    No hay consultas para mostrar.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
