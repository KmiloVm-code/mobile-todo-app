/**
 * Constantes tipadas de la aplicación
 */

import type { TaskPriority, TaskStatus } from '@/types/task'
import type { Theme } from '@/types/theme'
import type { Language, DefaultView } from '@/types/common'

// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'TaskFlow',
  version: '1.0.0',
  description: 'Organiza tu vida de manera inteligente',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
  },
} as const

// Límites y validaciones
export const VALIDATION_RULES = {
  task: {
    title: {
      minLength: 1,
      maxLength: 200,
    },
    description: {
      maxLength: 1000,
    },
  },
  user: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    email: {
      maxLength: 255,
    },
    password: {
      minLength: 6,
      maxLength: 128,
    },
  },
} as const

// Opciones de selección
export const TASK_PRIORITIES: readonly TaskPriority[] = [
  'low',
  'medium', 
  'high',
  'urgent'
] as const

export const TASK_STATUSES: readonly TaskStatus[] = [
  'pending',
  'in-progress',
  'completed',
  'cancelled'
] as const

export const THEMES: readonly Theme[] = [
  'light',
  'dark',
  'system'
] as const

export const LANGUAGES: readonly Language[] = [
  'es',
  'en'
] as const

export const DEFAULT_VIEWS: readonly DefaultView[] = [
  'all',
  'pending',
  'completed'
] as const

// Labels y textos
export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente'
} as const

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  'in-progress': 'En progreso',
  completed: 'Completada',
  cancelled: 'Cancelada'
} as const

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema'
} as const

export const LANGUAGE_LABELS: Record<Language, string> = {
  es: 'Español',
  en: 'English'
} as const

export const DEFAULT_VIEW_LABELS: Record<DefaultView, string> = {
  all: 'Todas',
  pending: 'Pendientes',
  completed: 'Completadas'
} as const

// Colores para prioridades
export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'text-green-600 bg-green-50 border-green-200',
  medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  urgent: 'text-red-600 bg-red-50 border-red-200'
} as const

// Colores para estados
export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  pending: 'text-gray-600 bg-gray-50 border-gray-200',
  'in-progress': 'text-blue-600 bg-blue-50 border-blue-200',
  completed: 'text-green-600 bg-green-50 border-green-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200'
} as const

// Configuración por defecto
export const DEFAULT_USER_PREFERENCES = {
  theme: 'system' as Theme,
  notifications: true,
  language: 'es' as Language,
  defaultView: 'all' as DefaultView,
} as const

export const DEFAULT_TASK_FORM_DATA = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  priority: 'medium' as TaskPriority,
} as const

// Configuración de localStorage
export const STORAGE_KEYS = {
  user: 'user',
  theme: 'theme',
  tasks: 'tasks',
  preferences: 'preferences',
} as const

// Configuración de API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    get: (id: string) => `/tasks/${id}`,
  },
  categories: {
    list: '/categories',
    create: '/categories',
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
  tags: {
    list: '/tags',
    create: '/tags',
    update: (id: string) => `/tags/${id}`,
    delete: (id: string) => `/tags/${id}`,
  },
} as const

// Configuración de caché
export const CACHE_CONFIG = {
  defaultTTL: 5 * 60 * 1000, // 5 minutos
  maxSize: 100,
  keys: {
    tasks: 'tasks',
    user: 'user',
    categories: 'categories',
    tags: 'tags',
  },
} as const

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  network: 'Error de conexión. Verifica tu conexión a internet.',
  unauthorized: 'No tienes permisos para realizar esta acción.',
  notFound: 'El recurso solicitado no fue encontrado.',
  validation: 'Los datos ingresados no son válidos.',
  server: 'Error interno del servidor. Intenta más tarde.',
  timeout: 'La operación ha tardado demasiado tiempo.',
  unknown: 'Ha ocurrido un error inesperado.',
} as const

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  taskCreated: 'Tarea creada exitosamente',
  taskUpdated: 'Tarea actualizada exitosamente',
  taskDeleted: 'Tarea eliminada exitosamente',
  taskCompleted: 'Tarea marcada como completada',
  userUpdated: 'Perfil actualizado exitosamente',
  settingsSaved: 'Configuración guardada exitosamente',
} as const

// Configuración de animaciones
export const ANIMATION_CONFIG = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const

// Configuración de responsive breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const
