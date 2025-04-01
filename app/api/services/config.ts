/**
 * Конфигурация для работы с API Яндекс 360
 */

// Базовый URL для API Яндекс 360
export const API_BASE_URL = 'https://api360.yandex.net';

// Версия API
export const API_VERSION = 'v1';

// Полный URL для API
export const API_URL = `${API_BASE_URL}/${API_VERSION}`;

// Тайм-аут запроса (в миллисекундах)
export const REQUEST_TIMEOUT = 30000;

// Область (scope) доступа к API Яндекс 360
// Только разрешенные скоупы для стандартных приложений
export const API_SCOPES = [
  'login:email',       // Доступ к электронной почте
  'login:info',        // Доступ к логину и имени
  'login:avatar'       // Доступ к аватару
];

// ID приложения (необходимо получить в кабинете разработчика Яндекса)
export const CLIENT_ID = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID || '';

// Секретный ключ приложения
export const CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET || '';

// Callback URL для OAuth2
export const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/yandex'; 