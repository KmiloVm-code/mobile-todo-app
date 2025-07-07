"use client";

import { Badge } from "@/components/ui/badge";
import UserMenu from "@/components/layout/user-menu";
import type { User } from "@/types/auth";

interface TaskHeaderProps {
  user: User | null;
  pendingTasksCount: number;
}

export function TaskHeader({ user, pendingTasksCount }: TaskHeaderProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-purple-100 dark:border-slate-700 sticky top-0 z-10 shadow-sm transition-colors duration-300">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              ✨ Mis Tareas
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 truncate">
              {user
                ? `¡Hola ${user.name.split(" ")[0]}! 👋`
                : "Organiza tu día de manera inteligente"}
            </p>
          </div>
          <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap"
            >
              {pendingTasksCount} pendientes
            </Badge>
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
