
import { getVerseOfTheDay } from './verseService';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.error('Este navegador não suporta notificações desktop');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  async sendImmediateTest() {
    const verse = getVerseOfTheDay();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Jornada de Fé', {
          body: `Sua semente diária: "${verse.text}" — ${verse.reference}`,
          icon: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=192&h=192&auto=format&fit=crop',
          badge: 'https://images.unsplash.com/photo-1544427928-c49cdfebf194?q=80&w=192&h=192&auto=format&fit=crop'
        });
      } catch (err) {
        console.error('Error creating Notification:', err);
      }
    }
  },

  checkAndTrigger(scheduledTime: string) {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    // Verifica se estamos no minuto exato agendado
    if (now.getHours() === hours && now.getMinutes() === minutes) {
      const lastTriggered = localStorage.getItem('last_notification_date');
      const today = now.toDateString();

      if (lastTriggered !== today) {
        this.sendImmediateTest();
        localStorage.setItem('last_notification_date', today);
        
        // Dispara um CustomEvent para notificação in-app em tempo real
        const event = new CustomEvent('app-seed-notification', {
          detail: { 
            title: 'Semente Diária', 
            body: 'Seu momento sagrado de hoje chegou! Toque para receber as palavras de refrigério.' 
          }
        });
        window.dispatchEvent(event);
      }
    }
  }
};
