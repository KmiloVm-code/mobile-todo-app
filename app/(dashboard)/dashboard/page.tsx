import type { Metadata } from 'next'
import { auth } from '@/auth/auth'
import { redirect } from 'next/navigation'
import { TaskHeader } from '@/components/tasks'
import { Suspense } from 'react'
import {
  DashboardCardSkeleton,
  DashboardHeaderSkeleton,
} from '@/components/dashboard/skeletons'
import { AddTaskDialog } from '@/components/tasks/add-task-dialog'
import { TaskList } from '@/components/tasks/Task-List'
import { User } from '@/types'
import { fetchUserTaskStats } from '@/lib/queries/data'

export const metadata: Metadata = {
  title: 'Mis Tareas - TaskFlow',
  description: 'Gestiona y organiza todas tus tareas',
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
    return null
  }

  const userId = session.user.id
  const [taskStats] = await Promise.all([fetchUserTaskStats(userId)])

  return (
    <div className="flex flex-col min-h-full">
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-purple-100 dark:border-slate-700 sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <Suspense fallback={<DashboardHeaderSkeleton />}>
          <TaskHeader user={session.user as User} stats={taskStats} />
        </Suspense>
      </nav>

      <main className="flex-1 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-20 transition-colors duration-300">
        <AddTaskDialog user={userId} />
        <Suspense fallback={<DashboardCardSkeleton />}>
          <TaskList userId={userId} stats={taskStats} />
        </Suspense>
      </main>
    </div>
  )
}
