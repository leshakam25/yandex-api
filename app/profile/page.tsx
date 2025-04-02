'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';
import { Alert } from '../components/ui/Alert';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);
  
  // Проверяем, произошла ли ошибка из-за отсутствия прав доступа
  useEffect(() => {
    // Читаем URL, чтобы проверить, есть ли параметр ошибки
    const url = new URL(window.location.href);
    const error = url.searchParams.get('error');
    if (error === 'insufficient_permissions') {
      setShowPermissionAlert(true);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Профиль пользователя
          </h1>
          
          <Alert type="warning" className="mb-6">
            <div>
              <h3 className="font-medium">Требуются дополнительные разрешения</h3>
              <p className="mt-1">
                Для редактирования профиля необходимо настроить OAuth-приложение Яндекса:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Войдите в <a href="https://oauth.yandex.ru" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">консоль разработчика Яндекса</a></li>
                <li>В настройках приложения включите доступ "Яндекс 360 для организации: Управление организацией"</li>
                <li>Добавьте scopes <code className="bg-gray-100 px-1 rounded">directory:read</code> и <code className="bg-gray-100 px-1 rounded">directory:write</code> в <code className="bg-gray-100 px-1 rounded">app/api/services/config.ts</code></li>
                <li>Перезапустите приложение и выполните повторную авторизацию</li>
              </ol>
            </div>
          </Alert>
          
          {status === 'authenticated' ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <p className="text-gray-700 mb-4">Вы авторизованы как: {session?.user?.name || session?.user?.email}</p>
              <p className="text-gray-500 mb-4">
                Для полного доступа к функциям профиля необходимо настроить разрешения API Яндекс 360 согласно инструкции выше.
              </p>
            </div>
          ) : status === 'unauthenticated' ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-4">Для просмотра профиля необходимо войти в систему</p>
              <a
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Войти
              </a>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">Загрузка...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 