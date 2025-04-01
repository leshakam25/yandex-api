import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// URL для API Яндекс 360
const API_URL = 'https://api360.yandex.net/v1';

/**
 * Прокси-эндпоинт для обновления имени пользователя через API Яндекс 360
 * Обрабатывает PATCH-запросы для обновления имени
 * API Яндекс 360 доступно только для корпоративных пользователей!
 */
export async function PATCH(request: NextRequest) {
  // Получаем токен из заголовка запроса
  const authHeader = request.headers.get('Authorization');
  
  // Если нет токена, возвращаем ошибку
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Требуется заголовок Authorization' }, 
      { status: 401 }
    );
  }

  try {
    // Получаем данные из тела запроса
    const requestData = await request.json();
    const userId = requestData.userId;
    const nameData = requestData.nameData;
    
    // Проверяем наличие необходимых данных
    if (!userId || !nameData) {
      return NextResponse.json(
        { error: 'Требуются данные userId и nameData' },
        { status: 400 }
      );
    }
    
    // Подробное логирование для отладки
    console.log('Запрос на обновление имени пользователя:', { 
      userId, 
      nameData,
      authHeader: authHeader.substring(0, 15) + '...' // Логируем только начало токена для безопасности
    });
    
    // Попытка обновить имя через API Яндекс 360 (только для корпоративных аккаунтов)
    try {
      console.log('Отправка запроса к API Яндекс 360:', `${API_URL}/users/${userId}`);
      
      // Формируем данные в нужном формате API
      const apiData = { name: nameData.name };
      
      const response = await axios.patch(
        `${API_URL}/users/${userId}`,
        apiData,
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Успешный ответ от API:', response.status);
      
      // Возвращаем обновленные данные пользователя
      return NextResponse.json(response.data);
    } catch (apiError: any) {
      console.warn('Не удалось обновить имя через API Яндекс 360:', apiError.message);
      console.log('Статус ошибки:', apiError.response?.status);
      console.log('Детали ошибки:', apiError.response?.data);
      
      // Если ошибка 404 - значит это не корпоративный аккаунт или недостаточно прав
      // Переключаемся на демо-режим
      console.log('Переключение на демо-режим для обновления имени...');
      
      // Получаем данные пользователя через API Яндекс.Паспорт
      const userResponse = await axios.get('https://login.yandex.ru/info', {
        headers: {
          Authorization: authHeader,
          'Accept': 'application/json'
        }
      });
      
      console.log('Получены данные пользователя из Яндекс.Паспорт');
      
      // Имя, которое пытались установить
      const newName = typeof nameData.name === 'string' 
        ? nameData.name 
        : `${nameData.name?.last || ''} ${nameData.name?.first || ''} ${nameData.name?.middle || ''}`.trim();
      
      // Готовим ответ с имитацией успешного обновления
      const demoResponse = {
        id: userResponse.data.id?.toString(),
        email: userResponse.data.default_email,
        name: newName,
        _warning: 'Демо-режим: имя изменено только локально. Для использования API Яндекс 360 требуется корпоративный аккаунт Яндекс 360 для бизнеса.'
      };
      
      console.log('Возвращаем демо-ответ:', demoResponse);
      
      // Возвращаем имитацию обновленных данных
      return NextResponse.json(demoResponse);
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    
    // Обрабатываем возможные ошибки
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data || error.message;
      
      return NextResponse.json(
        { error: message }, 
        { status }
      );
    }
    
    // Общая ошибка
    return NextResponse.json(
      { error: 'Ошибка при обновлении имени пользователя' }, 
      { status: 500 }
    );
  }
} 