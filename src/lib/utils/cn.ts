import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Gộp class Tailwind, tránh xung đột
export function cn(...cacLop: ClassValue[]) {
  return twMerge(clsx(cacLop));
}