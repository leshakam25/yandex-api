'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import yandexApiService from '../api/services/yandexApi';
import { User } from '../api/services/types';
import { FormField, Input } from './ui/FormField';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';

interface UserNameFormProps {
  user: User;
  onSuccess?: (updatedUser: User) => void;
  onError?: (error: Error) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  middleName: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  general?: string;
}

export default function UserNameForm({ user, onSuccess, onError }: UserNameFormProps) {
  // Инициализируем форму с текущими данными пользователя
  const initialFormData: FormData = {
    firstName: typeof user.name === 'string' 
      ? '' // Если имя строка, разбить его нельзя
      : user.name?.first || '',
    lastName: typeof user.name === 'string'
      ? '' // Если имя строка, разбить его нельзя
      : user.name?.last || '',
    middleName: typeof user.name === 'string'
      ? '' // Если имя строка, разбить его нельзя
      : user.name?.middle || ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Обработчик изменения полей формы
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем ошибку поля при изменении
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Валидация полей формы
  const validateFields = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Необходимо указать имя';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Необходимо указать фамилию';
    }
    
    setErrors(newErrors);
    
    // Форма валидна, если нет ошибок
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Проверяем валидность полей
    if (!validateFields()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Проверка наличия ID пользователя
      if (!user.id) {
        throw new Error('Отсутствует ID пользователя');
      }
      
      // Отправляем запрос на обновление имени пользователя
      const updatedUser = await yandexApiService.updateUserName(user.id, {
        first: formData.firstName.trim(),
        last: formData.lastName.trim(),
        middle: formData.middleName.trim() || undefined
      });
      
      // Вызываем колбэк успешного обновления
      if (onSuccess) {
        onSuccess(updatedUser);
      }
    } catch (error) {
      const err = error as Error;
      
      // Устанавливаем ошибку формы
      setFormError(err.message || 'Произошла ошибка при обновлении имени');
      
      // Вызываем колбэк ошибки
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn">
      {formError && (
        <Alert type="error" className="mb-4">
          {formError}
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="lastName"
          label="Фамилия"
          error={errors.lastName}
          required
        >
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Введите фамилию"
            error={errors.lastName}
            required
          />
        </FormField>
        
        <FormField
          id="firstName"
          label="Имя"
          error={errors.firstName}
          required
        >
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Введите имя"
            error={errors.firstName}
            required
          />
        </FormField>
      </div>
      
      <FormField
        id="middleName"
        label="Отчество"
        error={errors.middleName}
      >
        <Input
          id="middleName"
          name="middleName"
          value={formData.middleName}
          onChange={handleChange}
          placeholder="Введите отчество (если есть)"
          error={errors.middleName}
        />
      </FormField>
      
      <div className="flex justify-end space-x-3 mt-6">
        <Button 
          type="submit" 
          isLoading={isLoading}
          disabled={isLoading}
        >
          Сохранить изменения
        </Button>
      </div>
    </form>
  );
} 