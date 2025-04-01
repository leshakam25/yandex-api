import Header from './components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Работа с API Яндекс 360
          </h2>
          <p className="mb-6 text-gray-600">
            Это приложение демонстрирует возможности API Яндекс 360 для управления корпоративными сервисами.
          </p>
          
          <div className="bg-white p-6 shadow-sm rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Доступные функции</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Управление профилем</h4>
                <p className="text-sm text-blue-700 mb-4">
                  Просмотр и редактирование своего профиля, включая изменение имени
                </p>
                <a 
                  href="/profile" 
                  className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  Перейти к профилю →
                </a>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Пользователи организации</h4>
                <p className="text-sm text-purple-700 mb-4">
                  Просмотр списка всех пользователей, зарегистрированных в вашей организации Яндекс 360
                </p>
                <a 
                  href="/users" 
                  className="inline-flex items-center text-sm font-medium text-purple-700 hover:text-purple-900"
                >
                  Список пользователей →
                </a>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">О проекте</h4>
                <p className="text-sm text-green-700 mb-4">
                  Технические детали и информация о реализации проекта
                </p>
                <a 
                  href="https://github.com/yourusername/yandex-api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900"
                >
                  Исходный код →
                </a>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">API Документация</h4>
                <p className="text-sm text-purple-700 mb-4">
                  Официальная документация по API Яндекс 360
                </p>
                <a 
                  href="https://yandex.ru/dev/api360/doc/ru/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-purple-700 hover:text-purple-900"
                >
                  Открыть документацию →
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Как начать работу</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>Авторизуйтесь через Яндекс, нажав на кнопку "Войти" в правом верхнем углу</li>
              <li>После авторизации вы сможете перейти в свой профиль</li>
              <li>В профиле вы можете просмотреть свои данные и отредактировать имя</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}
