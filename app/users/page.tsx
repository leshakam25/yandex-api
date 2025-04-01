import Header from '../components/Header';
import UsersList from '../components/UsersList';

export const metadata = {
  title: 'Пользователи организации | Яндекс 360 API',
  description: 'Список пользователей организации в Яндекс 360'
};

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Пользователи организации
          </h1>
          <p className="mb-6 text-gray-600">
            На этой странице отображаются все пользователи, зарегистрированные в вашей организации в Яндекс 360.
          </p>
          
          <UsersList />
        </div>
      </main>
    </div>
  );
} 