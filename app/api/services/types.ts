/**
 * Типы для работы с API Яндекс 360
 */

// Тип для пользователя
export interface User {
  id?: string;
  nickname?: string;
  email?: string;
  name?: {
    first?: string;
    last?: string;
    middle?: string;
  };
  image?: string;
  position?: string;
  department_id?: string;
  gender?: 'male' | 'female';
  is_admin?: boolean;
  is_dismissed?: boolean;
  about?: string;
  contacts?: {
    birthday?: string;
    phone?: string;
    mobile_phone?: string;
    location?: string;
  };
  // Служебные поля
  _warning?: string;
}

// Тип для списка пользователей
export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  users: User[];
}

// Тип для изменения имени пользователя
export interface UpdateUserNameRequest {
  name: {
    first: string;
    last: string;
    middle?: string;
  };
}

// Тип для создания пользователя
export interface CreateUserRequest {
  nickname: string;
  password: string;
  name: {
    first: string;
    last: string;
    middle?: string;
  };
  department_id?: string;
  position?: string;
  gender?: 'male' | 'female';
  about?: string;
  contacts?: {
    birthday?: string;
    phone?: string;
    mobile_phone?: string;
    location?: string;
  };
}

// Тип для параметров запроса списка пользователей
export interface UserListParams {
  page?: number;
  per_page?: number;
  order_by?: string;
  department_id?: string;
  include_dismissed?: boolean;
}

// Тип для ошибки API
export interface ApiError {
  code: number;
  message: string;
  details?: string;
  request_id?: string;
}

// Тип для токена доступа
export interface AccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
} 