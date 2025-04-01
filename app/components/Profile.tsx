'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import yandexApiService from '../api/services/yandexApi';
import { User } from '../api/services/types';
import UserCard from './UserCard';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';

export default function Profile() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получение данных текущего пользователя
  const fetchCurrentUser = async () => {
    if (!session?.accessToken) {
      setError('Необходимо авторизоваться для просмотра профиля');
      setLoading(false);
      return;
    }

    try {
      yandexApiService.setToken(session.accessToken);
      const userData = await yandexApiService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      console.error('Ошибка при получении данных пользователя:', err);
      setError(`Не удалось получить данные: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    fetchCurrentUser();
  }, [session?.accessToken]);

  // Если идет загрузка
  if (loading) {
    return (
      <Card className="animate-pulse">
        <Card.Content>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  // Если возникла ошибка
  if (error) {
    return (
      <Alert type="error" title="Ошибка загрузки профиля">
        {error}
        <div className="mt-4">
          <Button onClick={fetchCurrentUser}>
            Попробовать снова
          </Button>
        </div>
      </Alert>
    );
  }

  // Если нет данных пользователя
  if (!user) {
    return (
      <Alert type="warning">
        Не удалось получить данные профиля. Пожалуйста, войдите в систему.
      </Alert>
    );
  }

  // Отображение данных пользователя
  return <UserCard user={user} />;
} 