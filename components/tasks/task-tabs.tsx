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
            children
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
