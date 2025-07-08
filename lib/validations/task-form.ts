import { z } from "zod"

export const taskFormSchema = z.object({
  userId: z.string().min(1, "El ID de usuario es obligatorio"),
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede tener más de 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
  startDate: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val)
    .refine((val) => {
      if (!val) return true; // Si no hay fecha, es válido
      const date = new Date(val);
      return !isNaN(date.getTime()); // Verifica si la fecha es válida
    }, {
      message: "La fecha debe ser una fecha válida en formato YYYY-MM-DD",
    }),
  endDate: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val)
    .refine((val) => {
      if (!val) return true; // Si no hay fecha, es válido
      const date = new Date(val);
      return !isNaN(date.getTime()); // Verifica si la fecha es válida
    }, {
      message: "La fecha debe ser una fecha válida en formato YYYY-MM-DD",
    }),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.endDate && data.startDate) {
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    return endDate >= startDate
  }
  return true
}, {
  message: "La fecha límite no puede ser anterior a la fecha de inicio",
  path: ["endDate"],
}).refine((data) => {
  if (data.endDate) {
    const endDate = new Date(data.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return endDate >= today
  }
  return true
}, {
  message: "La fecha límite no puede estar en el pasado",
  path: ["endDate"],
})

export type TaskFormData = z.infer<typeof taskFormSchema>

export const taskFormDefaultValues: TaskFormData = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  priority: "medium",
  categoryId: undefined,
  tagIds: [],
  userId: ""
}

export function validateTaskFormData(data: Partial<TaskFormData>): TaskFormData {
  const parsed = taskFormSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.errors.map(e => e.message).join(", "))
  }
  return parsed.data
}

export function isTaskFormData(data: any): data is TaskFormData {
  return taskFormSchema.safeParse(data).success
}
