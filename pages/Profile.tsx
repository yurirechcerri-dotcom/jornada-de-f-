
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Flame, 
  Calendar, 
  MessageSquare,
  Bell,
  ChevronRight,
  Clock
} from 'lucide-react';
import { clearLocalSession } from '../lib/supabase';
import { trackingService } from '../services/trackingService';
import { notificationService } from '../services/notificationService';
import Heatmap from '../components/Heatmap';

const Profile: React.FC = () => {
  const [completions, setCompletions] = useState<any[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('daily_notification_enabled') === 'true'
  );
  const [notificationTime, setNotificationTime] = useState(
    localStorage.getItem('daily_notification_time') || '08:00'
  );

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userId = userData.id || userData.email;

  useEffect(() => {
    if (userId) {
      trackingService.getCompletions(userId).then(setCompletions).catch(console.error);
    }
  }, [userId]);

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair da sua jornada?")) {
      clearLocalSession();
      localStorage.removeItem('user_data');
      window.location.reload();
    }
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await notificationService.requestPermission();
      if (!granted) {
        alert("Dica: Se as notificações do navegador estiverem desativadas, o app também exibirá lembretes visuais in-app quando estiver aberto!");
      }
      setNotificationsEnabled(true);
      localStorage.setItem('daily_notification_enabled', 'true');
      
      // Envia uma de teste imediata para dar boas vindas
      setTimeout(() => {
        notificationService.sendImmediateTest();
      }, 500);
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('daily_notification_enabled', 'false');
    }
  };

  const handleTimeChange = (time: string) => {
    setNotificationTime(time);
    localStorage.setItem('daily_notification_time', time);
  };

  const completionDates = completions.map(c => c.completed_at);

  return (
    <div className="space-y-8 pb-32">
      <header className="text-center pt-4 space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-br from-[#C2A385] to-[#B19274] rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl mx-auto">
            <span className="text-3xl font-serif font-bold">
              {userData.display_name?.charAt(0).toUpperCase() || 'V'}
            </span>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -inset-2 border border-[#C2A385]/20 rounded-[3rem] -z-10" 
          />
        </div>
        
        <div>
          <h1 className="font-serif text-3xl text-[#2C3E50]">{userData.display_name || 'Viajante da Fé'}</h1>
          <p className="text-[10px] font-bold text-[#C2A385] uppercase tracking-[0.2em] mt-1">{userData.email}</p>
        </div>

        {userData.has_vital_access && (
          <div className="inline-flex items-center gap-2 bg-[#2C3E50] text-[#C2A385] px-4 py-1.5 rounded-full border border-[#C2A385]/30 shadow-lg">
            <ShieldCheck size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Acesso Vitalício Liberado</span>
          </div>
        )}
      </header>

      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-[#C2A385]/10 shadow-sm text-center space-y-1">
          <Flame size={20} className="mx-auto text-[#C2A385]" fill="currentColor" />
          <div className="font-serif text-3xl text-[#2C3E50]">{completions.length}</div>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Devocionais</p>
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] border border-[#C2A385]/10 shadow-sm text-center space-y-1">
          <Calendar size={20} className="mx-auto text-[#C2A385]" />
          <div className="font-serif text-3xl text-[#2C3E50]">
            {new Set(completionDates.map(d => d.split('T')[0])).size}
          </div>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Dias Ativos</p>
        </div>
      </section>

      <section>
        <Heatmap completions={completionDates} />
      </section>

      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-4">Configurações</h3>
        <div className="bg-white rounded-[2.5rem] border border-[#C2A385]/10 overflow-hidden shadow-sm">
          
          <div className="flex flex-col">
            <div 
              onClick={handleToggleNotifications}
              className="flex items-center justify-between p-5 active:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Bell size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#2C3E50]">Notificações Diárias</span>
                  <span className="text-[10px] text-gray-400 font-medium">Lembretes para devocional</span>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${notificationsEnabled ? 'bg-[#2C3E50]' : 'bg-gray-200'}`}>
                <motion.div 
                  layout
                  className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: notificationsEnabled ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>

            <AnimatePresence>
              {notificationsEnabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 bg-amber-50/50 border-t border-gray-50 flex items-center justify-between overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#C2A385]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#C2A385] uppercase tracking-widest">Hora de Envio</span>
                      <span className="text-[10px] text-gray-400 font-medium">Lembrete às {notificationTime}</span>
                    </div>
                  </div>
                  <input 
                    type="time" 
                    value={notificationTime} 
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="p-2.5 bg-white border border-[#C2A385]/20 rounded-xl outline-none font-serif text-sm text-[#2C3E50] tracking-widest text-center max-w-[100px] focus:border-[#C2A385] transition-all shadow-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div 
            onClick={() => window.open('https://wa.me/seu-numero', '_blank')}
            className="flex items-center justify-between p-5 border-b border-gray-50 active:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-50 rounded-xl text-green-500"><MessageSquare size={18} /></div>
              <span className="text-sm font-medium text-[#2C3E50]">Suporte e Feedback</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>

          <div 
            onClick={handleLogout}
            className="flex items-center justify-between p-5 active:bg-red-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-50 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all"><LogOut size={18} /></div>
              <span className="text-sm font-medium text-red-500">Encerrar Sessão</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center pt-4">
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">
          "Pois onde estiver o seu tesouro, aí também estará o seu coração." <br/> Mateus 6:21
        </p>
        <p className="text-[8px] text-gray-200 mt-4 uppercase">Versão 1.5.0 • Jornada de Fé</p>
      </footer>
    </div>
  );
};

export default Profile;
