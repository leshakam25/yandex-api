'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import yandexApiService from '../api/services/yandexApi';

// Интерфейс для элемента пагинации
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Компонент пагинации
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Функция для создания массива страниц вокруг текущей
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Максимальное количество видимых страниц
    
    // Если страниц меньше или равно максимальному количеству видимых
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Вычисляем диапазон видимых страниц вокруг текущей
      const leftBound = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);
      
      // Если правая граница упирается в конец
      if (rightBound === totalPages) {
        for (let i = Math.max(1, totalPages - maxVisiblePages + 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Обычный случай
        for (let i = leftBound; i <= rightBound; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <nav className="flex items-center space-x-1">
        {/* Кнопка "Предыдущая" */}
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Перейти на предыдущую страницу"
        >
          «
        </button>
        
        {/* Номера страниц */}
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded text-sm font-medium ${
              currentPage === page 
              ? 'bg-blue-600 text-white' 
              : 'border hover:bg-gray-50'
            }`}
            aria-label={`Страница ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        {/* Кнопка "Следующая" */}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Перейти на следующую страницу"
        >
          »
        </button>
      </nav>
    </div>
  );
};

// Основной компонент списка пользователей
export default function UsersList() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; details: string } | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Обновленная функция fetchUsers для поддержки параметра perPage
  const fetchUsers = async (page: number = 1, itemsPerPage: number = perPage) => {
    if (status !== 'authenticated' || !session?.accessToken) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Устанавливаем токен для API запросов
      yandexApiService.setToken(session.accessToken);
      
      // Получаем список пользователей с учетом пагинации
      // Убеждаемся, что передаем числовые параметры
      const response = await yandexApiService.getUsers(
        Number(page), 
        Number(itemsPerPage)
      );
      console.log('Получен список пользователей:', response);
      
      // Обновляем состояние
      setUsers(response.users || []);
      
      // Обрабатываем ответ в соответствии с форматом API Яндекс 360
      // API возвращает total, page и per_page
      setTotalUsers(response.total || 0);
      setCurrentPage(response.page || page);
      
      // Вычисляем общее количество страниц на основе total и per_page
      // API может возвращать per_page вместо perPage
      const itemsPerPageResponse = response.per_page || response.perPage || itemsPerPage;
      setTotalPages(Math.ceil((response.total || 0) / itemsPerPageResponse));
      
      // Проверяем режим работы
      if (response._warning) {
        setWarning(response._warning);
        setIsDemoMode(true);
      } else {
        setWarning(null);
        setIsDemoMode(false);
      }
    } catch (err: any) {
      console.error('Ошибка при получении списка пользователей:', err);
      
      // Проверяем наличие детальной информации об ошибке
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.error) {
          setError({
            message: errorData.error,
            details: errorData.details || '',
          });
        } else {
          setError({
            message: 'Ошибка при получении списка пользователей',
            details: err.message,
          });
        }
      } else {
        setError({
          message: 'Ошибка при получении списка пользователей',
          details: err.message,
        });
      }
      
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка пользователей при монтировании компонента или изменении токена
  useEffect(() => {
    if (session?.accessToken) {
      fetchUsers(currentPage, perPage);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken]);

  // Обработчик изменения страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  // Обработчик изменения количества элементов на странице
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении perPage
    fetchUsers(1, newPerPage);
  };

  // Отображаем индикатор загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <p className="text-gray-500">Загрузка списка пользователей...</p>
        </div>
      </div>
    );
  }

  // Отображаем сообщение, если пользователь не авторизован
  if (status === 'unauthenticated') {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Для просмотра списка пользователей необходимо авторизоваться</h2>
        <Link 
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Войти в систему
        </Link>
      </div>
    );
  }

  // Отображаем сообщение об ошибке
  if (error) {
    // Проверяем, связана ли ошибка с ID организации
    const isBadRequestOrgIdError = error.message.includes('Неверный формат запроса') || 
                                  error.message.includes('ID организации') ||
                                  (error.details && error.details.includes('ORG_ID'));
    
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Ошибка при загрузке пользователей</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error.message}</p>
                  {error.details && (
                    <p className="mt-1">{error.details}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {isBadRequestOrgIdError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <svg className="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Возможное решение</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Похоже, не настроен корректный ID организации. Выполните следующие шаги:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Запустите скрипт настройки командой: <code className="bg-gray-100 px-1 py-0.5 rounded">./setup-env.ps1</code></li>
                      <li>Укажите корректный ID вашей организации Яндекс 360</li>
                      <li>Перезапустите приложение: <code className="bg-gray-100 px-1 py-0.5 rounded">./start.ps1</code></li>
                    </ol>
                    <p className="mt-2">Инструкция по получению ID организации доступна в README.md</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Не удалось загрузить список пользователей. Пожалуйста, проверьте настройки подключения к API Яндекс 360.
            </p>
            <button
              onClick={() => fetchUsers(currentPage, perPage)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Повторить запрос
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Показываем предупреждение о демо-режиме */}
      {isDemoMode && warning && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Демо-режим</h3>
              <p className="text-sm text-blue-700 mt-1">{warning}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Информация о количестве пользователей */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Пользователи организации</h2>
            <p className="text-sm text-gray-500">
              Всего пользователей: {totalUsers}, Страница {currentPage} из {totalPages}
            </p>
          </div>
          
          <div className="mt-3 sm:mt-0 flex items-center">
            <label htmlFor="per-page-select" className="mr-2 text-sm text-gray-700">
              Показывать по:
            </label>
            <select
              id="per-page-select"
              value={perPage}
              onChange={handlePerPageChange}
              className="block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Таблица пользователей */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Пользователи не найдены</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Должность
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  // Формируем полное имя
                  const fullName = user.name
                    ? typeof user.name === 'string'
                      ? user.name
                      : `${user.name.last || ''} ${user.name.first || ''} ${user.name.middle || ''}`.trim()
                    : 'Нет данных';
                  
                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={user.avatar}
                                alt={fullName}
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                  {(user.name?.first?.[0] || '') + (user.name?.last?.[0] || '')}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.nickname || user.login || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.position || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isDismissed 
                            ? 'bg-red-100 text-red-800' 
                            : user.isAdmin 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.isDismissed ? 'Уволен' : user.isAdmin ? 'Администратор' : 'Активен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Link 
                          href={`/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Подробнее
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Пагинация */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
} 