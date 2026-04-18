import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Mock: which of the last 7 days had entries logged
const WEEK_ACTIVITY = [true, true, false, true, true, true, false];

const QUICK_ADD = [
  { label: 'Symptom',    emoji: '🩺', color: 'bg-rose-50 border-rose-200 text-rose-700   hover:bg-rose-100' },
  { label: 'Mood',       emoji: '😊', color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
  { label: 'Medication', emoji: '💊', color: 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100' },
  { label: 'Habit',      emoji: '✅', color: 'bg-teal-50 border-teal-200 text-teal-700   hover:bg-teal-100' },
];

// Mock entries logged today
const TODAY_LOG = [
  { type: 'Symptom',    detail: 'Headache — severity 6',        time: '8:14 AM' },
  { type: 'Mood',       detail: 'Mood 4/5 · Energy 3/5',        time: '9:02 AM' },
  { type: 'Medication', detail: 'Ibuprofen 400mg — taken',       time: '8:15 AM' },
  { type: 'Habit',      detail: 'Water Intake — 1.2 L',          time: '11:30 AM' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function DashboardPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }

  function quickAdd(label: string) {
    setToast(`${label} log — coming soon`);
    setTimeout(() => setToast(''), 2500);
  }

  const today = new Date();
  const streak = WEEK_ACTIVITY.filter(Boolean).length;

  // Build last-7-days labels ending today
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return DAYS[d.getDay()];
  });

  return (
    <div className="min-h-screen bg-sage-50">

      {/* Header */}
      <header className="bg-white border-b border-sage-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-teal-700">WellTrack</h1>
        <button onClick={logout} className="text-sm text-sage-500 hover:text-sage-700 transition-colors">
          Sign out
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Greeting + date */}
        <div>
          <p className="text-sage-500 text-sm">{formatDate(today)}</p>
          <h2 className="text-2xl font-bold text-sage-800">{greeting()}</h2>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-2xl border border-sage-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-sage-700">This week</span>
            <span className="text-sm font-semibold text-teal-600">{streak} / 7 days logged</span>
          </div>
          <div className="flex gap-2">
            {weekDays.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-2 rounded-full ${WEEK_ACTIVITY[i] ? 'bg-teal-400' : 'bg-sage-200'}`} />
                <span className="text-xs text-sage-400">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick-add */}
        <div>
          <p className="text-xs font-semibold text-sage-400 uppercase tracking-wide mb-3">Quick add</p>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ADD.map(({ label, emoji, color }) => (
              <button
                key={label}
                onClick={() => quickAdd(label)}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border text-xs font-medium transition-colors ${color}`}
              >
                <span className="text-2xl">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Today's log */}
        <div>
          <p className="text-xs font-semibold text-sage-400 uppercase tracking-wide mb-3">Today's log</p>
          {TODAY_LOG.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sage-200 p-8 text-center text-sage-400 text-sm">
              Nothing logged yet — use Quick Add above.
            </div>
          ) : (
            <div className="space-y-2">
              {TODAY_LOG.map((entry, i) => (
                <div key={i} className="bg-white rounded-2xl border border-sage-200 px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-sage-400 uppercase tracking-wide">{entry.type}</p>
                    <p className="text-sm text-sage-800 mt-0.5">{entry.detail}</p>
                  </div>
                  <span className="text-xs text-sage-400">{entry.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-sage-800 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}

    </div>
  );
}

export default DashboardPage;
