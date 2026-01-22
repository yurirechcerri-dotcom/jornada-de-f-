
import React from 'react';
import { Share, PlusSquare, MoreVertical, Download, X } from 'lucide-react';
import { motion } from 'framer-motion';

const InstallGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto px-8 py-12">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full">
        <X size={24} className="text-[#2C3E50]/40" />
      </button>

      <header className="text-center mb-12">
        <div className="w-16 h-16 bg-[#C2A385] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <Download className="text-white" size={32} />
        </div>
        <h2 className="font-serif text-3xl text-[#2C3E50]">Tenha a Jornada no seu Celular</h2>
        <p className="text-[#2C3E50]/60 mt-2">Instale o app para acesso rápido e offline.</p>
      </header>

      <div className="space-y-12 max-w-xs mx-auto">
        <section className="space-y-6">
          <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#C2A385]">Para iPhone (iOS)</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#FDFCF8] p-4 rounded-2xl border border-[#C2A385]/10">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white"><Share size={16} /></div>
              <p className="text-sm font-medium">1. Toque no ícone de Compartilhar no Safari.</p>
            </div>
            <div className="flex items-center gap-4 bg-[#FDFCF8] p-4 rounded-2xl border border-[#C2A385]/10">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><PlusSquare size={16} /></div>
              <p className="text-sm font-medium">2. Role para baixo e toque em 'Adicionar à Tela de Início'.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#C2A385]">Para Android / Chrome</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-[#FDFCF8] p-4 rounded-2xl border border-[#C2A385]/10">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><MoreVertical size={16} /></div>
              <p className="text-sm font-medium">1. Toque nos três pontos no canto superior direito.</p>
            </div>
            <div className="flex items-center gap-4 bg-[#FDFCF8] p-4 rounded-2xl border border-[#C2A385]/10">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><Download size={16} /></div>
              <p className="text-sm font-medium">2. Toque em 'Instalar Aplicativo'.</p>
            </div>
          </div>
        </section>

        <button 
          onClick={onClose}
          className="w-full bg-[#2C3E50] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs mt-8"
        >
          Entendi, vamos lá!
        </button>
      </div>
    </div>
  );
};

export default InstallGuide;
