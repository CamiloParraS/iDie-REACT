import { useMemo } from 'react'
import type { LaboratoryResult } from '../../types/api'
import { LAB_STATUS } from '../../utils/constants'
import { formatDateTime } from '../../utils/dateFormatting'

interface LaboratoryTabProps {
    results: LaboratoryResult[]
}

function rangeClass(result: LaboratoryResult): string {
    if (result.value === null || result.referenceMin === null || result.referenceMax === null) {
        return 'idie-badge-info'
    }

    return result.value >= result.referenceMin && result.value <= result.referenceMax
        ? 'idie-badge-success'
        : 'idie-badge-warn'
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
        <div className="idie-table-wrap">
            <table className="idie-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo de prueba</th>
                        <th>Valor</th>
                        <th>Rango de referencia</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedResults.map((result) => (
                        <tr key={result.id} className="border-t border-slate-200">
                            <td className="px-3 py-2">{formatDateTime(result.date)}</td>
                            <td className="px-3 py-2">{result.testType}</td>
                            <td className="px-3 py-2">{result.value === null ? 'Pendiente' : result.value}</td>
                            <td className="px-3 py-2">
                                <span className={`idie-badge ${rangeClass(result)}`}>
                                    {rangeLabel(result)}
                                </span>
                            </td>
                            <td className="px-3 py-2">{LAB_STATUS[result.status]}</td>
                        </tr>
                    ))}
                    {sortedResults.length === 0 && (
                        <tr>
                            <td className="idie-table-empty" colSpan={5}>
                                No hay resultados de laboratorio disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
