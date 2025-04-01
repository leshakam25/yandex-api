import Header from '../components/Header';
import Profile from '../components/Profile';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Профиль пользователя
          </h2>
          <p className="mb-6 text-gray-600">
            На этой странице вы можете просмотреть и редактировать свой профиль в Яндекс 360.
          </p>
          
          <Profile />
        </div>
      </main>
    </div>
  );
} 