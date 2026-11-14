import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import BmoLogin from './BmoLogin';
import Dashboard from './Dashboard';

const SESSION_KEY = 'bmo_session';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <BmoLogin onLogin={setUser} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
