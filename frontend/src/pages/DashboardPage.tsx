import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <header className="bg-white border-b border-sage-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-teal-700">WellTrack</h1>
        <button
          onClick={logout}
          className="text-sm text-sage-500 hover:text-sage-700 transition-colors"
        >
          Sign out
        </button>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold text-sage-800 mb-2">Welcome back</h2>
        <p className="text-sage-500">Your dashboard is coming soon.</p>
      </main>
    </div>
  );
}

export default DashboardPage;
