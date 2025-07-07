/**
 * Utilidades para filtrado, ordenamiento y agrupación de datos
 */

import type { Task, TaskPriority, TaskStatus } from '@/types/task'

// Utilidades de comparación
export function compareTasksByPriority(a: Task, b: Task): number {
  const priorityOrder: Record<TaskPriority, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3
  }
  
  return priorityOrder[a.priority] - priorityOrder[b.priority]
}

export function compareTasksByDate(a: Task, b: Task): number {
  const dateA = new Date(a.endDate || a.startDate || a.createdAt)
  const dateB = new Date(b.endDate || b.startDate || b.createdAt)
  return dateA.getTime() - dateB.getTime()
}

export function compareTasksByCreated(a: Task, b: Task): number {
  const dateA = new Date(a.createdAt)
  const dateB = new Date(b.createdAt)
  return dateB.getTime() - dateA.getTime() // Más recientes primero
}

export function compareTasksByTitle(a: Task, b: Task): number {
  return a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
}

// Utilidades de filtrado
export function filterTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter(task => task.status === status)
}

export function filterTasksByPriority(tasks: Task[], priority: TaskPriority): Task[] {
  return tasks.filter(task => task.priority === priority)
}

export function filterTasksByCompletion(tasks: Task[], completed: boolean): Task[] {
  return tasks.filter(task => task.completed === completed)
}

export function filterTasksByDateRange(
  tasks: Task[],
  startDate?: string,
  endDate?: string
): Task[] {
  return tasks.filter(task => {
    if (startDate && task.startDate && task.startDate < startDate) return false
    if (endDate && task.endDate && task.endDate > endDate) return false
    return true
  })
}

export function filterOverdueTasks(tasks: Task[]): Task[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return tasks.filter(task => {
    if (task.completed || !task.endDate) return false
    const [year, month, day] = task.endDate.split('-').map(Number)
    if (!year || !month || !day) return false
    const taskDate = new Date(year, month - 1, day)
    return taskDate < today
  })
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks
  
  const searchTerm = query.toLowerCase().trim()
  
  return tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm) ||
    (task.description && task.description.toLowerCase().includes(searchTerm))
  )
}

// Utilidades de agrupación
export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = {
    pending: [],
    'in-progress': [],
    completed: [],
    cancelled: []
  }
  
  tasks.forEach(task => {
    groups[task.status].push(task)
  })
  
  return groups
}

export function groupTasksByPriority(tasks: Task[]): Record<TaskPriority, Task[]> {
  const groups: Record<TaskPriority, Task[]> = {
    urgent: [],
    high: [],
    medium: [],
    low: []
  }
  
  tasks.forEach(task => {
    groups[task.priority].push(task)
  })
  
  return groups
}

export function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {}
  
  tasks.forEach(task => {
    const date = task.endDate || task.startDate || task.createdAt.split('T')[0]
    if (date) {
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(task)
    }
  })
  
  return groups
}

// Utilidades de agregación y estadísticas
export function getTaskStats(tasks: Task[]) {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.filter(t => !t.completed).length
  const overdue = filterOverdueTasks(tasks).length
  
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return {
    total,
    completed,
    pending,
    overdue,
    completionRate
  }
}

export function getTasksByPriorityStats(tasks: Task[]) {
  const groups = groupTasksByPriority(tasks)
  
  return {
    urgent: groups.urgent.length,
    high: groups.high.length,
    medium: groups.medium.length,
    low: groups.low.length
  }
}
