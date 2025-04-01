'use client';

import { useState } from 'react';
import { User } from '../api/services/types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { useRouter } from 'next/navigation';

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  error?: string | null;
}

export default function UsersTable({ users, isLoading = false, error = null }: UsersTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Функция для перехода к деталям пользователя
  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Проверка имени пользователя
    if (typeof user.name === 'string') {
      return user.name.toLowerCase().includes(searchLower);
    } else if (user.name) {
      // Проверка составного имени
      const fullName = `${user.name.last || ''} ${user.name.first || ''} ${user.name.middle || ''}`.trim();
      return fullName.toLowerCase().includes(searchLower);
    }
    
    // Если имени нет, проверяем email
    return user.email?.toLowerCase().includes(searchLower) || false;
  });

  // Форматирование имени пользователя для отображения
  const formatUserName = (user: User): string => {
    if (typeof user.name === 'string') {
      return user.name;
    } else if (user.name) {
      return `${user.name.last || ''} ${user.name.first || ''} ${user.name.middle || ''}`.trim();
    }
    return 'Нет данных';
  };

  return (
    <Card className="animate-fadeIn">
      <Card.Header>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Card.Title>Список пользователей</Card.Title>
          <div className="mt-2 md:mt-0">
            <input
              type="text"
              placeholder="Поиск по имени или email"
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </Card.Header>
      
      <Card.Content>
        {error && (
          <Alert type="error" className="mb-4">
            {error}
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ФИО
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Должность
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatUserName(user)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email || 'Нет данных'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.position || 'Не указана'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUserClick(user.id)}
                      >
                        Подробнее
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Пользователи не найдены' : 'Список пользователей пуст'}
          </div>
        )}
      </Card.Content>
    </Card>
  );
} 