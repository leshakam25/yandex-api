'use client';

import Header from '../components/Header';
import UsersList from '../components/UsersList';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Пользователи организации
          </h1>
          
          <Alert type="info" className="mb-6">
            <div>
              <h3 className="font-medium">Требуются дополнительные разрешения</h3>
              <p className="mt-1">
                Для работы с пользователями организации необходимо настроить OAuth-приложение Яндекса:
              </p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Войдите в <a href="https://oauth.yandex.ru" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">консоль разработчика Яндекса</a></li>
                <li>В настройках приложения включите доступ "Яндекс 360 для организации: Управление организацией"</li>
                <li>Добавьте scopes <code className="bg-gray-100 px-1 rounded">directory:read</code> и <code className="bg-gray-100 px-1 rounded">directory:write</code> в <code className="bg-gray-100 px-1 rounded">API_SCOPES</code> в файле <code className="bg-gray-100 px-1 rounded">app/api/services/config.ts</code></li>
                <li>Перезапустите приложение</li>
              </ol>
            </div>
          </Alert>
          
          <p className="mb-6 text-gray-600">
            На этой странице отображаются все пользователи, зарегистрированные в вашей организации в Яндекс 360.
          </p>
          
          <UsersList />
        </div>
      </main>
    </div>
  );
} 