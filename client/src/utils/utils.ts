import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { atom } from 'jotai'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const textAtom = atom('hello world')