import type { LaboratoryResult } from '../../types/api'
import { formatDateTime } from '../../utils/dateFormatting'

function getRangeState(result: LaboratoryResult): 'pending' | 'normal' | 'out' {
    if (result.resultValue === null) {
        return 'pending'
    }

    return result.resultValue >= result.referenceMin && result.resultValue <= result.referenceMax
        ? 'normal'
        : 'out'
}

interface LatestResultsProps {
    results: LaboratoryResult[]
}

export default function LatestResults({ results }: LatestResultsProps) {
    if (results.length === 0) {
        return (
            <div className="idie-card p-4 text-sm text-slate-600">
                No hay resultados de laboratorio recientes.
            </div>
        )
    }

    return (
        <div className="grid gap-2">
            {results.map((result) => {
                const state = getRangeState(result)
                return (
                    <article key={result.id} className="idie-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-blue-900">{result.testName}</p>
                            <p className="text-xs text-slate-600">{formatDateTime(result.testDate)}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <span>
                                Valor:{' '}
                                {result.resultValue === null
                                    ? 'Pendiente'
                                    : `${result.resultValue} (${result.referenceMin}-${result.referenceMax})`}
                            </span>
                            <span
                                className={[
                                    'border px-2 py-1 text-xs',
                                    state === 'normal'
                                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                        : state === 'out'
                                            ? 'border-orange-300 bg-orange-50 text-orange-700'
                                            : 'border-blue-200 bg-blue-50 text-blue-700',
                                ].join(' ')}
                            >
                                {state === 'normal'
                                    ? 'Dentro de rango'
                                    : state === 'out'
                                        ? 'Fuera de rango'
                                        : 'Pendiente'}
                            </span>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}
