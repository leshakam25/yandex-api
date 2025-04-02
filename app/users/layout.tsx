import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Пользователи | Яндекс API Прокси',
  description: 'Список пользователей, зарегистрированных в вашей организации Яндекс 360',
};

export default function UsersLayout({ children }: { children: ReactNode }) {
  return children;
} 