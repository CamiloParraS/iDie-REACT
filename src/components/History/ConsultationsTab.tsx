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
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .filter((consultation) => {
                if (!normalized) {
                    return true
                }

                return [consultation.doctorName, consultation.diagnosis, consultation.notes]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalized)
            })
    }, [consultations, search])

    return (
        <section className="grid gap-3">
            <input
                className="idie-input max-w-md px-3 py-2 text-sm"
                placeholder="Buscar por medico, diagnostico o nota"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <div className="overflow-x-auto border border-slate-200 bg-white">
                <table className="min-w-full border-collapse text-sm">
                    <thead>
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold">Fecha</th>
                            <th className="px-3 py-2 text-left font-semibold">Medico</th>
                            <th className="px-3 py-2 text-left font-semibold">Diagnostico</th>
                            <th className="px-3 py-2 text-left font-semibold">Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredConsultations.map((consultation) => (
                            <Fragment key={consultation.id}>
                                <tr className="border-t border-slate-200">
                                    <td className="px-3 py-2">{formatDateTime(consultation.date)}</td>
                                    <td className="px-3 py-2">Dr. {consultation.doctorName}</td>
                                    <td className="px-3 py-2">{consultation.diagnosis}</td>
                                    <td className="px-3 py-2">
                                        <button
                                            type="button"
                                            className="border border-blue-300 bg-white px-2 py-1 text-xs font-semibold text-blue-700"
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
                                            <strong>Notas:</strong> {consultation.notes}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        {filteredConsultations.length === 0 && (
                            <tr>
                                <td className="px-3 py-3 text-slate-600" colSpan={4}>
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
