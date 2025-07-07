/**
 * Tipos relacionados con formularios y validación
 */

import type { ReactNode } from 'react'

/** Estado de validación de campo */
export interface FieldValidation {
  isValid: boolean
  error?: string
  touched: boolean
  dirty: boolean
}

/** Reglas de validación */
export interface ValidationRules {
  required?: boolean | string
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  email?: boolean
  url?: boolean
  min?: number
  max?: number
  custom?: (value: unknown) => string | undefined
}

/** Campo de formulario genérico */
export interface FormField<T = unknown> {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file'
  value: T
  defaultValue?: T
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  validation?: ValidationRules
  options?: SelectOption[]
  description?: string
  helper?: string
}

/** Opción para campos select/radio */
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
}

/** Estado de formulario */
export interface FormState<T = Record<string, unknown>> {
  values: T
  errors: Record<keyof T, string | undefined>
  touched: Record<keyof T, boolean>
  dirty: Record<keyof T, boolean>
  isValid: boolean
  isSubmitting: boolean
  isSubmitted: boolean
}

/** Configuración de formulario */
export interface FormConfig<T = Record<string, unknown>> {
  initialValues: T
  validationSchema?: ValidationSchema<T>
  onSubmit: (values: T) => void | Promise<void>
  onValidate?: (values: T) => Record<keyof T, string | undefined>
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

/** Schema de validación */
export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRules
}

/** Hook de formulario */
export interface UseFormReturn<T = Record<string, unknown>> {
  values: T
  errors: Record<keyof T, string | undefined>
  touched: Record<keyof T, boolean>
  dirty: Record<keyof T, boolean>
  isValid: boolean
  isSubmitting: boolean
  isSubmitted: boolean
  setValue: (name: keyof T, value: T[keyof T]) => void
  setError: (name: keyof T, error?: string) => void
  setTouched: (name: keyof T, touched?: boolean) => void
  setFieldValue: (name: keyof T, value: T[keyof T]) => void
  setFieldError: (name: keyof T, error?: string) => void
  setFieldTouched: (name: keyof T, touched?: boolean) => void
  handleChange: (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (name: keyof T) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSubmit: (e?: React.FormEvent) => void
  reset: (values?: Partial<T>) => void
  validate: () => boolean
  validateField: (name: keyof T) => boolean
}

/** Props de formulario */
export interface FormProps<T = Record<string, unknown>> extends FormConfig<T> {
  children: ReactNode | ((form: UseFormReturn<T>) => ReactNode)
  className?: string
}

/** Datos de formulario de login */
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

/** Datos de formulario de registro */
export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

/** Datos de formulario de tarea - específico para formularios */
export interface TaskFormInput {
  title: string
  description: string
  startDate: string
  endDate: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  categoryId?: string
  tags?: string[]
}

/** Datos de formulario de perfil */
export interface ProfileFormData {
  name: string
  email: string
  bio?: string
  avatar?: string
  location?: string
  website?: string
}

/** Mensaje de formulario */
export interface FormMessage {
  type: 'success' | 'error' | 'warning' | 'info'
  text: string
  field?: string
}

/** Estado de envío de formulario */
export interface SubmissionState {
  isSubmitting: boolean
  message: FormMessage | null
  lastSubmission?: Date
}
