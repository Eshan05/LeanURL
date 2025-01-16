import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getCookie as getCookieNext } from 'cookies-next';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAuthToken = (): string | undefined => {
  return getCookieNext('authToken') as string | undefined;
};