"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TaskForm, TaskCard, TaskTabs } from "@/components/tasks";
import type {
  TaskFormData,
  TaskWithUserData,
} from "@/lib/validations/task-form";

import { useEffect, useState } from "react";
import { Task } from "@/types";
import {
  createdTask,
  editedTask,
  deleteTask,
  completeTask,
} from "@/lib/actions";
import { formatTaskDate } from "@/lib/utils/formatters";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function TodoApp({ tasks }: { tasks: Task[] }) {
  // Usar el hook existente para manejar las tareas
  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    "all"
  );
  //   (user?.preferences?.defaultView as "all" | "pending" | "completed") || "all"
  // );
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (status === "loading") return;

    if (!user?.id) {
      // Actualizar la sesión y refrescar
      update().then(() => {
        router.refresh();
      });
    }
  }, [status, user?.id, update, router]);

  // Estado para diálogos
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<
    Partial<TaskFormData> | undefined
  >(undefined);

  // Filtrar tareas según la pestaña activa
  const getFilteredTasks = () => {
    switch (activeTab) {
      case "pending":
        return tasks.filter((task) => task.status !== "completed");
      case "completed":
        return tasks.filter((task) => task.status === "completed");
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "all" | "pending" | "completed");
  };

  // Manejar envío del formulario de agregar tarea
  const handleAddTask = async (data: TaskFormData) => {
    if (!user?.id) {
      toast.error("❌ Error de sesión", {
        description: "No se pudo identificar al usuario.",
      });
      return;
    }

    setIsAddingTask(true);
    const taskData: TaskWithUserData = {
      ...data,
      userId: user?.id || "",
    };
    await createdTask(taskData)
      .then(() => {
        toast.success("🎉 ¡Tarea agregada!", {
          description: `La tarea "${data.title}" ha sido creada.`,
        });
      })
      .catch((error) => {
        console.error("Error al agregar tarea:", error);
        toast.error("❌ Error al agregar la tarea", {
          description: "Por favor, inténtalo de nuevo más tarde.",
        });
      })
      .finally(() => {
        setIsAddingTask(false);
        setEditingTaskId(null);
        setEditingTaskData(undefined);
      });
  };

  // Manejar envío del formulario de editar tarea
  const handleUpdateTask = async (data: TaskFormData) => {
    if (!user?.id) {
      toast.error("❌ Error de sesión");
      return;
    }

    if (editingTaskId) {
      const taskData: TaskWithUserData = {
        ...data,
        userId: user?.id || "",
      };
      await editedTask(editingTaskId, taskData)
        .then(() => {
          toast.success("🔄 ¡Tarea actualizada!", {
            description: `Los cambios en "${data.title}" han sido guardados.`,
          });
        })
        .catch((error) => {
          console.error("Error al actualizar tarea:", error);
          toast.error("❌ Error al actualizar la tarea", {
            description: "Por favor, inténtalo de nuevo más tarde.",
          });
        })
        .finally(() => {
          setEditingTaskId(null);
          setEditingTaskData(undefined);
        });
    }
  };

  // Abrir diálogo de edición
  const handleEditTask = (taskId: string) => {
    setIsAddingTask(false);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const taskData: Partial<TaskFormData> = {
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        startDate: formatTaskDate(task.startDate),
        endDate: formatTaskDate(task.endDate),
      };
      setEditingTaskId(taskId);
      setEditingTaskData(taskData);
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskData(undefined);
  };

  // Cancelar agregar
  const handleCancelAdd = () => {
    setIsAddingTask(false);
  };

  // Manejar toggle de tarea con notificación
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await completeTask(taskId, newStatus)
        .then(() => {
          toast.success("✅ Tarea actualizada", {
            description: `La tarea "${task.title}" ha sido marcada como ${newStatus}.`,
          });
        })
        .catch((error) => {
          console.error("Error al actualizar tarea:", error);
          toast.error("❌ Error al actualizar la tarea", {
            description: "Por favor, inténtalo de nuevo más tarde.",
          });
        });
    }
  };

  // Manejar eliminación de tarea con notificación
  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      await deleteTask(taskId)
        .then(() => {
          toast.success("🗑️ Tarea eliminada", {
            description: `La tarea "${task.title}" ha sido eliminada.`,
          });
        })
        .catch((error) => {
          console.error("Error al eliminar tarea:", error);
          toast.error("❌ Error al eliminar la tarea", {
            description: "Por favor, inténtalo de nuevo más tarde.",
          });
        })
        .finally(() => {
          setEditingTaskId(null);
          setEditingTaskData(undefined);
        });
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-20 transition-colors duration-300">
      {/* Add Task Button */}
      <div className="p-6">
        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white font-semibold h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
              ✨ Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md rounded-2xl border-0 shadow-2xl bg-white dark:bg-slate-900">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                🎯 Nueva Tarea
              </DialogTitle>
            </DialogHeader>
            <TaskForm onSubmit={handleAddTask} onCancel={handleCancelAdd} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs and Task List */}
      <TaskTabs
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        tasks={tasks}
      >
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            defaultValues={
              editingTaskId === task.id ? editingTaskData : undefined
            }
            isEditing={editingTaskId === task.id}
            onToggle={() => handleToggleTask(task.id)}
            onEdit={() => handleEditTask(task.id)}
            onUpdate={handleUpdateTask}
            onDelete={() => handleDeleteTask(task.id)}
            onCancelEdit={handleCancelEdit}
          />
        ))}
      </TaskTabs>
    </div>
  );
}
