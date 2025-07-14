"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { TaskForm } from "./task-form";
import type {
  TaskFormData,
  TaskWithUserData,
} from "@/lib/validations/task-form";
import { toast } from "sonner";
import { createdTask } from "@/lib/queries/actions";
import { useState } from "react";

interface AddTaskDialogProps {
  user?: string;
}

export function AddTaskDialog({ user }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);

  const handleAddTask = async (data: TaskFormData) => {
    if (!user) {
      toast.error("❌ Error de sesión", {
        description: "No se pudo identificar al usuario.",
      });
      return;
    }

    const taskData: TaskWithUserData = {
      ...data,
      userId: user || "",
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
        setOpen(false);
      });
  };

  const handleCancelAdd = () => {
    setOpen(false);
  };

  return (
    <div className="p-6">
      <Dialog
        open={open}
        onOpenChange={setOpen}
        aria-label="Agregar nueva tarea"
      >
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white font-semibold h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
            ✨ Nueva Tarea
          </Button>
        </DialogTrigger>
        <DialogContent
          className="w-[95vw] max-w-md rounded-2xl border-0 shadow-2xl bg-white dark:bg-slate-900"
          aria-describedby="add-task-dialog-description"
        >
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              🎯 Nueva Tarea
            </DialogTitle>
          </DialogHeader>
          <p
            id="add-task-dialog-description"
            className="text-slate-500 dark:text-slate-400 text-sm mb-2"
          >
            Crea una nueva tarea para organizar tu día.
          </p>
          <TaskForm onSubmit={handleAddTask} onCancel={handleCancelAdd} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
