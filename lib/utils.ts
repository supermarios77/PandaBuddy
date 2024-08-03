import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizeAnswer = (answer: string) => {
  return answer
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .sort()
    .join(' ');
};