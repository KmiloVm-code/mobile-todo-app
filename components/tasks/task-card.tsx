"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CalendarDays,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";
import type { Task } from "@/types/task";
import type { TaskFormData } from "@/lib/validations/task-form";
import { TaskForm } from "@/components/tasks/task-form";
import { formatTaskDate } from "@/lib/utils/formatters";

interface TaskCardProps {
  task: Task;
  defaultValues?: Partial<TaskFormData>;
  isEditing: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onUpdate: (data: TaskFormData) => void;
  onDelete: () => void;
  onCancelEdit: () => void;
}

export function TaskCard({
  task,
  defaultValues,
  isEditing,
  onToggle,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}: TaskCardProps) {
  const isOverdue = (task: Task) => {
    if (!task.endDate || task.status === "completed") return false;
    // Compara la fecha de vencimiento con la fecha actual
    const endDate = new Date(task.endDate);
    const today = new Date();
    // Eliminar la hora para comparar solo fechas
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return endDate < today;
  };

  return (
    <Card
      className={`border-0 shadow-lg rounded-2xl transition-all duration-200 hover:shadow-xl ${
        task.status === "completed"
          ? "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 opacity-75"
          : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={onToggle}
            className="mt-1 transition-all duration-200 hover:scale-110"
            aria-label={
              task.status === "completed"
                ? "Marcar como pendiente"
                : "Marcar como completada"
            }
          >
            {task.status === "completed" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Circle className="w-6 h-6 text-slate-400 dark:text-slate-500 hover:text-purple-500 dark:hover:text-purple-400" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-lg ${
                task.status === "completed"
                  ? "line-through text-slate-500 dark:text-slate-400"
                  : "text-slate-800 dark:text-slate-100"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-sm mt-2 leading-relaxed ${
                  task.status === "completed"
                    ? "text-slate-400 dark:text-slate-500"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Badge de prioridad */}
              <Badge
                variant="outline"
                className={`text-xs rounded-full px-3 py-1 ${
                  task.priority === "urgent"
                    ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
                    : task.priority === "high"
                    ? "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300"
                    : task.priority === "medium"
                    ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300"
                    : "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                }`}
              >
                {task.priority === "urgent" && "🚨 Urgente"}
                {task.priority === "high" && "🔴 Alta"}
                {task.priority === "medium" && "🟡 Media"}
                {task.priority === "low" && "🟢 Baja"}
              </Badge>

              {task.startDate && (
                <Badge
                  variant="outline"
                  className="text-xs bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full px-3 py-1"
                >
                  <CalendarDays className="w-3 h-3 mr-2" />
                  Inicio: {formatTaskDate(task.startDate)}
                </Badge>
              )}
              {task.endDate && (
                <Badge
                  variant={isOverdue(task) ? "destructive" : "outline"}
                  className={`text-xs rounded-full px-3 py-1 ${
                    isOverdue(task)
                      ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                      : "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {isOverdue(task) ? (
                    <AlertTriangle className="w-3 h-3 mr-2" />
                  ) : (
                    <Clock className="w-3 h-3 mr-2" />
                  )}
                  {isOverdue(task) ? "Vencida: " : "Límite: "}
                  {formatTaskDate(task.endDate)}
                </Badge>
              )}
            </div>
            <div className="flex gap-1 justify-end">
              <Dialog
                open={isEditing}
                onOpenChange={(open) => !open && onCancelEdit()}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 sm:h-10 sm:w-10 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200"
                    onClick={onEdit}
                    aria-label="Editar tarea"
                  >
                    <Edit2 className="!w-5 !h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-md rounded-2xl border-0 shadow-2xl bg-white dark:bg-slate-900">
                  <DialogHeader className="pb-2">
                    <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      ✏️ Editar Tarea
                    </DialogTitle>
                  </DialogHeader>
                  <TaskForm
                    defaultValues={defaultValues}
                    onSubmit={onUpdate}
                    onCancel={onCancelEdit}
                    isEdit
                  />
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 sm:h-10 sm:w-10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-all duration-200"
                    aria-label="Eliminar tarea"
                  >
                    <Trash2 className="!w-5 !h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      🗑️ ¿Eliminar tarea?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-600 dark:text-slate-300">
                      ¿Estás seguro de que quieres eliminar "{task.title}"? Esta
                      acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-xl"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
