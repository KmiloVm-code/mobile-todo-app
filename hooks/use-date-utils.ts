import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Task } from "@/types/task";

export function useDateUtils() {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-").map(Number);
    if (!year || !month || !day) return "";

    const date = new Date(year, month - 1, day);
    return format(date, "dd MMM yyyy", { locale: es });
  };

  const isOverdue = (task: Task) => {
    if (!task.endDate || task.completed) return false;

    const [year, month, day] = task.endDate.split("-").map(Number);
    if (!year || !month || !day) return false;

    const taskDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return taskDate < today;
  };

  const isDateValid = (dateString: string) => {
    if (!dateString) return false;
    const [year, month, day] = dateString.split("-").map(Number);
    return !!(year && month && day);
  };

  return {
    formatDate,
    isOverdue,
    isDateValid,
  };
}
