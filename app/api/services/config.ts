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
// Права доступа для работы с API Яндекс 360 и Яндекс ID
export const API_SCOPES = [
  // API Яндекс ID - информация о пользователе
  'login:email',         // Доступ к адресу электронной почты
  'login:info',          // Доступ к логину, имени, фамилии и полу
  'login:birthday',      // Доступ к дате рождения
  
  // API Яндекс 360 - сотрудники и организация
  'directory:read',      // Чтение данных о сотрудниках
  'directory:write',     // Управление сотрудниками
  'organization:read',   // Чтение данных об организациях пользователя
  'organization:write',  // Редактирование организации
  
  // API Яндекс 360 - структурные элементы
  'department:read',     // Чтение данных о подразделениях
  'department:write',    // Управление подразделениями
  'groups:read',         // Чтение данных о группах
  'groups:write',        // Управление группами
  
  // API Яндекс 360 - домены
  'domains:read',        // Чтение данных о доменах организации
  'domains:write',       // Управление доменами организации
  'dns:write',           // Управление DNS-записями
  
  // API Яндекс 360 - контакты
  'contacts:read',       // Чтение внешних контактов
  'contacts:write'       // Управление внешними контактами
];

// ID приложения (необходимо получить в кабинете разработчика Яндекса)
export const CLIENT_ID = process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID || '';

// Секретный ключ приложения
export const CLIENT_SECRET = process.env.YANDEX_CLIENT_SECRET || '';

// Callback URL для OAuth2
export const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/yandex'; 