import { useCallback, useState } from 'react'

export function useFetch<T>() {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const execute = useCallback(async (fetcher: () => Promise<T>) => {
        setLoading(true)
        setError(null)

        try {
            const result = await fetcher()
            setData(result)
            return result
        } catch (caught) {
            const message = caught instanceof Error ? caught.message : 'Error inesperado.'
            setError(message)
            throw caught
        } finally {
            setLoading(false)
        }
    }, [])

    return { data, loading, error, execute, setData }
}
