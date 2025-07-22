'use server'

import { getTodosByUser } from '@/lib/queries/data'
import { TaskTabs } from './task-tabs'
import { TaskStats } from '@/types'
import { TaskPagination } from './task-pagination'

interface TaskListProps {
  userId: string
  stats: TaskStats
  status: string
  page: number
}

export async function TaskList({ userId, stats, status, page }: TaskListProps) {
  const tasks = await getTodosByUser(userId, status, Number(page || 1))
  console.log('Tasks fetched:', tasks)

  return (
    <>
      <TaskTabs tasks={tasks} userId={userId} stats={stats} />
      <TaskPagination
        currentPage={page}
        totalPages={tasks[0]?.totalPages || 1}
      />
    </>
  )
}
