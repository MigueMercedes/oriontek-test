import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatRelative(value: string | Date): string {
  try {
    return formatDistanceToNow(toDate(value), {
      addSuffix: true,
      locale: es,
    });
  } catch {
    return "";
  }
}

export function formatDate(value: string | Date): string {
  try {
    return format(toDate(value), "d MMM yyyy", { locale: es });
  } catch {
    return "";
  }
}

export function formatDateLong(value: string | Date): string {
  try {
    return format(toDate(value), "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return "";
  }
}
