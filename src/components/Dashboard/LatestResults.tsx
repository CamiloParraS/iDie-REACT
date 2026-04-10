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
                                    'idie-badge',
                                    state === 'normal'
                                        ? 'idie-badge-success'
                                        : state === 'out'
                                            ? 'idie-badge-warn'
                                            : 'idie-badge-info',
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
