/**
 * Guards de tipo y validadores generales
 */

import type { Task, TaskPriority, TaskStatus } from '@/types/task'
import type { User } from '@/types/auth'

// Guards de tipo básicos
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isValidDate(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

export function isTaskPriority(value: string): value is TaskPriority {
  return ['low', 'medium', 'high', 'urgent'].includes(value)
}

export function isTaskStatus(value: string): value is TaskStatus {
  return ['pending', 'in-progress', 'completed', 'cancelled'].includes(value)
}

// Validadores de objetos complejos
export function isValidTask(obj: unknown): obj is Task {
  if (typeof obj !== 'object' || obj === null) return false

  const task = obj as Record<string, unknown>

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    (task.description === undefined || typeof task.description === 'string') &&
    (task.startDate === undefined || typeof task.startDate === 'string') &&
    (task.endDate === undefined || typeof task.endDate === 'string') &&
    typeof task.completed === 'boolean' &&
    isTaskStatus(task.status as string) &&
    isTaskPriority(task.priority as string) &&
    typeof task.userId === 'string' &&
    typeof task.createdAt === 'string'
  )
}

export function isValidUser(obj: unknown): obj is User {
  if (typeof obj !== 'object' || obj === null) return false

  const user = obj as Record<string, unknown>

  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    isValidEmail(user.email) &&
    typeof user.avatar === 'string' &&
    typeof user.createdAt === 'string' &&
    typeof user.preferences === 'object' &&
    user.preferences !== null
  )
}
