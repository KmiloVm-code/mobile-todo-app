"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@/types/task";

interface TaskTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasks: Task[];
  children: React.ReactNode;
}

export function TaskTabs({
  activeTab,
  setActiveTab,
  tasks,
  children,
}: TaskTabsProps) {
  const pendingCount = tasks.filter((t) => t.status !== "completed").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const getEmptyStateContent = () => {
    const configs = {
      all: {
        emoji: "📝",
        message: "¡Comienza agregando tu primera tarea!",
      },
      pending: {
        emoji: "⏳",
        message: "¡Genial! No tienes tareas pendientes",
      },
      completed: {
        emoji: "🎉",
        message: "Aún no has completado ninguna tarea",
      },
    };

    return configs[activeTab as keyof typeof configs] || configs.all;
  };

  return (
    <div className="px-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full h-full grid-cols-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-purple-100 dark:border-slate-700">
          <TabsTrigger
            value="all"
            className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 dark:text-slate-300"
          >
            <div className="flex flex-col sm:flex items-center">
              <span className="flex items-center gap-1">
                <span role="img" aria-label="Todas las tareas">
                  📋
                </span>
                Todas
              </span>
              <span
                className="text-xs text-slate-500 dark:text-slate-400"
                aria-label={`Total: ${tasks.length} tareas`}
              >
                ({tasks.length})
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 dark:text-slate-300"
          >
            <div className="flex flex-col sm:flex items-center">
              <span className="flex items-center gap-1">
                <span role="img" aria-label="Tareas pendientes">
                  ⏳
                </span>
                Pendientes
              </span>
              <span
                className="text-xs text-slate-500 dark:text-slate-400"
                aria-label={`Pendientes: ${pendingCount} tareas`}
              >
                ({pendingCount})
              </span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-xl font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 dark:text-slate-300"
          >
            <div className="flex flex-col sm:flex items-center">
              <span className="flex items-center gap-1">
                <span role="img" aria-label="Tareas completadas">
                  🎉
                </span>
                Completadas
              </span>
              <span
                className="text-xs text-slate-500 dark:text-slate-400"
                aria-label={`Completadas: ${completedCount} tareas`}
              >
                ({completedCount})
              </span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-4">
          {tasks.length === 0 ? (
            <Card className="border-0 shadow-lg rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">
                  {getEmptyStateContent().emoji}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                  {getEmptyStateContent().message}
                </div>
              </CardContent>
            </Card>
          ) : (
            children
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
