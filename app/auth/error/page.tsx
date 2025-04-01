'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  let errorMessage = 'Произошла ошибка при авторизации';
  
  if (error === 'AccessDenied') {
    errorMessage = 'Доступ запрещен. Возможно, вы отказались от предоставления необходимых прав.';
  } else if (error === 'Configuration') {
    errorMessage = 'Ошибка конфигурации. Проверьте настройки приложения.';
  } else if (error) {
    errorMessage = `Ошибка авторизации: ${error}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Ошибка авторизации
          </h2>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 