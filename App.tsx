
import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JourneyList from './pages/JourneyList';
import JourneyDetail from './pages/JourneyDetail';
import MorningRitual from './pages/MorningRitual';
import PrayerWall from './pages/PrayerWall';
import Login from './pages/Login';
import ThankYou from './pages/ThankYou';
import { LogOut, ShieldCheck, Heart } from 'lucide-react';

const ProfilePage = () => {
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const isAdmin = userData.email === 'yurirechcerri@gmail.com';

  const handleLogout = () => {
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('user_data');
    window.location.reload();
  };

  return (
    <div className="space-y-8 pb-32">
      <header>
        <span className="text-[#C2A385] text-xs font-semibold uppercase tracking-[0.2em]">Sua Conta</span>
        <h1 className="font-serif text-4xl mt-1 text-[#2C3E50]">Meu Perfil</h1>
      </header>

      <div className="bg-white p-8 rounded-[3rem] border border-[#C2A385]/10 shadow-sm space-y-8">
        <div className="flex flex-col items-center gap-4 text-center pb-4 border-b border-gray-50">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#C2A385] to-[#D4B996] flex items-center justify-center font-serif text-4xl text-white shadow-xl mb-2">
            {userData.email?.substring(0, 1).toUpperCase() || 'V'}
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[#2C3E50]">{userData.display_name || 'Viajante da Fé'}</h2>
            <p className="text-sm text-[#2C3E50]/40 font-medium">{userData.email}</p>
          </div>
          <div className="bg-[#C2A385]/10 px-5 py-2 rounded-full flex items-center gap-2">
            {isAdmin ? <ShieldCheck size={12} className="text-[#C2A385]" /> : <Heart size={12} className="text-[#C2A385]" />}
            <p className="text-[10px] text-[#C2A385] font-black uppercase tracking-[0.2em]">
              {isAdmin ? 'Proprietário' : 'Membro Vitalício'}
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <div className="p-6 bg-[#FDFCF8] rounded-2xl border border-[#C2A385]/5">
            <p className="text-[11px] text-[#2C3E50]/60 text-center leading-relaxed italic">
              "Bem-aventurados os que trilham caminhos retos e andam na lei do Senhor." <br/>
              <span className="font-bold mt-2 block">— Salmos 119:1</span>
            </p>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="w-full py-5 text-red-400 font-bold uppercase tracking-[0.2em] text-[10px] bg-red-50/30 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            Sair do Aplicativo
          </button>
        </section>
      </div>

      <div className="text-center opacity-20">
        <p className="text-[8px] font-black uppercase tracking-[0.5em]">Jornada de Fé v1.1.4</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_authenticated') === 'true';
  });

  const handleLogin = useCallback((userData: any) => {
    localStorage.setItem('is_authenticated', 'true');
    localStorage.setItem('user_data', JSON.stringify(userData));
    setIsAuthenticated(true);
  }, []);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<JourneyList />} />
        <Route path="/journey/:type" element={<JourneyDetail />} />
        <Route path="/morning" element={<MorningRitual />} />
        <Route path="/prayer" element={<PrayerWall />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
