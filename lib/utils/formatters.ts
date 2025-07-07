/**
 * Utilidades para formateo y transformación de datos
 */

import { isValidDate } from './validators'

// Transformadores de texto
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

export function createTaskSlug(title: string): string {
  return sanitizeString(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function capitalizeFirst(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Formateadores de fecha
export function formatTaskDate(dateString: string): string {
  if (!dateString || !isValidDate(dateString)) return ''
  
  const [year, month, day] = dateString.split('-').map(Number)
  if (!year || !month || !day) return ''
  
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatRelativeDate(dateString: string): string {
  if (!dateString || !isValidDate(dateString)) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays === -1) return 'Mañana'
  if (diffInDays > 0) return `Hace ${diffInDays} días`
  return `En ${Math.abs(diffInDays)} días`
}

export function formatTimeAgo(dateString: string): string {
  if (!dateString || !isValidDate(dateString)) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Hace unos segundos'
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`
  
  return formatRelativeDate(dateString)
}
