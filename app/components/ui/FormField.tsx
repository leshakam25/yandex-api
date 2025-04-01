'use client';

import { forwardRef, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

// Интерфейс для компонента FormField
export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  label?: ReactNode;
  error?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
  hint?: string;
}

// Интерфейс для компонента Input
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/**
 * Компонент поля формы с меткой и сообщением об ошибке
 */
export function FormField({
  id,
  label,
  error,
  children,
  required = false,
  className,
  hint,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fadeIn">{error}</p>
      )}
    </div>
  );
}

/**
 * Компонент текстового поля для формы
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
        error
          ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300',
        className
      )}
      {...props}
    />
  )
);

Input.displayName = 'Input'; 