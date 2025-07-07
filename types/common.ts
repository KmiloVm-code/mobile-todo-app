/**
 * Tipos comunes utilizados en toda la aplicación
 */

/** Identificador único */
export type ID = string

/** Estados de carga */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/** Preferencias de idioma */
export type Language = 'es' | 'en'

/** Tipos de vistas por defecto */
export type DefaultView = 'all' | 'pending' | 'completed'

/** Estados de error */
export interface ErrorState {
  hasError: boolean
  message?: string
  code?: string
}

/** Respuesta genérica de API */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/** Metadatos de paginación */
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** Respuesta paginada */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta
}

/** Timestamps de auditoría */
export interface AuditTimestamps {
  createdAt: string
  updatedAt?: string
  deletedAt?: string
}

/** Entidad base con auditoría */
export interface BaseEntity extends AuditTimestamps {
  id: ID
}

/** Opciones de configuración de componentes */
export interface ComponentOptions {
  disabled?: boolean
  loading?: boolean
  variant?: string
  size?: 'sm' | 'md' | 'lg'
}

/** Evento de cambio genérico */
export interface ChangeEvent<T = unknown> {
  value: T
  previousValue?: T
}

/** Función de callback genérica */
export type Callback<T = void> = () => T
export type CallbackWithParam<P, T = void> = (param: P) => T
