import { Metadata } from 'next';
import Header from '../../components/Header';
import { Card } from '../../components/ui/Card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Развертывание | Яндекс API Прокси',
  description: 'Инструкция по развертыванию приложения Яндекс API Прокси',
};

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link href="/docs" className="text-blue-600 hover:text-blue-800 mr-2">
            &larr; Назад к документации
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Развертывание приложения</h1>
        
        <div className="space-y-8">
          <Card>
            <Card.Header>
              <Card.Title>Развертывание на локальном сервере</Card.Title>
              <Card.Description>Инструкция по запуску приложения на локальном сервере</Card.Description>
            </Card.Header>
            <Card.Content>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <h3 className="font-semibold">Установите Node.js</h3>
                  <p className="text-gray-600 mt-1">Скачайте и установите Node.js версии 18 или выше с <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">официального сайта</a>.</p>
                </li>
                
                <li>
                  <h3 className="font-semibold">Клонируйте репозиторий</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mt-2">
                    <code>git clone [URL репозитория] yandex-api</code>
                  </pre>
                </li>
                
                <li>
                  <h3 className="font-semibold">Установите зависимости</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mt-2">
                    <code>cd yandex-api
npm install</code>
                  </pre>
                </li>
                
                <li>
                  <h3 className="font-semibold">Настройте переменные окружения</h3>
                  <p className="text-gray-600 mt-1">Создайте файл <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> в корне проекта или используйте скрипт <code className="bg-gray-100 px-1 py-0.5 rounded">setup-env.ps1</code>.</p>
                </li>
                
                <li>
                  <h3 className="font-semibold">Запустите приложение в режиме разработки</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mt-2">
                    <code>npm run dev</code>
                  </pre>
                  <p className="text-gray-600 mt-2">или используйте скрипт <code className="bg-gray-100 px-1 py-0.5 rounded">start.ps1</code>.</p>
                </li>
              </ol>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <Card.Title>Сборка для production</Card.Title>
              <Card.Description>Сборка и запуск приложения в production-режиме</Card.Description>
            </Card.Header>
            <Card.Content>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <h3 className="font-semibold">Соберите приложение</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mt-2">
                    <code>npm run build</code>
                  </pre>
                </li>
                
                <li>
                  <h3 className="font-semibold">Запустите production-версию</h3>
                  <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mt-2">
                    <code>npm start</code>
                  </pre>
                </li>
              </ol>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Важно</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Для production-окружения необходимо настроить все переменные окружения в файле <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> или на платформе, где будет размещено приложение.
                    </p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <Card.Title>Развертывание на Vercel</Card.Title>
              <Card.Description>Инструкция по размещению приложения на платформе Vercel</Card.Description>
            </Card.Header>
            <Card.Content>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <h3 className="font-semibold">Создайте аккаунт на Vercel</h3>
                  <p className="text-gray-600 mt-1">Зарегистрируйтесь на <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel</a> и подключите свой GitHub/GitLab/Bitbucket аккаунт.</p>
                </li>
                
                <li>
                  <h3 className="font-semibold">Импортируйте репозиторий</h3>
                  <p className="text-gray-600 mt-1">На дашборде Vercel нажмите "Import Project" и выберите репозиторий с приложением.</p>
                </li>
                
                <li>
                  <h3 className="font-semibold">Настройте переменные окружения</h3>
                  <p className="text-gray-600 mt-1">В настройках проекта на Vercel добавьте все необходимые переменные окружения:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>ORG_ID</li>
                    <li>NEXTAUTH_URL (URL вашего приложения)</li>
                    <li>NEXTAUTH_SECRET</li>
                    <li>NEXT_PUBLIC_YANDEX_CLIENT_ID</li>
                    <li>YANDEX_CLIENT_SECRET</li>
                    <li>NEXT_PUBLIC_REDIRECT_URI</li>
                  </ul>
                </li>
                
                <li>
                  <h3 className="font-semibold">Разверните приложение</h3>
                  <p className="text-gray-600 mt-1">Нажмите "Deploy" и дождитесь завершения процесса сборки и развертывания.</p>
                </li>
              </ol>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Совет</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Для значения NEXTAUTH_URL и NEXT_PUBLIC_REDIRECT_URI используйте конечный URL вашего развернутого приложения (например, https://your-app.vercel.app).
                    </p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <Card.Title>Настройка Яндекс OAuth</Card.Title>
              <Card.Description>Настройка приложения в Яндекс OAuth для корректной авторизации</Card.Description>
            </Card.Header>
            <Card.Content>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  <h3 className="font-semibold">Зарегистрируйте приложение в Яндекс OAuth</h3>
                  <p className="text-gray-600 mt-1">Перейдите на <a href="https://oauth.yandex.ru/client/new" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">страницу регистрации приложения</a> и заполните форму:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Название: придумайте название для приложения</li>
                    <li>Платформа: Веб-сервисы</li>
                    <li>Callback URI: URL вашего приложения + путь /api/auth/callback/yandex (например, http://localhost:3000/api/auth/callback/yandex)</li>
                    <li>Права: выберите "Яндекс 360 для организации: Управление организацией"</li>
                  </ul>
                </li>
                
                <li>
                  <h3 className="font-semibold">Получите ID и секрет приложения</h3>
                  <p className="text-gray-600 mt-1">После регистрации приложения вы получите ClientID и Client Secret, которые нужно добавить в переменные окружения:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>NEXT_PUBLIC_YANDEX_CLIENT_ID — ID приложения</li>
                    <li>YANDEX_CLIENT_SECRET — секрет приложения</li>
                  </ul>
                </li>
              </ol>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Важно</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Храните Client Secret в секрете и никогда не публикуйте его в репозитории. Используйте переменные окружения для хранения секретных данных.
                    </p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
} 