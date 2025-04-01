import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// URL для API Яндекс 360
const API_URL = 'https://api360.yandex.net/directory/v1';

// Получаем ID организации из переменных окружения
const ORG_ID = process.env.ORG_ID || '_';

/**
 * Прокси-эндпоинт для получения списка пользователей организации через API Яндекс 360
 * API доступно только для корпоративных аккаунтов Яндекс 360 для бизнеса
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

  // Получаем параметры запроса
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const perPage = parseInt(url.searchParams.get('perPage') || '10', 10);
  // Используем orgId из параметров запроса или берем значение из переменной окружения
  const orgId = url.searchParams.get('orgId') || ORG_ID;

  console.log(`Запрос на получение списка пользователей: orgId=${orgId}, page=${page}, perPage=${perPage}`);
  
  // Проверка ID организации
  if (!orgId || orgId === '_') {
    console.warn('ID организации не указан или равен "_". Для работы с API Яндекс 360 необходимо указать корректный ID организации в .env.local файле (переменная ORG_ID)');
  }

  try {
    // Выполняем запрос к API Яндекс 360
    console.log(`Отправка запроса к API Яндекс 360: ${API_URL}/org/${orgId}/users?page=${page}&per_page=${perPage}`);
    
    // Добавляем больше заголовков для совместимости с API Яндекс 360
    const headers = {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'YandexAPI-NextJS-Proxy'
    };
    
    console.log('Заголовки запроса:', JSON.stringify(headers, null, 2));
    
    const response = await axios.get(
      `${API_URL}/org/${orgId}/users`, 
      {
        params: { 
          page: page,
          per_page: perPage // Обратите внимание: параметр использует snake_case
        },
        headers: headers
      }
    );
    
    console.log('Успешный ответ от API:', response.status);
    
    // Возвращаем данные пользователей
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    
    // Обрабатываем возможные ошибки
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      let message = error.response?.data || error.message;
      
      console.error('Детали ошибки API:', {
        status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          params: error.config?.params,
          headers: error.config?.headers
        }
      });
      
      // Добавляем дополнительную информацию в зависимости от статуса ошибки
      if (status === 400) {
        // Bad Request - проблема с форматом запроса
        message = {
          error: 'Неверный формат запроса к API Яндекс 360.',
          details: `Возможно указан неверный ID организации (${orgId}) или недостаточно прав. Проверьте, что указан правильный ORG_ID в файле .env.local и токен имеет необходимые права доступа.`,
          troubleshooting: [
            "1. Укажите корректный ID организации в .env.local (переменная ORG_ID)",
            "2. Убедитесь, что токен OAuth имеет права на просмотр пользователей",
            "3. Проверьте, что ваш аккаунт имеет доступ к Яндекс 360 для бизнеса"
          ],
          original_error: message
        };
      } else if (status === 404) {
        message = {
          error: 'Не удалось получить список пользователей. Организация не найдена или у вас нет доступа к API Яндекс 360.',
          details: `Использовался ID организации: ${orgId}. Убедитесь, что вы используете правильный ID организации и у вас есть доступ к API Яндекс 360 для бизнеса.`,
          original_error: message
        };
      } else if (status === 401 || status === 403) {
        message = {
          error: 'Доступ запрещен. Проверьте авторизацию и права доступа к API Яндекс 360.',
          details: 'Убедитесь, что токен действителен и имеет достаточные права для доступа к API Яндекс 360 для бизнеса.',
          original_error: message
        };
      } else {
        message = {
          error: 'Ошибка при получении списка пользователей из API Яндекс 360.',
          details: `Статус ошибки: ${status}. Подробности смотрите в логах сервера.`,
          original_error: message
        };
      }
      
      return NextResponse.json(message, { status });
    }
    
    // Общая ошибка
    return NextResponse.json(
      { 
        error: 'Ошибка при получении списка пользователей', 
        details: 'Произошла непредвиденная ошибка при обработке запроса. Подробности смотрите в логах сервера.'
      }, 
      { status: 500 }
    );
  }
} 