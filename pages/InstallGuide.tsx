
import React, { useState } from 'react';
import { Share, PlusSquare, MoreVertical, Download, X, ChevronRight, ChevronLeft, Smartphone, Apple, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);

  const iosSteps = [
    {
      icon: <Share className="text-blue-500" size={24} />,
      text: "Toque no botão de 'Compartilhar' na barra inferior do Safari.",
      sub: "É o ícone de um quadrado com uma seta para cima."
    },
    {
      icon: <PlusSquare className="text-gray-600" size={24} />,
      text: "Role a lista para baixo e selecione 'Adicionar à Tela de Início'.",
      sub: "Pode estar um pouco escondido, continue rolando."
    },
    {
      icon: <div className="w-6 h-6 bg-[#C2A385] rounded-md" />,
      text: "Confirme tocando em 'Adicionar' no canto superior direito.",
      sub: "O ícone da Jornada aparecerá junto com seus outros apps."
    }
  ];

  const androidSteps = [
    {
      icon: <MoreVertical className="text-gray-600" size={24} />,
      text: "Toque nos três pontos (menu) no canto superior direito do Chrome.",
      sub: "Fica ao lado da barra de endereço."
    },
    {
      icon: <Download className="text-gray-600" size={24} />,
      text: "Selecione a opção 'Instalar aplicativo' ou 'Adicionar à tela inicial'.",
      sub: "Uma janela de confirmação aparecerá."
    },
    {
      icon: <div className="w-6 h-6 bg-[#C2A385] rounded-md" />,
      text: "Toque em 'Instalar' e aguarde alguns segundos.",
      sub: "O app será adicionado automaticamente à sua gaveta de apps."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[120] bg-[#FDFCF8] flex flex-col"
    >
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-sm z-10"
        >
          <X size={20} className="text-[#2C3E50]/40" />
        </button>

        <header className="text-center mb-10">
          <div className="w-20 h-20 bg-[#C2A385] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#C2A385]/20">
            <Download className="text-white" size={36} />
          </div>
          <h2 className="font-serif text-3xl text-[#2C3E50] leading-tight">Instale a Jornada no seu Celular</h2>
          <p className="text-[#2C3E50]/60 mt-3 text-sm max-w-[240px] mx-auto">
            Acesse seu devocional mais rápido e com melhor experiência, como um aplicativo real.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!platform ? (
            <motion.div 
              key="platform-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 max-w-xs mx-auto"
            >
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#C2A385] mb-6">Escolha seu sistema</p>
              
              <button 
                onClick={() => setPlatform('ios')}
                className="w-full flex items-center justify-between p-6 bg-white rounded-[2rem] border border-[#C2A385]/10 shadow-sm active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700">
                    <Apple size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#2C3E50]">iPhone</p>
                    <p className="text-[10px] text-gray-400">iOS / Safari</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[#C2A385]" />
              </button>

              <button 
                onClick={() => setPlatform('android')}
                className="w-full flex items-center justify-between p-6 bg-white rounded-[2rem] border border-[#C2A385]/10 shadow-sm active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-700">
                    <Smartphone size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#2C3E50]">Android</p>
                    <p className="text-[10px] text-gray-400">Samsung / Motorola / Xiaomi</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-[#C2A385]" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="steps"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 max-w-xs mx-auto"
            >
              <button 
                onClick={() => setPlatform(null)}
                className="flex items-center gap-2 text-[#C2A385] text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                <ChevronLeft size={14} /> Voltar
              </button>

              <div className="space-y-6">
                {(platform === 'ios' ? iosSteps : androidSteps).map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm border border-[#C2A385]/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#2C3E50] leading-snug">{step.text}</p>
                      <p className="text-[11px] text-[#2C3E50]/50 leading-relaxed">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                  <span className="font-bold">Nota:</span> Certifique-se de estar usando o navegador padrão ({platform === 'ios' ? 'Safari' : 'Chrome'}) para que a opção apareça.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full bg-[#2C3E50] text-white py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-95 transition-all"
              >
                Já instalei / Entendi
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default InstallGuide;
