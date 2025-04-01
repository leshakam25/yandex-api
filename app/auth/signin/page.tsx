'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn('yandex', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войти в приложение
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Для работы с API Яндекс 360 необходимо авторизоваться
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Загрузка...</span>
                ) : (
                  <>
                    <span className="mr-2">Войти через Яндекс</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Информация
                  </span>
                </div>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p>
                  Для работы с API Яндекс 360 требуются следующие разрешения:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Управление организацией</li>
                  <li>Управление пользователями</li>
                  <li>Управление группами</li>
                  <li>Управление подразделениями</li>
                  <li>Управление доменами</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 