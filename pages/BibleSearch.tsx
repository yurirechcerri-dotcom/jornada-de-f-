
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Sparkles, Loader2, ChevronRight, ArrowLeft, CheckCircle2, Bookmark } from 'lucide-react';
import { bibleService } from '../services/bibleService';
import { trackingService } from '../services/trackingService';
import { BibleBook } from '../types';

const BibleSearch: React.FC = () => {
  const [view, setView] = useState<'books' | 'chapters' | 'reading' | 'search'>('books');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapterContent, setChapterContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  const books = useMemo(() => bibleService.getBooks(), []);
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userId = userData.id || userData.email;

  const handleBookClick = (book: BibleBook) => {
    setSelectedBook(book);
    setView('chapters');
  };

  const handleChapterClick = async (chapter: number) => {
    if (!selectedBook) return;
    setLoading(true);
    setSelectedChapter(chapter);
    const content = await bibleService.getChapterText(selectedBook.name, chapter);
    setChapterContent(content);
    setLoading(false);
    setView('reading');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    const res = await bibleService.searchVerse(searchQuery);
    setSearchResult(res);
    setLoading(false);
  };

  const markAsRead = async () => {
    if (!selectedBook || !selectedChapter || !userId) return;
    const contentId = `bible_${selectedBook.id}_ch${selectedChapter}`;
    await trackingService.completeDay(userId, contentId);
    alert("Leitura registrada!");
  };

  return (
    <div className="space-y-6 pb-40">
      {/* Header Dinâmico */}
      <header className="flex items-center justify-between">
        <div>
          {view !== 'books' && (
            <button 
              onClick={() => setView(view === 'reading' ? 'chapters' : 'books')}
              className="mb-2 text-[#C2A385] flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={12} /> Voltar
            </button>
          )}
          <span className="text-[#C2A385] text-xs font-semibold uppercase tracking-[0.2em]">
            {view === 'reading' ? selectedBook?.name : 'Escrituras'}
          </span>
          <h1 className="font-serif text-4xl mt-1 text-[#2C3E50]">
            {view === 'reading' ? `Capítulo ${selectedChapter}` : view === 'search' ? 'Busca' : 'Bíblia Sagrada'}
          </h1>
        </div>
        
        {view === 'books' && (
          <button 
            onClick={() => setView('search')}
            className="p-3 bg-white border border-[#C2A385]/20 rounded-2xl text-[#C2A385]"
          >
            <Search size={20} />
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {/* VIEW: LISTA DE LIVROS (Igual ao print) */}
        {view === 'books' && (
          <motion.div 
            key="books"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="bg-white rounded-[2.5rem] border border-[#C2A385]/10 overflow-hidden shadow-sm">
              {books.map((book, idx) => (
                <div 
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className={`flex items-center justify-between p-5 active:bg-[#FDFCF8] transition-colors cursor-pointer ${idx !== books.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <span className="font-serif text-lg text-[#2C3E50]">{book.name}</span>
                  <div className="w-10 h-10 rounded-full bg-[#2C3E50]/5 border border-[#C2A385]/20 flex items-center justify-center">
                    <span className="text-[9px] font-black text-[#C2A385] uppercase tracking-tighter">{book.abbreviation}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* VIEW: SELEÇÃO DE CAPÍTULOS */}
        {view === 'chapters' && selectedBook && (
          <motion.div 
            key="chapters"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-5 gap-3"
          >
            {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => (
              <button
                key={ch}
                onClick={() => handleChapterClick(ch)}
                className="aspect-square bg-white rounded-2xl border border-[#C2A385]/10 flex items-center justify-center font-serif text-lg text-[#2C3E50] hover:bg-[#C2A385] hover:text-white transition-all shadow-sm active:scale-90"
              >
                {ch}
              </button>
            ))}
          </motion.div>
        )}

        {/* VIEW: LEITOR BÍBLICO (Parchment Style) */}
        {view === 'reading' && (
          <motion.div 
            key="reading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-[#C2A385]" size={32} />
                <p className="text-[10px] font-bold text-[#C2A385] uppercase tracking-widest">Inspirando as Escrituras...</p>
              </div>
            ) : chapterContent && (
              <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-[#C2A385]/10 shadow-xl space-y-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2A385]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                
                <div className="space-y-6 relative z-10">
                  {chapterContent.verses.map((v: any) => (
                    <p key={v.number} className="font-serif text-xl leading-relaxed text-[#2C3E50]">
                      <sup className="text-[10px] font-black text-[#C2A385] mr-2 uppercase">{v.number}</sup>
                      {v.text}
                    </p>
                  ))}
                </div>

                <button 
                  onClick={markAsRead}
                  className="w-full py-5 bg-[#2C3E50] text-white rounded-3xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  <CheckCircle2 size={18} /> Marcar como Lido
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW: BUSCA POR IA */}
        {view === 'search' && (
          <motion.div key="search" className="space-y-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por tema ou versículo..."
                className="w-full pl-6 pr-16 py-5 bg-white rounded-[2rem] border border-[#C2A385]/20 shadow-sm outline-none text-sm"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#C2A385]">
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              </button>
            </form>

            {searchResult && (
              <div className="bg-white p-10 rounded-[3rem] border border-[#C2A385]/10 shadow-lg text-center space-y-6">
                 <p className="font-serif text-2xl italic text-[#2C3E50]">"{searchResult.text}"</p>
                 <span className="text-[10px] font-black text-[#C2A385] uppercase tracking-widest">{searchResult.reference}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BibleSearch;
