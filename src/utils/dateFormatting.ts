const dateFormatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
})

export function formatDate(isoDate: string): string {
    const parsed = new Date(isoDate)
    if (Number.isNaN(parsed.getTime())) {
        return '-'
    }
    return dateFormatter.format(parsed)
}

export function formatDateTime(isoDate: string): string {
    const parsed = new Date(isoDate)
    if (Number.isNaN(parsed.getTime())) {
        return '-'
    }
    return dateTimeFormatter.format(parsed)
}

export function isFutureDate(isoDate: string): boolean {
    const parsed = new Date(isoDate)
    return parsed.getTime() > Date.now()
}

export function toDateInputValue(isoDate: string): string {
    const parsed = new Date(isoDate)
    if (Number.isNaN(parsed.getTime())) {
        return ''
    }
    return parsed.toISOString().slice(0, 10)
}
