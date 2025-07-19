'use server'

import { getTodosByUser } from '@/lib/queries/data'
import { TaskTabs } from './task-tabs'
import { TaskStats } from '@/types'

interface TaskListProps {
  userId: string
  stats: TaskStats
}

export async function TaskList({ userId, stats }: TaskListProps) {
  const tasks = await getTodosByUser(userId)

  return <TaskTabs tasks={tasks} userId={userId} stats={stats} />
}
