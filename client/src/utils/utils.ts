import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { atom } from 'jotai';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const textAtom = atom('hello world');

export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};
