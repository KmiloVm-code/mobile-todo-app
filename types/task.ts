/**
 * Tipos relacionados con tareas y gestión de tareas
 */

import type { BaseEntity, ID } from './common'

/** Estado de una tarea */
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

/** Prioridad de una tarea */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

/** Categoría de tarea */
export interface TaskCategory extends BaseEntity {
  name: string
  color: string
  icon?: string
}

/** Etiqueta de tarea */
export interface TaskTag extends BaseEntity {
  name: string
  color: string
}

/** Tarea */
export interface Task extends BaseEntity {
  title: string
  description?: string
  startDate?: string
  endDate?: string
  completed: boolean
  status: TaskStatus
  priority: TaskPriority
  categoryId?: ID
  category?: TaskCategory
  tags?: TaskTag[]
  attachments?: TaskAttachment[]
  subtasks?: Subtask[]
  userId: ID
}

/** Subtarea */
export interface Subtask extends BaseEntity {
  title: string
  completed: boolean
  taskId: ID
  order: number
}

/** Adjunto de tarea */
export interface TaskAttachment extends BaseEntity {
  name: string
  url: string
  type: string
  size: number
  taskId: ID
}

/** Filtros de tareas */
export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  categoryId?: ID
  tagIds?: ID[]
  startDate?: string
  endDate?: string
  search?: string
  completed?: boolean
}

/** Ordenamiento de tareas */
export interface TaskSorting {
  field: 'createdAt' | 'updatedAt' | 'startDate' | 'endDate' | 'priority' | 'title'
  direction: 'asc' | 'desc'
}

/** Estadísticas de tareas */
export interface TaskStats {
  total: number
  completed: number
  pending: number
  inProgress: number
  cancelled: number
  overdue: number
  completionRate: number
}

/** Vista de calendario de tareas */
export interface TaskCalendarView {
  date: string
  tasks: Task[]
  count: number
}

/** Historial de cambios de tarea */
export interface TaskHistory extends BaseEntity {
  taskId: ID
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'restored'
  field?: string
  oldValue?: unknown
  newValue?: unknown
  userId: ID
  userName: string
}

/** Recordatorio de tarea */
export interface TaskReminder extends BaseEntity {
  taskId: ID
  type: 'email' | 'push' | 'sms'
  reminderTime: string
  sent: boolean
  sentAt?: string
}
