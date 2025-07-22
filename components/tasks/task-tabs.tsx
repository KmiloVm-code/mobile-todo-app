'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import type { Task, TaskStats } from '@/types'
import { TaskCard } from './task-card'
import { TaskFormData, TaskWithUserData } from '@/lib/validations'
import { useState } from 'react'
import { completeTask, deleteTask, editedTask } from '@/lib/queries/actions'
import { formatTaskDate } from '@/lib/utils/formatters'
import { toast } from 'sonner'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

interface TaskTabsProps {
  tasks: Task[]
  userId: string
  stats: TaskStats
}

export function TaskTabs({ tasks, userId, stats }: TaskTabsProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskData, setEditingTaskData] = useState<
    Partial<TaskFormData> | undefined
  >(undefined)
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleFilter = (term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('filter', term)
    } else {
      params.delete('filter')
    }
    params.set('page', '1')
    replace(`${pathname}?${params.toString()}`)
  }

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!userId) {
      toast.error('❌ Error de sesión')
      return
    }

    if (editingTaskId) {
      const taskData: TaskWithUserData = {
        ...data,
        userId: userId || '',
      }
      await editedTask(editingTaskId, taskData)
        .then(() => {
          toast.success('🔄 ¡Tarea actualizada!', {
            description: `Los cambios en "${data.title}" han sido guardados.`,
          })
        })
        .catch((error) => {
          console.error('Error al actualizar tarea:', error)
          toast.error('❌ Error al actualizar la tarea', {
            description: 'Por favor, inténtalo de nuevo más tarde.',
          })
        })
        .finally(() => {
          setEditingTaskId(null)
          setEditingTaskData(undefined)
        })
    }
  }

  // Abrir diálogo de edición
  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const taskData: Partial<TaskFormData> = {
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        startDate: formatTaskDate(task.startDate),
        endDate: formatTaskDate(task.endDate),
      }
      setEditingTaskId(taskId)
      setEditingTaskData(taskData)
    }
  }

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setEditingTaskData(undefined)
  }

  // Manejar toggle de tarea con notificación
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      await completeTask(taskId, newStatus)
        .then(() => {
          toast.success('✅ Tarea actualizada', {
            description: `La tarea "${task.title}" ha sido marcada como ${newStatus}.`,
          })
        })
        .catch((error) => {
          console.error('Error al actualizar tarea:', error)
          toast.error('❌ Error al actualizar la tarea', {
            description: 'Por favor, inténtalo de nuevo más tarde.',
          })
        })
    }
  }

  // Manejar eliminación de tarea con notificación
  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      await deleteTask(taskId)
        .then(() => {
          toast.success('🗑️ Tarea eliminada', {
            description: `La tarea "${task.title}" ha sido eliminada.`,
          })
        })
        .catch((error) => {
          console.error('Error al eliminar tarea:', error)
          toast.error('❌ Error al eliminar la tarea', {
            description: 'Por favor, inténtalo de nuevo más tarde.',
          })
        })
        .finally(() => {
          setEditingTaskId(null)
          setEditingTaskData(undefined)
        })
    }
  }

  const tabConfigs = [
    {
      value: 'all',
      label: 'Todas',
      emoji: '📝',
      title: '¡Comienza tu día productivo!',
      message: 'Agrega tu primera tarea y organiza tu tiempo',
      gradient:
        'data-[state=active]:from-purple-500 data-[state=active]:to-pink-500',
    },
    {
      value: 'notCompleted',
      label: 'Pendientes',
      emoji: '⏳',
      title: 'No hay tareas pendientes',
      message: '¡Genial! No tienes tareas pendientes por hacer',
      gradient:
        'data-[state=active]:from-amber-400 data-[state=active]:to-orange-500',
    },
    {
      value: 'completed',
      label: 'Hechas',
      emoji: '🎉',
      title: '¡Buen trabajo!',
      message: 'Has completado todas tus tareas pendientes',
      gradient:
        'data-[state=active]:from-emerald-400 data-[state=active]:to-teal-500',
    },
  ]

  return (
    <div className="flex flex-col px-5 sm:px-6">
      <Tabs
        value={searchParams.get('filter')?.toString()}
        onValueChange={(value) => handleFilter(value)}
        className="w-full"
      >
        <TabsList className="grid w-full h-full grid-cols-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-purple-100 dark:border-slate-700">
          {tabConfigs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`h-full rounded-xl font-semibold data-[state=active]:bg-gradient-to-r ${tab.gradient} data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 dark:text-slate-300`}
            >
              <div className="flex flex-col sm:flex items-center">
                <span className="flex items-center gap-1">
                  <span role="img" aria-label={tab.label}>
                    {tab.emoji}
                  </span>
                  {tab.label}
                </span>
                <small
                  className="inline-flex items-center justify-center min-w-[1.25rem] h-5 text-xs font-semibold rounded-full bg-white/20 mt-1 ml-1 px-1.5 transition-all duration-200 data-[state=active]:bg-white/30 data-[state=active]:text-white"
                  aria-label={`tareas ${tab.label}`}
                >
                  {tab.value === 'all'
                    ? (stats.total ?? 0)
                    : (stats[tab.value as keyof typeof stats] ?? 0)}
                </small>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value={searchParams.get('filter')?.toString() || 'all'}
          className="mt-6 space-y-4"
        >
          {tasks.length === 0 ? (
            <Card className="border-0 shadow-lg rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                {(() => {
                  const currentTab =
                    tabConfigs.find(
                      (tab) => tab.value === searchParams.get('filter')
                    ) || tabConfigs[0]
                  return (
                    <>
                      <div className="text-4xl mb-4">
                        <span role="img" aria-label="empty state">
                          {currentTab?.emoji}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">
                        {currentTab?.title}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {currentTab?.message}
                      </p>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                defaultValues={
                  editingTaskId === task.id ? editingTaskData : undefined
                }
                onToggle={() => handleToggleTask(task.id)}
                onEdit={() => handleEditTask(task.id)}
                onUpdate={handleUpdateTask}
                onDelete={() => handleDeleteTask(task.id)}
                onCancelEdit={handleCancelEdit}
                isEditing={editingTaskId === task.id}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
