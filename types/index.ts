// Re-export all types for easy importing
export * from './auth'
export * from './ui'
export * from './common'
export * from './theme'
export * from './api'

// Export task types (keeping TaskFormData from task module)
export * from './task'

// Export form types with explicit re-exports to avoid conflicts
export type {
  FieldValidation,
  ValidationRules,
  FormField,
  SelectOption,
  FormState,
  FormConfig,
  ValidationSchema,
  UseFormReturn,
  FormProps,
  LoginFormData,
  RegisterFormData,
  TaskFormInput, // Renamed from TaskFormData to avoid conflict
  ProfileFormData,
  FormMessage,
  SubmissionState,
} from './forms'

// Re-export global utilities
export * from './global.d'
