"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/types/task";
import { TaskCard } from "./task-card";
import { TaskFormData, TaskWithUserData } from "@/lib/validations";
import { useState } from "react";
import { completeTask, deleteTask, editedTask } from "@/lib/queries/actions";
import { formatTaskDate } from "@/lib/utils/formatters";
import { toast } from "sonner";

interface TaskTabsProps {
  tasks: Task[];
  user?: string;
}

export function TaskTabs({ tasks, user }: TaskTabsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<
    Partial<TaskFormData> | undefined
  >(undefined);

  const pendingCount = tasks.filter((t) => t.status !== "completed").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const getFilteredTasks = () => {
    switch (activeTab) {
      case "pending":
        return tasks.filter((t) => t.status !== "completed");
      case "completed":
        return tasks.filter((t) => t.status === "completed");
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!user) {
      toast.error("❌ Error de sesión");
      return;
    }

    if (editingTaskId) {
      const taskData: TaskWithUserData = {
        ...data,
        userId: user || "",
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

  const tabConfigs = [
    {
      value: "all",
      label: "Todas",
      emoji: "📝",
      title: "¡Comienza tu día productivo!",
      message: "Agrega tu primera tarea y organiza tu tiempo",
      gradient:
        "data-[state=active]:from-purple-500 data-[state=active]:to-pink-500",
    },
    {
      value: "pending",
      label: "Pendientes",
      emoji: "⏳",
      title: "No hay tareas pendientes",
      message: "¡Genial! No tienes tareas pendientes por hacer",
      gradient:
        "data-[state=active]:from-amber-400 data-[state=active]:to-orange-500",
    },
    {
      value: "completed",
      label: "Hechas",
      emoji: "🎉",
      title: "¡Buen trabajo!",
      message: "Has completado todas tus tareas pendientes",
      gradient:
        "data-[state=active]:from-emerald-400 data-[state=active]:to-teal-500",
    },
  ];

  const getEmptyStateContent = () => {
    return (
      tabConfigs.find((config) => config.value === activeTab) || tabConfigs[0]
    );
  };

  return (
    <div className="flex flex-col px-5 sm:px-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
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
                  {tab.value === "all"
                    ? tasks.length
                    : tab.value === "pending"
                    ? pendingCount
                    : completedCount}
                </small>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="border-0 shadow-lg rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-4xl mb-4">
                  <span role="img" aria-label={getEmptyStateContent()?.emoji}>
                    {getEmptyStateContent()?.emoji}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  {getEmptyStateContent()?.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {getEmptyStateContent()?.message}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
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
  );
}
