'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          <Link href="/" className="hover:text-gray-600 transition-colors">
            Яндекс 360 API
          </Link>
        </h1>
        <div className="flex space-x-4 items-center">
          <Link 
            href="/users"
            className="text-gray-600 hover:text-gray-900"
          >
            Пользователи
          </Link>
          
          <Link 
            href="/docs"
            className="text-blue-600 hover:text-blue-800"
          >
            Документация
          </Link>
          
          {status === 'authenticated' ? (
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Профиль
            </Link>
          ) : status === 'unauthenticated' ? (
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Войти
            </Link>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Загрузка...
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 