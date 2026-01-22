
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JourneyList from './pages/JourneyList';
import JourneyDetail from './pages/JourneyDetail';
import MorningRitual from './pages/MorningRitual';
import PrayerWall from './pages/PrayerWall';
import Login from './pages/Login';
import ThankYou from './pages/ThankYou';
import InstallGuide from './pages/InstallGuide';
import { notificationService } from './services/notificationService';
import { Bell, BellOff, Clock, Download, Sparkles, ShieldCheck, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState('07:00');
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedEnabled = localStorage.getItem('notifications_enabled') === 'true';
    const savedTime = localStorage.getItem('notification_time') || '07:00';
    setNotificationsEnabled(savedEnabled && Notification.permission === 'granted');
    setNotificationTime(savedTime);
  }, []);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await notificationService.requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications_enabled', 'true');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert('Por favor, autorize as notificações nas configurações do seu navegador.');
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notifications_enabled', 'false');
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setNotificationTime(time);
    localStorage.setItem('notification_time', time);
  };

  const testNotification = () => {
    notificationService.sendImmediateTest();
  };

  const handleLogout = () => {
    localStorage.removeItem('is_authenticated');
    window.location.reload();
  };

  return (
    <div className="space-y-8 pb-10">
      {showInstallGuide && <InstallGuide onClose={() => setShowInstallGuide(false)} />}
      
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
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C2A385]">Espiritualidade Diária</h3>
          
          <div className={`p-5 rounded-2xl border-2 transition-all duration-500 ${notificationsEnabled ? 'border-[#C2A385]/20 bg-[#FDFCF8]' : 'border-gray-100 bg-gray-50/50'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${notificationsEnabled ? 'bg-[#C2A385] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2C3E50]">Lembrete da Palavra</p>
                  <p className="text-[10px] text-[#2C3E50]/40">Receba seu versículo matinal</p>
                </div>
              </div>
              <button 
                onClick={toggleNotifications}
                className={`w-12 h-6 rounded-full transition-all relative ${notificationsEnabled ? 'bg-[#C2A385]' : 'bg-gray-300'}`}
              >
                <motion.div 
                  animate={{ x: notificationsEnabled ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                />
              </button>
            </div>

            <AnimatePresence>
              {notificationsEnabled && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="h-px bg-[#C2A385]/10 w-full my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#C2A385]" />
                      <span className="text-xs font-medium text-[#2C3E50]">Horário Escolhido</span>
                    </div>
                    <input 
                      type="time" 
                      value={notificationTime}
                      onChange={handleTimeChange}
                      className="bg-white border border-[#C2A385]/20 rounded-lg px-3 py-1 text-sm font-bold text-[#C2A385] outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C2A385]">Aplicativo</h3>
          <button 
            onClick={() => setShowInstallGuide(true)}
            className="w-full flex items-center justify-between p-4 bg-[#FDFCF8] rounded-2xl border border-[#C2A385]/10 group hover:border-[#C2A385]/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <Download size={18} className="text-[#C2A385]" />
              <span className="text-xs font-bold text-[#2C3E50] uppercase tracking-widest">Guia de Instalação</span>
            </div>
            <Sparkles size={12} className="text-[#C2A385]" />
          </button>
        </section>

        <section className="pt-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full py-4 text-red-400 font-bold uppercase tracking-[0.2em] text-[10px] bg-red-50/30 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
          >
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

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_authenticated', 'true');
  };

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const enabled = localStorage.getItem('notifications_enabled') === 'true';
        const time = localStorage.getItem('notification_time') || '07:00';
        if (enabled) {
          notificationService.checkAndTrigger(time);
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
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
