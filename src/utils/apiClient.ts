import {
    API_BASE_URL,
    ERROR_MESSAGES,
    REQUEST_RETRIES,
    REQUEST_TIMEOUT_MS,
} from './constants'
import type { ApiEnvelope, BackendErrorCode } from '../types/api'

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
    token?: string
    body?: unknown
    timeoutMs?: number
    retries?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

export class ApiClientError extends Error {
    status: number
    errorCode?: BackendErrorCode

    constructor(params: {
        message: string
        status?: number
        errorCode?: BackendErrorCode
    }) {
        super(params.message)
        this.name = 'ApiClientError'
        this.status = params.status ?? 0
        this.errorCode = params.errorCode
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms)
    })
}

function shouldRetry(error: unknown): boolean {
    if (error instanceof ApiClientError) {
        return error.status >= 500
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
        return true
    }

    return error instanceof TypeError
}

function parseEnvelope<T>(payload: unknown): ApiEnvelope<T> | null {
    if (!isRecord(payload)) {
        return null
    }

    if (typeof payload.success !== 'boolean') {
        return null
    }

    const maybeData = payload.data as T | undefined
    const maybeErrorCode = payload.errorCode as BackendErrorCode | undefined
    const maybeMessage = payload.message
    const maybeTimestamp = payload.timestamp

    return {
        success: payload.success,
        data: maybeData,
        errorCode: maybeErrorCode,
        message: typeof maybeMessage === 'string' ? maybeMessage : '',
        timestamp:
            typeof maybeTimestamp === 'string'
                ? maybeTimestamp
                : new Date().toISOString(),
    }
}

export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const {
        token,
        body,
        retries = REQUEST_RETRIES,
        timeoutMs = REQUEST_TIMEOUT_MS,
        headers,
        ...restOptions
    } = options

    const mergedHeaders = new Headers(headers)
    mergedHeaders.set('Content-Type', 'application/json')

    if (token) {
        mergedHeaders.set('Authorization', `Bearer ${token}`)
    }

    const serializedBody = body === undefined ? undefined : JSON.stringify(body)

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            const controller = new AbortController()
            const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

            const response = await fetch(`${API_BASE_URL}${path}`, {
                ...restOptions,
                headers: mergedHeaders,
                body: serializedBody,
                signal: controller.signal,
            })

            window.clearTimeout(timeoutId)

            const rawResponse: unknown = await response
                .json()
                .catch(() => ({ message: 'Respuesta no valida del servidor.' }))
            const envelope = parseEnvelope<T>(rawResponse)

            if (!response.ok || envelope?.success === false || envelope?.errorCode) {
                const errorCode = envelope?.errorCode
                const errorMessage =
                    envelope?.message ||
                    (errorCode ? ERROR_MESSAGES[errorCode] : undefined) ||
                    `Error HTTP ${response.status}`

                throw new ApiClientError({
                    message: errorMessage,
                    status: response.status,
                    errorCode,
                })
            }

            if (envelope && envelope.data !== undefined) {
                return envelope.data
            }

            return rawResponse as T
        } catch (error) {
            const canRetry = attempt < retries && shouldRetry(error)

            if (canRetry) {
                await sleep(250 * (attempt + 1))
                continue
            }

            if (error instanceof ApiClientError) {
                throw error
            }

            throw new ApiClientError({
                message: 'No fue posible conectar con el servidor.',
            })
        }
    }

    throw new ApiClientError({
        message: 'No fue posible completar la solicitud.',
    })
}
