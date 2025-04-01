import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  API_URL, 
  REQUEST_TIMEOUT 
} from './config';
import { 
  User, 
  UserListResponse, 
  UserListParams, 
  UpdateUserNameRequest,
  ApiError
} from './types';

/**
 * Класс для работы с API Яндекс 360
 */
class YandexApiService {
  private api: AxiosInstance;
  private proxyApi: AxiosInstance;
  private token: string | null = null;

  constructor() {
    // API для прямых запросов к Яндекс 360
    this.api = axios.create({
      baseURL: API_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // API для запросов через локальный прокси
    this.proxyApi = axios.create({
      baseURL: '',  // Пустой baseURL для локальных запросов
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем перехватчик для запросов к API Яндекса
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `OAuth ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Добавляем перехватчик для запросов к прокси
    this.proxyApi.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `OAuth ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Добавляем перехватчик для ответов от API
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Обрабатываем ошибки API
        if (error.response) {
          console.error('API Error:', error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
      }
    );

    // Добавляем перехватчик для ответов от прокси
    this.proxyApi.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Обрабатываем ошибки API
        if (error.response) {
          console.error('Proxy API Error:', error.response.data);
        } else if (error.request) {
          console.error('Proxy: No response received:', error.request);
        } else {
          console.error('Proxy: Error setting up request:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Установка токена авторизации
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Получение текущего пользователя.
   * Использует локальный прокси для получения данных из Yandex API
   */
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await this.proxyApi.get('/api/proxy/user');

      if (response.data) {
        // Получаем полное имя из различных полей ответа API
        let fullName = response.data.real_name || '';
        if (!fullName && (response.data.first_name || response.data.last_name)) {
          fullName = `${response.data.last_name || ''} ${response.data.first_name || ''}`.trim();
        }
        
        // Разбиваем полное имя на части: Фамилия Имя Отчество
        const nameParts = fullName.split(' ');
        const lastName = nameParts[0] || '';
        const firstName = nameParts[1] || '';
        const middleName = nameParts.length > 2 ? nameParts.slice(2).join(' ') : '';
        
        console.log('Разбор имени:', { fullName, lastName, firstName, middleName });
        
        // Преобразуем данные из API Яндекса в формат User
        return {
          id: response.data.id?.toString() ?? '',
          email: response.data.default_email,
          name: {
            last: lastName,
            first: firstName,
            middle: middleName
          },
          image: response.data.default_avatar_id 
            ? `https://avatars.yandex.net/get-yapic/${response.data.default_avatar_id}/islands-200` 
            : undefined,
          position: response.data.display_name || undefined
        };
      }
      
      throw new Error('Не удалось получить данные пользователя');
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Получение списка пользователей (сотрудников) организации
   * @param page Номер страницы (по умолчанию 1)
   * @param perPage Количество пользователей на странице (по умолчанию 10, максимум 1000)
   * @param orgId ID организации (если не указано, используется значение из переменной окружения ORG_ID)
   */
  public async getUsers(page: number = 1, perPage: number = 10, orgId?: string): Promise<any> {
    try {
      console.log(`Запрос списка пользователей: страница ${page}, по ${perPage} на странице`);
      
      const response = await this.proxyApi.get('/api/proxy/users', {
        params: { 
          page: page,
          perPage: perPage,
          orgId: orgId
        }
      });

      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      
      // Проверяем, есть ли детальная информация об ошибке в ответе
      if (axios.isAxiosError(error) && error.response?.data) {
        // Пробрасываем структурированную ошибку
        throw error;
      }
      
      // Иначе преобразуем в стандартную ошибку
      throw this.handleApiError(error);
    }
  }

  /**
   * Получение информации о пользователе
   */
  async getUser(userId: string): Promise<User> {
    // Для корпоративных пользователей этот метод будет работать с API 360
    // Для обычных пользователей используем информацию о текущем пользователе
    try {
      // Сначала пробуем получить через API 360
      const response: AxiosResponse<User> = await this.api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.warn(`Не удалось получить данные пользователя ${userId} через API 360:`, error);
      
      // Если это текущий пользователь - получаем информацию через локальный прокси
      try {
        const currentUser = await this.getCurrentUser();
        if (currentUser.id === userId) {
          return currentUser;
        }
        
        // Если это не текущий пользователь - возвращаем демо-данные
        return {
          id: userId,
          email: 'user@example.com',
          name: {
            first: 'Имя',
            last: 'Фамилия',
            middle: 'Отчество'
          },
          position: 'Сотрудник',
          _warning: 'Демо-режим: недостаточно прав для получения данных других пользователей'
        };
      } catch (profileError) {
        console.error('Ошибка получения данных текущего пользователя:', profileError);
        throw new Error(`Ошибка при получении данных пользователя: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Обновление имени пользователя в корпоративном аккаунте Яндекс 360.
   * Для обычных пользователей работает в демо-режиме.
   * 
   * @param userId - ID пользователя
   * @param name - Новое имя (строка или объект {first, last, middle})
   */
  public async updateUserName(userId: string, name: string | {first?: string, last?: string, middle?: string}): Promise<User> {
    try {
      console.log('Запрос на обновление имени:', { userId, name });
      
      // Подготавливаем данные для отправки в зависимости от формата имени
      let nameData;
      if (typeof name === 'string') {
        nameData = { name };
      } else {
        // Если передан объект с частями имени, форматируем его в строку
        const fullName = `${name.last || ''} ${name.first || ''} ${name.middle || ''}`.trim();
        nameData = { name: fullName };
      }
      
      const response = await this.proxyApi.patch('/api/proxy/user/name', {
        userId,
        nameData
      });

      // Извлекаем имя из ответа
      let userName: any;
      if (typeof response.data.name === 'string') {
        // Если имя вернулось как строка, разбиваем его на части
        const nameParts = response.data.name.split(' ');
        userName = {
          last: nameParts[0] || '',
          first: nameParts[1] || '',
          middle: nameParts.length > 2 ? nameParts.slice(2).join(' ') : ''
        };
      } else {
        // Если имя вернулось как объект, используем его
        userName = response.data.name;
      }
      
      // Возвращаем обновленные данные пользователя
      return {
        id: response.data.id?.toString() ?? '',
        email: response.data.email,
        name: userName,
        image: response.data.default_avatar_id 
          ? `https://avatars.yandex.net/get-yapic/${response.data.default_avatar_id}/islands-200` 
          : undefined,
        position: response.data.display_name || undefined,
        _warning: response.data._warning
      };
    } catch (error) {
      console.error('Ошибка при обновлении имени пользователя:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Удаление пользователя (только для корпоративных аккаунтов)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await this.api.delete(`/users/${userId}`);
    } catch (error) {
      console.error(`Failed to delete user ${userId}:`, error);
      throw error;
    }
  }

  private handleApiError(error: any): Error {
    if (axios.isAxiosError(error)) {
      // Ошибки запроса Axios
      const status = error.response?.status || 0;
      const message = error.response?.data?.error || error.message || 'Неизвестная ошибка API';
      
      if (status === 401) {
        return new Error('Требуется авторизация. Пожалуйста, войдите снова.');
      } else if (status === 403) {
        return new Error('Доступ запрещен. У вас нет прав для выполнения этого действия.');
      } else if (status === 404) {
        return new Error('Запрашиваемый ресурс не найден.');
      } else if (status === 429) {
        return new Error('Превышено количество запросов. Пожалуйста, попробуйте позже.');
      } else if (status >= 500) {
        return new Error('Ошибка сервера Яндекс. Пожалуйста, попробуйте позже.');
      }
      
      return new Error(`Ошибка API: ${message}`);
    }
    
    // Для не-Axios ошибок
    return new Error(`Произошла ошибка: ${error?.message || 'Неизвестная ошибка'}`);
  }
}

// Экспортируем синглтон сервиса
export const yandexApiService = new YandexApiService();
export default yandexApiService; 