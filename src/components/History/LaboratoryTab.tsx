import { useMemo } from 'react'
import type { LaboratoryResult } from '../../types/api'
import { LAB_STATUS } from '../../utils/constants'
import { formatDateTime } from '../../utils/dateFormatting'

interface LaboratoryTabProps {
    results: LaboratoryResult[]
}

function rangeClass(result: LaboratoryResult): string {
    if (result.value === null || result.referenceMin === null || result.referenceMax === null) {
        return 'border-blue-200 bg-blue-50 text-blue-700'
    }

    return result.value >= result.referenceMin && result.value <= result.referenceMax
        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
        : 'border-orange-300 bg-orange-50 text-orange-700'
}

function rangeLabel(result: LaboratoryResult): string {
    if (result.value === null) {
        return 'Pendiente'
    }

    if (result.referenceMin === null || result.referenceMax === null) {
        return 'Sin rango'
    }

    return `${result.referenceMin} - ${result.referenceMax}`
}

export default function LaboratoryTab({ results }: LaboratoryTabProps) {
    const sortedResults = useMemo(
        () =>
            [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [results],
    )

    return (
        <div className="overflow-x-auto border border-slate-200 bg-white">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold">Fecha</th>
                        <th className="px-3 py-2 text-left font-semibold">Tipo de prueba</th>
                        <th className="px-3 py-2 text-left font-semibold">Valor</th>
                        <th className="px-3 py-2 text-left font-semibold">Rango de referencia</th>
                        <th className="px-3 py-2 text-left font-semibold">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedResults.map((result) => (
                        <tr key={result.id} className="border-t border-slate-200">
                            <td className="px-3 py-2">{formatDateTime(result.date)}</td>
                            <td className="px-3 py-2">{result.testType}</td>
                            <td className="px-3 py-2">{result.value === null ? 'Pendiente' : result.value}</td>
                            <td className="px-3 py-2">
                                <span className={`border px-2 py-1 text-xs font-semibold ${rangeClass(result)}`}>
                                    {rangeLabel(result)}
                                </span>
                            </td>
                            <td className="px-3 py-2">{LAB_STATUS[result.status]}</td>
                        </tr>
                    ))}
                    {sortedResults.length === 0 && (
                        <tr>
                            <td className="px-3 py-3 text-slate-600" colSpan={5}>
                                No hay resultados de laboratorio disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
