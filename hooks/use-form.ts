/**
 * Hook personalizado para manejo de formularios con validación
 */

import { useState, useCallback, useMemo } from 'react'
import type { UseFormReturn, ValidationRules } from '@/types/forms'

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, ValidationRules>>
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<keyof T, string | undefined>>({} as Record<keyof T, string | undefined>)
  const [touched, setTouchedState] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Calcular valores derivados
  const dirty = useMemo(() => {
    const dirtyFields = {} as Record<keyof T, boolean>
    for (const key in values) {
      dirtyFields[key] = values[key] !== initialValues[key]
    }
    return dirtyFields
  }, [values, initialValues])

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error)
  }, [errors])

  // Validar un campo específico
  const validateField = useCallback((name: keyof T): boolean => {
    const value = values[name]
    const rules = validationRules?.[name]

    if (!rules) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
      return true
    }

    let error: string | undefined

    // Validación requerido
    if (rules.required) {
      const isEmpty = value === undefined || value === null || value === ''
      if (isEmpty) {
        error = typeof rules.required === 'string' ? rules.required : 'Este campo es requerido'
      }
    }

    // Validación de longitud mínima
    if (!error && rules.minLength && typeof value === 'string') {
      if (value.length < rules.minLength) {
        error = `Debe tener al menos ${rules.minLength} caracteres`
      }
    }

    // Validación de longitud máxima
    if (!error && rules.maxLength && typeof value === 'string') {
      if (value.length > rules.maxLength) {
        error = `No puede tener más de ${rules.maxLength} caracteres`
      }
    }

    // Validación de patrón
    if (!error && rules.pattern && typeof value === 'string') {
      if (!rules.pattern.test(value)) {
        error = 'Formato no válido'
      }
    }

    // Validación de email
    if (!error && rules.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        error = 'Ingresa un email válido'
      }
    }

    // Validación de URL
    if (!error && rules.url && typeof value === 'string') {
      try {
        new URL(value)
      } catch {
        error = 'Ingresa una URL válida'
      }
    }

    // Validación de valor mínimo
    if (!error && rules.min !== undefined && typeof value === 'number') {
      if (value < rules.min) {
        error = `El valor debe ser mayor o igual a ${rules.min}`
      }
    }

    // Validación de valor máximo
    if (!error && rules.max !== undefined && typeof value === 'number') {
      if (value > rules.max) {
        error = `El valor debe ser menor o igual a ${rules.max}`
      }
    }

    // Validación personalizada
    if (!error && rules.custom) {
      error = rules.custom(value)
    }

    setErrors(prev => ({ ...prev, [name]: error }))
    return !error
  }, [values, validationRules])

  // Validar todo el formulario
  const validate = useCallback((): boolean => {
    if (!validationRules) return true

    let formIsValid = true
    for (const name in validationRules) {
      const fieldIsValid = validateField(name as keyof T)
      if (!fieldIsValid) {
        formIsValid = false
      }
    }

    return formIsValid
  }, [validateField, validationRules])

  // Establecer valor de un campo
  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validar el campo si ya fue tocado
    if (touched[name]) {
      setTimeout(() => validateField(name), 0)
    }
  }, [touched, validateField])

  // Establecer error de un campo
  const setError = useCallback((name: keyof T, error?: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  // Marcar campo como tocado
  const setTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouchedState(prev => ({ ...prev, [name]: isTouched }))
  }, [])

  // Manejadores de eventos
  const handleChange = useCallback((name: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value as T[keyof T]
      setValue(name, value)
    }
  }, [setValue])

  const handleBlur = useCallback((name: keyof T) => {
    return () => {
      setTouchedState(prev => ({ ...prev, [name]: true }))
      validateField(name)
    }
  }, [validateField])

  // Manejar envío del formulario
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    setIsSubmitted(true)
    
    // Marcar todos los campos como tocados
    const allTouched = {} as Record<keyof T, boolean>
    for (const key in values) {
      allTouched[key] = true
    }
    setTouchedState(allTouched)

    const formIsValid = validate()
    
    if (formIsValid) {
      setIsSubmitting(true)
      // El onSubmit se manejará externamente
    }
  }, [values, validate])

  // Resetear formulario
  const reset = useCallback((newValues?: Partial<T>) => {
    const resetValues = newValues ? { ...initialValues, ...newValues } : initialValues
    setValues(resetValues)
    setErrors({} as Record<keyof T, string | undefined>)
    setTouchedState({} as Record<keyof T, boolean>)
    setIsSubmitting(false)
    setIsSubmitted(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    isSubmitted,
    setValue,
    setError,
    setTouched,
    setFieldValue: setValue,
    setFieldError: setError,
    setFieldTouched: setTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate,
    validateField,
  }
}
