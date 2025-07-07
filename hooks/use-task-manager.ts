import { useState, useCallback } from "react";
import type { Task } from "@/types/task";
import type { TaskFormData } from "@/lib/validations/task-form";

export interface UseTaskManagerReturn {
  // State
  tasks: Task[];
  isAddingTask: boolean;
  setIsAddingTask: (value: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  formData: TaskFormData;
  setFormData: (data: TaskFormData) => void;
  
  // Actions
  addTask: () => void;
  updateTask: () => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  openEditDialog: (task: Task) => void;
  cancelEdit: () => void;
  cancelAdd: () => void;
  resetForm: () => void;
  getFilteredTasks: (filter: string) => Task[];
  
  // Statistics
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

export function useTaskManager(initialTasks: Task[] = []): UseTaskManagerReturn {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: undefined,
    startDate: undefined,
    endDate: undefined,
    priority: "medium",
  });

  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: undefined,
      startDate: undefined,
      endDate: undefined,
      priority: "medium",
    });
  }, []);

  const addTask = useCallback(() => {
    if (!formData.title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      completed: false,
      status: "pending",
      priority: formData.priority || "medium",
      userId: "1", // En una app real, esto vendría del contexto de usuario
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    resetForm();
    setIsAddingTask(false);
  }, [formData, resetForm]);

  const updateTask = useCallback(() => {
    if (!editingTask || !formData.title.trim()) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editingTask.id 
          ? { ...task, ...formData, updatedAt: new Date().toISOString() } 
          : task
      )
    );
    resetForm();
    setEditingTask(null);
  }, [editingTask, formData, resetForm]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id 
          ? { 
              ...task, 
              completed: !task.completed,
              status: !task.completed ? 'completed' : 'pending',
              updatedAt: new Date().toISOString()
            } 
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }, []);

  const openEditDialog = useCallback((task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || undefined,
      startDate: task.startDate || undefined,
      endDate: task.endDate || undefined,
      priority: task.priority,
    });
  }, []);

  const cancelEdit = useCallback(() => {
    resetForm();
    setEditingTask(null);
  }, [resetForm]);

  const cancelAdd = useCallback(() => {
    resetForm();
    setIsAddingTask(false);
  }, [resetForm]);

  const getFilteredTasks = useCallback((filter: string) => {
    switch (filter) {
      case "pending":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks]);

  // Estadísticas calculadas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return {
    // State
    tasks,
    isAddingTask,
    setIsAddingTask,
    editingTask,
    setEditingTask,
    formData,
    setFormData,
    
    // Actions
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    openEditDialog,
    cancelEdit,
    cancelAdd,
    resetForm,
    getFilteredTasks,
    
    // Statistics
    totalTasks,
    completedTasks,
    pendingTasks,
  };
}
