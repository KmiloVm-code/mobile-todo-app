/**
 * Hooks personalizados para manejo de tareas
 */

import { useState, useCallback, useMemo } from 'react'
import type { Task, TaskFilters, TaskSorting } from '@/types/task'
import type { TaskFormData } from '@/lib/validations/task-form'

export interface UseTasksReturn {
  tasks: Task[]
  filteredTasks: Task[]
  addTask: (taskData: TaskFormData) => void
  updateTask: (id: string, taskData: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTask: (id: string) => void
  setTasks: (tasks: Task[]) => void
  // Filtros y ordenamiento
  filters: TaskFilters
  setFilters: (filters: TaskFilters) => void
  sorting: TaskSorting
  setSorting: (sorting: TaskSorting) => void
  // Estadísticas
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
}

export function useTasks(initialTasks: Task[] = []): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [sorting, setSorting] = useState<TaskSorting>({
    field: 'createdAt',
    direction: 'desc'
  })

  // Agregar nueva tarea
  const addTask = useCallback((taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      priority: taskData.priority || 'medium',
      status: 'pending',
      completed: false,
      userId: '1', // En una app real, esto vendría del contexto de usuario
      createdAt: new Date().toISOString(),
      categoryId: taskData.categoryId,
    }

    setTasks(prev => [newTask, ...prev])
  }, [])

  // Actualizar tarea existente
  const updateTask = useCallback((id: string, taskData: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...taskData, updatedAt: new Date().toISOString() }
          : task
      )
    )
  }, [])

  // Eliminar tarea
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  // Alternar estado de completado
  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? 'completed' : 'pending',
              updatedAt: new Date().toISOString()
            }
          : task
      )
    )
  }, [])

  // Filtrar y ordenar tareas
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Aplicar filtros
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status!.includes(task.status))
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority!.includes(task.priority))
    }

    if (filters.categoryId) {
      filtered = filtered.filter(task => task.categoryId === filters.categoryId)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        (task.description && task.description.toLowerCase().includes(searchTerm))
      )
    }

    if (filters.completed !== undefined) {
      filtered = filtered.filter(task => task.completed === filters.completed)
    }

    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      const aValue = a[sorting.field]
      const bValue = b[sorting.field]

      // Manejar valores undefined/null
      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sorting.direction === 'asc' ? comparison : -comparison
      }

      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [tasks, filters, sorting])

  // Estadísticas
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = tasks.filter(task => !task.completed).length
  const overdueTasks = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return tasks.filter(task => {
      if (task.completed || !task.endDate) return false
      
      const [year, month, day] = task.endDate.split('-').map(Number)
      if (!year || !month || !day) return false
      
      const taskDate = new Date(year, month - 1, day)
      return taskDate < today
    }).length
  }, [tasks])

  return {
    tasks,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setTasks,
    filters,
    setFilters,
    sorting,
    setSorting,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
  }
}
