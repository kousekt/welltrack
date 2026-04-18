import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: replace with real auth when backend is ready
    localStorage.setItem('accessToken', 'mock-token');
    navigate('/dashboard');
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-teal-700">WellTrack</h1>
        <p className="text-sage-500 mt-1 text-sm">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-sage-200 p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1">Password</label>
          <input
            type="password"
            required
            placeholder="Your password"
            className="w-full px-3 py-2 border border-sage-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-sage-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-teal-600 hover:underline font-medium">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
