import { Metadata } from 'next';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Документация | Яндекс API Прокси',
  description: 'Документация по работе с Яндекс API Прокси',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Документация</h1>
        
        <div className="space-y-8">
          <Card>
            <Card.Header>
              <Card.Title>Настройка переменных окружения</Card.Title>
              <Card.Description>Для корректной работы приложения необходимо настроить переменные окружения</Card.Description>
            </Card.Header>
            <Card.Content>
              <h3 className="text-lg font-semibold mb-3">Файл .env.local</h3>
              <p className="mb-4">Создайте файл <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code> в корне проекта со следующими переменными:</p>
              
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-6">
                <code>
{`# ID организации в Яндекс 360
ORG_ID=your_organization_id

# NextAuth.js настройки
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Яндекс OAuth настройки
NEXT_PUBLIC_YANDEX_CLIENT_ID=your_client_id
YANDEX_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback/yandex`}
                </code>
              </pre>
              
              <h3 className="text-lg font-semibold mb-3">Использование скрипта setup-env.ps1</h3>
              <p className="mb-4">Для упрощения настройки вы можете воспользоваться скриптом <code className="bg-gray-100 px-1 py-0.5 rounded">setup-env.ps1</code>:</p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Запуск скрипта</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Откройте PowerShell и выполните команду:
                    </p>
                    <pre className="bg-yellow-100 mt-2 p-2 rounded text-sm">
                      <code>.\setup-env.ps1</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <Card.Title>Получение ID организации Яндекс 360</Card.Title>
              <Card.Description>Инструкция по получению ID вашей организации</Card.Description>
            </Card.Header>
            <Card.Content>
              <h3 className="text-lg font-semibold mb-3">Из URL административной панели</h3>
              <ol className="list-decimal pl-5 mb-6 space-y-2">
                <li>Войдите в административную панель Яндекс 360: <a href="https://admin.yandex.ru/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://admin.yandex.ru/</a></li>
                <li>Перейдите в раздел "Профиль организации"</li>
                <li>В URL будет содержаться ID организации: <code className="bg-gray-100 px-1 py-0.5 rounded">https://admin.yandex.ru/company/{'{'}<span>ID_ORGANIZATION</span>{'}'}/profile</code></li>
                <li>Скопируйте числовое значение ID</li>
              </ol>
              
              <h3 className="text-lg font-semibold mb-3">Через API Яндекс 360</h3>
              <p className="mb-4">Если у вас есть токен с правами <code className="bg-gray-100 px-1 py-0.5 rounded">directory:read</code>, вы можете получить ID организации через API:</p>
              
              <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-6">
                <code>
{`curl -X GET \
  https://api360.yandex.net/directory/v1/org \
  -H 'Authorization: OAuth YOUR_TOKEN'`}
                </code>
              </pre>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <Card.Title>Устранение неполадок</Card.Title>
              <Card.Description>Решение распространенных проблем</Card.Description>
            </Card.Header>
            <Card.Content>
              <h3 className="text-lg font-semibold mb-3">Ошибка 400 Bad Request при загрузке пользователей</h3>
              <p className="mb-4">Если вы видите ошибку 400 Bad Request при загрузке списка пользователей, проверьте:</p>
              
              <ol className="list-disc pl-5 mb-6 space-y-2">
                <li>ID организации установлен правильно в файле <code className="bg-gray-100 px-1 py-0.5 rounded">.env.local</code></li>
                <li>Токен OAuth имеет право <code className="bg-gray-100 px-1 py-0.5 rounded">directory:read</code></li>
                <li>Приложение запущено с корректными переменными окружения</li>
                <li>Ваш аккаунт имеет доступ к Яндекс 360 для бизнеса</li>
              </ol>
              
              <h3 className="text-lg font-semibold mb-3">Ошибка CORS при работе с API</h3>
              <p className="mb-4">В данном приложении используется прокси-сервер для обхода ограничений CORS. Если вы видите ошибки CORS, убедитесь, что запросы идут через прокси-эндпоинты (<code className="bg-gray-100 px-1 py-0.5 rounded">/api/proxy/*</code>), а не напрямую к API Яндекса.</p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Header>
              <Card.Title>Дополнительные ресурсы</Card.Title>
              <Card.Description>Полезные ссылки и документация</Card.Description>
            </Card.Header>
            <Card.Content>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/docs/deploy" 
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 16.5V5.5H1.5l7-7 7 7h-4v11h-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Инструкция по развертыванию
                  </Link>
                </li>
                
                <li>
                  <a 
                    href="https://yandex.ru/dev/api360/doc/ru/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.25 3A1.25 1.25 0 003 4.25v11.5A1.25 1.25 0 004.25 17h11.5A1.25 1.25 0 0017 15.75V4.25A1.25 1.25 0 0015.75 3H4.25zM5 8h10V6H5v2zm0 3h10V9H5v2zm0 3h10v-2H5v2z" clipRule="evenodd" />
                    </svg>
                    Официальная документация API Яндекс 360
                  </a>
                </li>
                <li>
                  <a 
                    href="https://oauth.yandex.ru/client/new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.5 2a1.5 1.5 0 00-1.5 1.5v1H3.75A2.75 2.75 0 001 7.75v8.5A2.75 2.75 0 003.75 19h12.5A2.75 2.75 0 0019 16.25v-8.5A2.75 2.75 0 0016.25 5H15v-1.5A1.5 1.5 0 0013.5 2h-7zM12 5h-4V3.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V5zm-2 8.75A2.75 2.75 0 117 9.95 2.75 2.75 0 0110 12.25z" clipRule="evenodd" />
                    </svg>
                    Регистрация приложения в OAuth Яндекс
                  </a>
                </li>
                <li>
                  <a 
                    href="https://nextjs.org/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Документация Next.js
                  </a>
                </li>
              </ul>
            </Card.Content>
          </Card>
        </div>
      </main>
    </div>
  );
}