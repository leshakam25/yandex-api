'use client';

import { useState } from 'react';
import { User } from '../api/services/types';
import UserNameForm from './UserNameForm';
import Image from 'next/image';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user: initialUser }: UserCardProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleEditSuccess = (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditing(false);
    setError(null);
  };
  
  const handleEditError = (error: Error) => {
    setError(`Ошибка при обновлении: ${error.message}`);
  };

  // Форматирование полного имени
  const fullName = user.name 
    ? typeof user.name === 'string'
      ? user.name
      : `${user.name.last || ''} ${user.name.first || ''} ${user.name.middle || ''}`.trim()
    : 'Нет данных';

  return (
    <Card className="animate-fadeIn">
      {error && (
        <Alert type="error" className="mx-6 mt-6 mb-0">
          {error}
        </Alert>
      )}
      
      {user._warning && (
        <Alert type="warning" title="Демо-режим" className="mx-6 mt-6 mb-0">
          {user._warning}
        </Alert>
      )}
      
      {isEditing ? (
        <Card.Content>
          <h2 className="text-xl font-semibold mb-4">Редактирование профиля</h2>
          <UserNameForm 
            user={user} 
            onSuccess={handleEditSuccess} 
            onError={handleEditError} 
          />
        </Card.Content>
      ) : (
        <>
          <Card.Content>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Информация о пользователе</h2>
                {user.email && (
                  <p className="text-sm text-gray-500">{user.email}</p>
                )}
              </div>
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
              >
                Изменить имя
              </Button>
            </div>
            
            <div className="flex">
              {user.image && (
                <div className="mr-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                    <Image 
                      src={user.image} 
                      alt={fullName}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover transition-opacity hover:opacity-90"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">ФИО:</span>{' '}
                  {fullName}
                </p>
                {user.email && (
                  <p>
                    <span className="font-semibold">Email:</span> {user.email}
                  </p>
                )}
                {user.position && (
                  <p>
                    <span className="font-semibold">Должность:</span> {user.position}
                  </p>
                )}
                {user.about && (
                  <p>
                    <span className="font-semibold">О себе:</span> {user.about}
                  </p>
                )}
                {user.contacts?.phone && (
                  <p>
                    <span className="font-semibold">Телефон:</span> {user.contacts.phone}
                  </p>
                )}
                {user.contacts?.mobile_phone && (
                  <p>
                    <span className="font-semibold">Мобильный телефон:</span> {user.contacts.mobile_phone}
                  </p>
                )}
                {user.contacts?.location && (
                  <p>
                    <span className="font-semibold">Местоположение:</span> {user.contacts.location}
                  </p>
                )}
              </div>
            </div>
          </Card.Content>
        </>
      )}
    </Card>
  );
} 