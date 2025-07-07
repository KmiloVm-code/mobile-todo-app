import { useMemo } from "react";
import type { TaskFormData } from "@/types/task";

export function useTaskValidation(formData: TaskFormData) {
  const validation = useMemo(() => {
    const errors: Partial<Record<keyof TaskFormData, string>> = {};
    let isValid = true;

    // Validar título
    if (!formData.title.trim()) {
      errors.title = "El título es requerido";
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      errors.title = "El título debe tener al menos 3 caracteres";
      isValid = false;
    } else if (formData.title.trim().length > 100) {
      errors.title = "El título no puede exceder los 100 caracteres";
      isValid = false;
    }

    // Validar descripción
    if (formData.description && formData.description.length > 500) {
      errors.description = "La descripción no puede exceder los 500 caracteres";
      isValid = false;
    }

    // Validar fechas
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        errors.endDate = "La fecha límite no puede ser anterior a la fecha de inicio";
        isValid = false;
      }
    }

    // Validar fecha límite no esté en el pasado
    if (formData.endDate) {
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (endDate < today) {
        errors.endDate = "La fecha límite no puede estar en el pasado";
        isValid = false;
      }
    }

    return {
      isValid,
      errors,
      hasErrors: Object.keys(errors).length > 0,
    };
  }, [formData]);

  return validation;
}
