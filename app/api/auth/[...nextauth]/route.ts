import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, API_SCOPES } from '../../services/config';

// Расширяем типы для Next Auth
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    }
  }
  
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    userId?: string;
  }
}

// Тип для профиля Яндекса
interface YandexProfile {
  id: string;
  display_name: string;
  real_name?: string;
  default_email: string;
  default_avatar_id?: string;
}

// Определяем настройки аутентификации
export const authOptions: AuthOptions = {
  providers: [
    {
      id: 'yandex',
      name: 'Yandex',
      type: 'oauth',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authorization: {
        url: 'https://oauth.yandex.ru/authorize',
        params: {
          scope: API_SCOPES.join(' '),
          response_type: 'code',
        },
      },
      token: 'https://oauth.yandex.ru/token',
      userinfo: 'https://login.yandex.ru/info',
      profile(profile: any) {
        return {
          id: String(profile.id),
          name: profile.real_name || profile.display_name,
          email: profile.default_email,
          image: profile.default_avatar_id 
            ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200` 
            : undefined,
        };
      },
    },
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Если есть информация об аккаунте (после успешной аутентификации)
      if (account && user) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем токен доступа к сессии
      session.accessToken = token.accessToken as string | undefined;
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Создаем обработчик аутентификации
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 