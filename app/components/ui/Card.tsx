'use client';

import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

// Интерфейсы для компонентов карточки
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  className?: string;
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Компонент карточки для единообразного отображения контента
 */
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Компонент для заголовка карточки
Card.Header = function CardHeader({ 
  className,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('p-6 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Компонент для заголовка карточки
Card.Title = function CardTitle({
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <h3
      className={cn('text-xl font-semibold text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

// Компонент для описания карточки
Card.Description = function CardDescription({
  className,
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-gray-500 mt-1', className)}
      {...props}
    >
      {children}
    </p>
  );
};

// Компонент для содержимого карточки
Card.Content = function CardContent({
  className,
  children,
  ...props
}: CardContentProps) {
  return (
    <div
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Компонент для футера карточки
Card.Footer = function CardFooter({
  className,
  children,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}; 