import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * ShadCn`s util 
 */ 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
