"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { taskFormSchema, type TaskFormData } from "@/lib/validations/task-form";
import { formatTaskDate } from "@/lib/utils/formatters";

interface TaskFormProps {
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isEdit?: boolean;
  isLoading?: boolean;
}

const userId = "32b4ad11-c821-4cb1-83e0-0d7bc9fe6e22";

export function TaskForm({
  defaultValues,
  onSubmit,
  onCancel,
  isEdit = false,
  isLoading = false,
}: TaskFormProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      userId: userId,
      title: "",
      description: "",
      startDate: formatTaskDate(new Date()) || "",
      endDate: "",
      priority: "medium",
      ...defaultValues,
    },
  });

  const priorityOptions = [
    { value: "low", label: "🟢 Baja", emoji: "🟢" },
    { value: "medium", label: "🟡 Media", emoji: "🟡" },
    { value: "high", label: "🔴 Alta", emoji: "🔴" },
    { value: "urgent", label: "🚨 Urgente", emoji: "🚨" },
  ] as const;

  const handleSubmit = (data: TaskFormData) => {
    console.log("Submitting task data:", data);
    if (isLoading) return;
    onSubmit({
      ...data,
      userId,
    });
    if (!isEdit) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 p-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                Título *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="¿Qué necesitas hacer?"
                  {...field}
                  className="border-2 border-purple-100 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl h-12 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-white dark:bg-slate-800"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                Descripción
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Agrega más detalles sobre tu tarea..."
                  {...field}
                  rows={3}
                  className="border-2 border-purple-100 dark:border-purple-800 focus:border-purple-400 dark:focus:border-purple-500 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none bg-white dark:bg-slate-800"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                🎯 Prioridad
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger className="border-2 border-orange-100 dark:border-orange-800 focus:border-orange-400 dark:focus:border-orange-500 rounded-xl h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                    <SelectValue placeholder="Selecciona la prioridad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  📅 Fecha inicio
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="border-2 border-emerald-100 dark:border-emerald-800 focus:border-emerald-400 dark:focus:border-emerald-500 rounded-xl h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  ⏰ Fecha límite
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    min={form.watch("startDate") || undefined}
                    className="border-2 border-rose-100 dark:border-rose-800 focus:border-rose-400 dark:focus:border-rose-500 rounded-xl h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white font-semibold h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : isEdit ? "✨ Actualizar" : "🚀 Crear"} Tarea
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold h-12 rounded-xl bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
