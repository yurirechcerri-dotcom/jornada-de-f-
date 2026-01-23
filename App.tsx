import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JourneyList from './pages/JourneyList';
import JourneyDetail from './pages/JourneyDetail';
import MorningRitual from './pages/MorningRitual';
import PrayerWall from './pages/PrayerWall';
import Login from './pages/Login';
import ThankYou from './pages/ThankYou';
import { notificationService } from './services/notificationService';
import { LogOut } from 'lucide-react';

const ProfilePage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const savedEnabled = localStorage.getItem('notifications_enabled') === 'true';
    setNotificationsEnabled(savedEnabled);
  }, []);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications_enabled', 'true');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notifications_enabled', 'false');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('is_authenticated');
    window.location.reload();
  };

  return (
    <div className="space-y-8 pb-10">
      <header>
        <span className="text-[#C2A385] text-xs font-semibold uppercase tracking-[0.2em]">Configurações</span>
        <h1 className="font-serif text-4xl mt-1 text-[#2C3E50]">Seu Perfil</h1>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-[#C2A385]/10 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C2A385] to-[#D4B996] flex items-center justify-center font-serif text-2xl text-white shadow-lg">
            VF
          </div>
          <div>
            <p className="font-bold text-[#2C3E50]">Viajante da Fé</p>
            <p className="text-xs text-[#C2A385] font-bold uppercase tracking-widest">Plano Vitalício</p>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C2A385]">Notificações</h3>
          <div className="flex items-center justify-between p-4 bg-[#FDFCF8] rounded-2xl border">
             <span className="text-xs font-bold text-[#2C3E50]">Lembrete Diário</span>
             <button onClick={toggleNotifications} className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-[#C2A385]' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
             </button>
          </div>
        </section>

        <section className="pt-4 border-t border-gray-50">
          <button onClick={handleLogout} className="w-full py-4 text-red-400 font-bold uppercase tracking-[0.2em] text-[10px] bg-red-50/30 rounded-2xl flex items-center justify-center gap-2">
            <LogOut size={14} />
            Sair da Jornada
          </button>
        </section>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });

  const handleLogin = useCallback(() => {
    localStorage.setItem('is_authenticated', 'true');
    setIsAuthenticated(true);
    // Forçar redirecionamento para garantir que as rotas atualizem
    window.location.hash = "#/";
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />
        <Route path="/thank-you" element={<ThankYou />} />
        
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/journey" element={<JourneyList />} />
                  <Route path="/journey/:type" element={<JourneyDetail />} />
                  <Route path="/morning" element={<MorningRitual />} />
                  <Route path="/prayer" element={<PrayerWall />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;