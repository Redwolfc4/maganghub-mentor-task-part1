import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string.
 * Merges Tailwind CSS classes to handle conflicts correctly.
 * 
 * @param inputs - A list of class names or conditional class objects.
 * @returns A merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
