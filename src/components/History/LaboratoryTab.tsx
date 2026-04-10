import { useMemo } from 'react'
import type { LaboratoryResult } from '../../types/api'
import { LAB_STATUS } from '../../utils/constants'
import { formatDateTime } from '../../utils/dateFormatting'

interface LaboratoryTabProps {
    results: LaboratoryResult[]
}

function rangeClass(result: LaboratoryResult): string {
    if (result.resultValue === null) {
        return 'border-blue-200 bg-blue-50 text-blue-700'
    }

    return result.resultValue >= result.referenceMin && result.resultValue <= result.referenceMax
        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
        : 'border-orange-300 bg-orange-50 text-orange-700'
}

function rangeLabel(result: LaboratoryResult): string {
    if (result.resultValue === null) {
        return 'Pendiente'
    }

    return `${result.referenceMin} - ${result.referenceMax}`
}

export default function LaboratoryTab({ results }: LaboratoryTabProps) {
    const sortedResults = useMemo(
        () =>
            [...results].sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime()),
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
                            <td className="px-3 py-2">{formatDateTime(result.testDate)}</td>
                            <td className="px-3 py-2">{result.testName}</td>
                            <td className="px-3 py-2">{result.resultValue === null ? 'Pendiente' : result.resultValue}</td>
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
