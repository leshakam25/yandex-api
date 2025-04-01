'use client';

import { User } from '../api/services/types';
import UserCard from './UserCard';

// Моковые данные для демонстрации
const mockUser: User = {
  id: 'demo-user-123',
  email: 'user@example.com',
  nickname: 'demouser',
  name: {
    first: 'Иван',
    last: 'Иванов',
    middle: 'Иванович'
  },
  position: 'Разработчик',
  is_admin: false,
  is_dismissed: false,
  about: 'Демонстрационный пользователь',
  contacts: {
    phone: '+7 (123) 456-78-90',
    location: 'Москва'
  }
};

export default function DemoUserCard() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Демо-режим</p>
          <p>Это демонстрация работы с API Яндекс 360. В реальном приложении данные будут загружаться из API.</p>
          <p className="mt-2">
            Для работы с реальным API необходимо:
          </p>
          <ul className="list-disc ml-5 mt-2">
            <li>Зарегистрировать приложение в Яндексе</li>
            <li>Получить OAuth-токен</li>
            <li>Настроить переменные окружения</li>
          </ul>
        </div>
      </div>
      <UserCard user={mockUser} />
    </div>
  );
} 