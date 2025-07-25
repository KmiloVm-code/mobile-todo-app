'use server'

import postgres from 'postgres'
import { Task, TaskStats, User } from '@/types'

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set')
}

const sql = postgres(process.env.POSTGRES_URL)

export async function getTodosByUser(
  userId: string,
  status: string,
  page: number = 1,
  pageSize: number = 10
): Promise<Task[]> {
  try {
    const offset = (page - 1) * pageSize

    let statusCondition = sql``
    switch (status) {
      case 'notCompleted':
        statusCondition = sql`AND status NOT IN ('completed', 'cancelled')`
        break
      case 'completed':
      case 'cancelled':
        statusCondition = sql`AND status = ${status}`
        break
      case 'all':
        break
      default:
        statusCondition = sql`AND status = ${status}`
        break
    }

    const countResult = await sql`
    SELECT COUNT(*)::int AS total
    FROM tasks
    WHERE user_id = ${userId}
    ${statusCondition}
  `
    const totalItems = countResult[0]?.total || 0
    const totalPages = Math.ceil(totalItems / pageSize)

    const todos = await sql`
      SELECT * FROM tasks 
      WHERE user_id = ${userId}
      ${statusCondition}
      ORDER BY 
        (status = 'completed') ASC,
        CASE 
          WHEN status != 'completed' THEN
            CASE 
              WHEN priority = 'urgent' THEN 1
              WHEN priority = 'high' THEN 2
              WHEN priority = 'medium' THEN 3
              WHEN priority = 'low' THEN 4
              ELSE 5
            END
        END ASC,
        CASE 
          WHEN status != 'completed' THEN end_date
        END ASC NULLS LAST,
        CASE 
          WHEN status != 'completed' THEN created_at
        END DESC,
        completed_at DESC NULLS LAST
        LIMIT ${pageSize} OFFSET ${offset};
    `

    console.log(`Fetched ${todos.length} todos for user ${userId}`)
    return todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      status: todo.status,
      priority: todo.priority,
      dueDate: todo.due_date,
      categoryId: todo.category_id,
      startDate: todo.start_date,
      endDate: todo.end_date,
      category: {
        id: todo.category_id,
        name: todo.category_name,
        color: todo.category_color,
        icon: todo.category_icon,
        createdAt: todo.category_created_at || todo.created_at,
        updatedAt: todo.category_updated_at || todo.updated_at,
      },
      tags: todo.tags
        ? todo.tags.map(
            (
              tag: Pick<
                { id: string; name: string; color: string },
                'id' | 'name' | 'color'
              >
            ) => ({
              id: tag.id,
              name: tag.name,
              color: tag.color,
            })
          )
        : [],
      attachments: todo.attachments
        ? todo.attachments.map(
            (
              att: Pick<
                {
                  id: string
                  name: string
                  url: string
                  type: string
                  size: number
                },
                'id' | 'name' | 'url' | 'type' | 'size'
              >
            ) => ({
              id: att.id,
              name: att.name,
              url: att.url,
              type: att.type,
              size: att.size,
            })
          )
        : [],
      subtasks: todo.subtasks
        ? todo.subtasks.map(
            (
              sub: Pick<
                {
                  id: string
                  title: string
                  completed: boolean
                  task_id: string
                  order: number
                },
                'id' | 'title' | 'completed' | 'task_id' | 'order'
              >
            ) => ({
              id: sub.id,
              title: sub.title,
              completed: sub.completed,
              taskId: sub.task_id,
              order: sub.order,
            })
          )
        : [],
      userId: todo.user_id,
      createdAt: todo.created_at,
      updatedAt: todo.updated_at,
      page: page,
      pageSize: pageSize,
      totalPages: totalPages,
      totalItems: totalItems,
    })) as Task[]
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await sql`
      SELECT * FROM users 
      WHERE id = ${userId}
    `

    console.log(`Fetched user with ID ${userId}:`, user)
    return user[0] as unknown as User
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

export async function fetchTasksWithDetails() {
  try {
    const tasks = await sql`
      SELECT 
        id,
        title,
        description,
        status,
        priority,
        due_date,
        category_name,
        category_color,
        category_icon,
        subtask_count,
        completed_subtask_count,
        tag_names,
        created_at,
        updated_at
      FROM tasks_full 
      ORDER BY 
        CASE status 
          WHEN 'pending' THEN 1 
          WHEN 'in_progress' THEN 2 
          WHEN 'completed' THEN 3 
        END,
        due_date ASC NULLS LAST
    `
    return tasks
  } catch (error) {
    console.error('Error fetching tasks with details:', error)
    throw error
  }
}

export async function fetchTasksByStatus(status: string) {
  try {
    const tasks = await sql`
      SELECT * FROM tasks_full 
      WHERE status = ${status}
      ORDER BY due_date ASC NULLS LAST
    `
    console.log(`Fetched ${tasks.length} tasks with status ${status}`)
    return tasks
  } catch (error) {
    console.error('Error fetching tasks by status:', error)
    throw error
  }
}

export async function fetchTaskCategories(userId: string) {
  try {
    const categories = await sql`
      SELECT id, name, color, icon, description 
      FROM task_categories 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY name
    `
    return categories
  } catch (error) {
    console.error('Error fetching task categories:', error)
    throw error
  }
}

export async function fetchTaskTags(userId: string) {
  try {
    const tags = await sql`
      SELECT id, name, color 
      FROM tags 
      WHERE user_id = ${userId}
      ORDER BY name
    `
    return tags
  } catch (error) {
    console.error('Error fetching task tags:', error)
    throw error
  }
}

export async function fetchUserTaskStats(userId: string): Promise<TaskStats> {
  try {
    const stats = await sql`
      SELECT 
      total_tasks,
      pending_tasks,
      in_progress_tasks,
      completed_tasks,
      overdue_tasks,
      due_today_tasks,
      (pending_tasks + in_progress_tasks) AS not_completed_tasks,
      CASE 
        WHEN total_tasks > 0 THEN (completed_tasks::float / total_tasks) * 100
        ELSE 0
      END AS completion_rate
      FROM user_task_stats 
      WHERE user_id = ${userId}
    `

    console.log(`Fetched task stats for user ${userId}:`, stats)
    const rawStats = stats[0]

    if (!rawStats) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        cancelled: 0,
        overdue: 0,
        dueToday: 0,
        completionRate: 0,
        notCompleted: 0,
      } as TaskStats
    }

    return {
      total: rawStats.total_tasks,
      completed: rawStats.completed_tasks,
      pending: rawStats.pending_tasks,
      inProgress: rawStats.in_progress_tasks,
      cancelled: 0, // Add this column to your view or calculate separately
      overdue: rawStats.overdue_tasks,
      dueToday: rawStats.due_today_tasks,
      completionRate: rawStats.completion_rate,
      notCompleted: rawStats.not_completed_tasks,
    } as TaskStats
  } catch (error) {
    console.error('Error fetching user task stats:', error)
    throw error
  }
}
