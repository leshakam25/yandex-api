import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * Прокси-эндпоинт для получения данных пользователя из Яндекс API
 * Позволяет обойти ограничения CORS при запросах с клиента
 */
export async function GET(request: NextRequest) {
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
    // Делаем запрос к API Яндекса для получения информации о пользователе
    const response = await axios.get('https://login.yandex.ru/info', {
      headers: {
        Authorization: authHeader,
        'Accept': 'application/json'
      }
    });
    
    // Возвращаем данные пользователя
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    
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
      { error: 'Ошибка при получении данных пользователя' }, 
      { status: 500 }
    );
  }
} 