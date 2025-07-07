"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useTasks } from "@/hooks/use-tasks";
import { TaskHeader, TaskForm, TaskCard, TaskTabs } from "@/components/tasks";
import type { TaskFormData } from "@/lib/validations/task-form";

export function TodoApp() {
  const { user } = useAuth();

  // Usar el hook existente para manejar las tareas
  const taskManager = useTasks();

  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">(
    (user?.preferences?.defaultView as "all" | "pending" | "completed") || "all"
  );

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
        return taskManager.tasks.filter((task) => !task.completed);
      case "completed":
        return taskManager.tasks.filter((task) => task.completed);
      default:
        return taskManager.tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const pendingTasksCount = taskManager.pendingTasks;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "all" | "pending" | "completed");
  };

  // Manejar envío del formulario de agregar tarea
  const handleAddTask = (data: TaskFormData) => {
    taskManager.addTask(data);
    setIsAddingTask(false);
    toast.success("✨ ¡Tarea creada exitosamente!", {
      description: `"${data.title}" ha sido agregada a tu lista de tareas.`,
    });
  };

  // Manejar envío del formulario de editar tarea
  const handleUpdateTask = (data: TaskFormData) => {
    if (editingTaskId) {
      taskManager.updateTask(editingTaskId, data);
      setEditingTaskId(null);
      setEditingTaskData(undefined);
      toast.success("🔄 ¡Tarea actualizada!", {
        description: `Los cambios en "${data.title}" han sido guardados.`,
      });
    }
  };

  // Abrir diálogo de edición
  const handleEditTask = (taskId: string) => {
    const task = taskManager.tasks.find((t) => t.id === taskId);
    if (task) {
      const taskData: Partial<TaskFormData> = {
        title: task.title,
        description: task.description,
        startDate: task.startDate,
        endDate: task.endDate,
        priority: task.priority, // Ya es compatible
      };
      setEditingTaskData(taskData);
      setEditingTaskId(taskId);
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
  const handleToggleTask = (taskId: string) => {
    const task = taskManager.tasks.find((t) => t.id === taskId);
    if (task) {
      taskManager.toggleTask(taskId);
      if (task.completed) {
        toast.info("🔄 Tarea marcada como pendiente", {
          description: `"${task.title}" está de vuelta en tu lista de pendientes.`,
        });
      } else {
        toast.success("🎉 ¡Tarea completada!", {
          description: `¡Felicidades! Has completado "${task.title}".`,
        });
      }
    }
  };

  // Manejar eliminación de tarea con notificación
  const handleDeleteTask = (taskId: string) => {
    const task = taskManager.tasks.find((t) => t.id === taskId);
    if (task) {
      taskManager.deleteTask(taskId);
      toast.error("🗑️ Tarea eliminada", {
        description: `"${task.title}" ha sido eliminada de tu lista.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pb-20 transition-colors duration-300">
      {/* Header */}
      <TaskHeader user={user} pendingTasksCount={pendingTasksCount} />

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
        tasks={taskManager.tasks}
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
