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

export const colorArray = [
  '#FF6633',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
];
