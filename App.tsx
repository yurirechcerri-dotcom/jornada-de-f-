
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, getLocalSession, clearLocalSession } from './lib/supabase';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';
import InstallGuide from './pages/InstallGuide';

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
