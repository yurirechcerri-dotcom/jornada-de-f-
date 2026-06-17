
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, getLocalSession, clearLocalSession } from './lib/supabase';
import Layout from './components/Layout';
import { Loader2, Bell } from 'lucide-react';
import InstallGuide from './pages/InstallGuide';
import { notificationService } from './services/notificationService';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy Loading das páginas
const Home = lazy(() => import('./pages/Home'));
const JourneyList = lazy(() => import('./pages/JourneyList'));
const JourneyDetail = lazy(() => import('./pages/JourneyDetail'));
const MorningRitual = lazy(() => import('./pages/MorningRitual'));
const PrayerWall = lazy(() => import('./pages/PrayerWall'));
const BibleSearch = lazy(() => import('./pages/BibleSearch'));
const Login = lazy(() => import('./pages/Login'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const Profile = lazy(() => import('./pages/Profile'));

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center bg-[#FDFCF8]">
    <Loader2 className="animate-spin text-[#C2A385]" size={32} />
  </div>
);

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [inAppToast, setInAppToast] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) { 
          setSession(session); 
          checkPWA(session.user.id);
          setLoading(false); 
          return; 
        }
      }
      const local = getLocalSession();
      if (local) {
        setSession(local);
        checkPWA(local.user?.id || 'local');
      }
      setLoading(false);
    };

    const checkPWA = (userId: string) => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      const hasSeenGuide = localStorage.getItem(`pwa_guide_seen_${userId}`);
      if (!isStandalone && !hasSeenGuide) {
        setShowInstallGuide(true);
      }
    };

    checkAuth();
  }, []);

  // Efeito de pooling para verificar e disparar sementes diárias agendadas
  useEffect(() => {
    if (!session) return;
    
    // Verifica a cada 20 segundos
    const interval = setInterval(() => {
      const isEnabled = localStorage.getItem('daily_notification_enabled') === 'true';
      const scheduledTime = localStorage.getItem('daily_notification_time') || '08:00';
      
      if (isEnabled) {
        notificationService.checkAndTrigger(scheduledTime);
      }
    }, 20000);

    // Ouvinte para notificações customizadas recebidas in-app
    const handleNotification = (e: any) => {
      setInAppToast({
        title: e.detail.title,
        body: e.detail.body
      });
    };

    window.addEventListener('app-seed-notification', handleNotification);

    return () => {
      clearInterval(interval);
      window.removeEventListener('app-seed-notification', handleNotification);
    };
  }, [session]);

  const closeInstallGuide = () => {
    const userId = session?.user?.id || 'local';
    localStorage.setItem(`pwa_guide_seen_${userId}`, 'true');
    setShowInstallGuide(false);
  };

  if (loading) return <LoadingFallback />;
  
  if (!session) return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );

  return (
    <>
      <AnimatePresence>
        {inAppToast && (
          <motion.div 
            initial={{ opacity: 0, y: -100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.95 }}
            onClick={() => {
              setInAppToast(null);
              // Redireciona para o mural das escrituras
              window.location.hash = '/bible';
            }}
            className="fixed top-6 left-6 right-6 z-[9999] bg-[#2C3E50] text-[#C2A385] p-5 rounded-[2rem] border border-[#C2A385]/30 shadow-2xl flex items-start gap-4 cursor-pointer active:scale-95 transition-all"
          >
            <div className="p-2.5 bg-[#C2A385]/10 rounded-xl text-[#C2A385]">
              <Bell size={20} className="animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-serif font-bold text-sm text-white">{inAppToast.title}</h4>
              <p className="text-xs text-gray-200 leading-relaxed font-semibold">{inAppToast.body}</p>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setInAppToast(null); }}
              className="text-gray-400 hover:text-white text-xs font-bold leading-none p-1"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showInstallGuide && <InstallGuide onClose={closeInstallGuide} />}
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/journey" element={<JourneyList />} />
            <Route path="/journey/:type" element={<JourneyDetail />} />
            <Route path="/bible" element={<BibleSearch />} />
            <Route path="/morning" element={<MorningRitual />} />
            <Route path="/prayer" element={<PrayerWall />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
};

export default App;
