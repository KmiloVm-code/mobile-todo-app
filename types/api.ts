/**
 * Tipos relacionados con API y comunicación con el servidor
 */

/** Métodos HTTP */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** Headers HTTP */
export type HttpHeaders = Record<string, string>

/** Parámetros de query */
export type QueryParams = Record<string, string | number | boolean | undefined>

/** Configuración de petición HTTP */
export interface RequestConfig {
  method?: HttpMethod
  headers?: HttpHeaders
  params?: QueryParams
  body?: unknown
  timeout?: number
  retries?: number
  baseURL?: string
}

/** Respuesta HTTP base */
export interface HttpResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: HttpHeaders
}

/** Error de API */
export interface ApiError {
  message: string
  code?: string | number
  status?: number
  details?: Record<string, unknown>
  stack?: string
}

/** Respuesta de error de API */
export interface ApiErrorResponse {
  error: ApiError
  success: false
  timestamp: string
  path?: string
}

/** Cliente HTTP genérico */
export interface HttpClient {
  get<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>>
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>>
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>>
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<HttpResponse<T>>
  delete<T = unknown>(
    url: string,
    config?: RequestConfig
  ): Promise<HttpResponse<T>>
}

/** Interceptores de petición */
export interface RequestInterceptor {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  onRequestError?: (error: ApiError) => Promise<never>
}

/** Interceptores de respuesta */
export interface ResponseInterceptor {
  onResponse?: <T>(
    response: HttpResponse<T>
  ) => HttpResponse<T> | Promise<HttpResponse<T>>
  onResponseError?: (error: ApiError) => Promise<never>
}

/** Configuración de API */
export interface ApiConfig {
  baseURL: string
  timeout?: number
  retries?: number
  headers?: HttpHeaders
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
}

/** Endpoints de API */
export interface ApiEndpoints {
  auth: {
    login: string
    register: string
    logout: string
    refresh: string
    profile: string
  }
  tasks: {
    list: string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
    get: (id: string) => string
  }
  categories: {
    list: string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
  }
  tags: {
    list: string
    create: string
    update: (id: string) => string
    delete: (id: string) => string
  }
}

/** Estado de carga de API */
export interface ApiLoadingState {
  isLoading: boolean
  error: ApiError | null
  lastFetch?: Date
}

/** Cache de API */
export interface ApiCache<T = unknown> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

/** Configuración de cache */
export interface CacheConfig {
  ttl: number // Time to live en milisegundos
  maxSize: number
  enabled: boolean
}

/** Hook de API genérico */
export interface UseApiReturn<T = unknown> extends ApiLoadingState {
  data: T | null
  refetch: () => Promise<void>
  mutate: (newData: T) => void
  invalidate: () => void
}

/** Configuración de mutation */
export interface MutationConfig<TData = unknown, TVariables = unknown> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: ApiError, variables: TVariables) => void
  onSettled?: (
    data: TData | undefined,
    error: ApiError | null,
    variables: TVariables
  ) => void
}

/** Hook de mutation */
export interface UseMutationReturn<TData = unknown, TVariables = unknown> {
  mutate: (variables: TVariables) => Promise<TData>
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | undefined
  error: ApiError | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  reset: () => void
}

/** Configuración de WebSocket */
export interface WebSocketConfig {
  url: string
  protocols?: string[]
  reconnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

/** Evento de WebSocket */
export interface WebSocketEvent<T = unknown> {
  type: string
  data: T
  timestamp: number
}
