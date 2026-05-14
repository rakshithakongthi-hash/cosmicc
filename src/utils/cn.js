import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx.
 * Handles conditional classes and deduplication.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
