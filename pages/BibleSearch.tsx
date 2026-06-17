import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Sparkles, Loader2, ChevronRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCcw, Info } from 'lucide-react';
import { bibleService } from '../services/bibleService';
import { trackingService } from '../services/trackingService';
import { BibleBook } from '../types';

const BibleSearch: React.FC = () => {
  const [view, setView] = useState<'books' | 'chapters' | 'reading' | 'search'>('books');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapterContent, setChapterContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any[] | null>(null);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);

  const [testament, setTestament] = useState<'all' | 'old' | 'new'>('all');

  const books = useMemo(() => bibleService.getBooks(), []);
  const filteredBooks = useMemo(() => {
    if (testament === 'all') return books;
    return books.filter(b => b.testament === testament);
  }, [books, testament]);

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userId = userData.id || userData.email;

  // Efeito para rolar suavemente até o versículo selecionado/destacado
  useEffect(() => {
    if (view === 'reading' && highlightedVerse && chapterContent) {
      setTimeout(() => {
        const el = document.getElementById(`verse-${highlightedVerse}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [view, highlightedVerse, chapterContent]);

  const handleBookClick = (book: BibleBook) => {
    setSelectedBook(book);
    setView('chapters');
    setError(null);
    setHighlightedVerse(null);
  };

  const handleChapterClick = async (chapter: number) => {
    if (!selectedBook) return;
    setLoading(true);
    setError(null);
    setSelectedChapter(chapter);
    setChapterContent(null);
    setHighlightedVerse(null);
    
    try {
      const content = await bibleService.getChapterText(selectedBook.name, chapter);
      if (content) {
        setChapterContent(content);
        setView('reading');
      } else {
        setError("Não foi possível carregar este capítulo de maneira offline ou online. Verifique sua conexão.");
      }
    } catch (e) {
      setError("Ocorreu um erro ao carregar as escrituras.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setLoading(true);
    setError(null);
    setSearchResult(null);
    setHighlightedVerse(null);

    try {
      const parsed = bibleService.parseQuery(query);
      if (parsed.type === 'reference' && parsed.book && parsed.chapter) {
        // É uma referência exata! (Ex: "Efésios 6:10", "Gênesis 1")
        setSelectedBook(parsed.book);
        setSelectedChapter(parsed.chapter);
        const content = await bibleService.getChapterText(parsed.book.name, parsed.chapter);
        if (content) {
          setChapterContent(content);
          if (parsed.verse) {
            setHighlightedVerse(parsed.verse);
          }
          setView('reading');
          setSearchQuery(''); // Limpa busca após o sucesso
        } else {
          setError("Não conseguimos carregar este capítulo no momento.");
        }
      } else if (parsed.type === 'book' && parsed.book) {
        // Encontrou apenas o livro (Ex: "Efésios", "Mateus")
        setSelectedBook(parsed.book);
        setView('chapters');
        setSearchQuery(''); // Limpa busca
      } else {
        // É uma busca por palavra-chave comum (Ex: "amor", "paz")
        const res = await bibleService.searchVerse(query);
        if (res && res.length > 0) {
          setSearchResult(res);
        } else {
          setError("Nenhum versículo foi encontrado com essa palavra. Tente palavras como 'fé', 'graça', 'misericórdia' ou busque por referências como 'Salmos 23:1' ou 'Lucas 2'.");
        }
      }
    } catch (e) {
      setError("Erro ao realizar a busca nas Escrituras.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!selectedBook || !selectedChapter || !userId) return;
    const contentId = `bible_${selectedBook.id}_ch${selectedChapter}`;
    await trackingService.completeDay(userId, contentId);
    alert("Leitura registrada no seu coração!");
  };

  return (
    <div className="space-y-6 pb-40">
      <header className="flex items-center justify-between">
        <div className="max-w-[80%]">
          {view !== 'books' && (
            <button 
              onClick={() => {
                // Se estiver lendo, volta para a seleção de capítulos
                // Se estiver vendo capítulos de um livro selecionado na busca, e voltando, decide para onde ir
                setView(view === 'reading' ? 'chapters' : view === 'chapters' ? 'books' : 'books');
                setError(null);
              }}
              className="mb-2 text-[#C2A385] flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
            >
              <ArrowLeft size={12} /> Voltar
            </button>
          )}
          <span className="text-[#C2A385] text-xs font-semibold uppercase tracking-[0.2em]">
            {view === 'reading' ? selectedBook?.name : 'Escrituras'}
          </span>
          <h1 className="font-serif text-3xl mt-1 text-[#2C3E50] break-words">
            {view === 'reading' ? `Capítulo ${selectedChapter}` : view === 'search' ? 'Busca Inspirada' : 'Bíblia Sagrada'}
          </h1>
        </div>
        
        {view === 'books' && (
          <button 
            onClick={() => setView('search')}
            className="p-3 bg-white border border-[#C2A385]/20 rounded-2xl text-[#C2A385] shadow-sm active:scale-95 animate-pulse"
          >
            <Search size={20} />
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center gap-4 text-center"
          >
            <Loader2 className="animate-spin text-[#C2A385]" size={32} />
            <p className="text-[10px] font-bold text-[#C2A385] uppercase tracking-[0.2em]">Buscando nas Escrituras...</p>
          </motion.div>
        )}

        {!loading && error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 text-center space-y-4"
          >
            <Info className="mx-auto text-amber-400" size={32} />
            <p className="text-sm text-amber-800 font-medium leading-relaxed">{error}</p>
            <button 
              onClick={() => {
                setView('books');
                setError(null);
              }}
              className="flex items-center gap-2 mx-auto px-6 py-2 bg-white rounded-full border border-amber-200 text-amber-600 text-[10px] font-black uppercase tracking-widest shadow-sm"
            >
               Voltar para os Livros
            </button>
          </motion.div>
        )}

        {!loading && !error && view === 'books' && (
          <motion.div 
            key="books"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'old', label: 'Antigo' },
                { id: 'new', label: 'Novo' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTestament(t.id as any)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                    testament === t.id 
                      ? 'bg-[#2C3E50] text-white shadow-md' 
                      : 'bg-white text-[#C2A385] border border-[#C2A385]/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#C2A385]/10 overflow-hidden shadow-sm">
              {filteredBooks.map((book, idx) => (
                <div 
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className={`flex items-center justify-between p-5 active:bg-[#FDFCF8] transition-colors cursor-pointer ${idx !== filteredBooks.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className="font-serif text-lg text-[#2C3E50]">{book.name}</span>
                    <span className="text-[8px] text-[#C2A385] font-bold uppercase tracking-widest">{book.chapters} Capítulos</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#2C3E50]/5 border border-[#C2A385]/20 flex items-center justify-center">
                    <span className="text-[9px] font-black text-[#C2A385] uppercase tracking-tighter">{book.abbreviation}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && !error && view === 'chapters' && selectedBook && (
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

        {!loading && !error && view === 'reading' && chapterContent && (
          <motion.div 
            key="reading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-[#C2A385]/10 shadow-xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C2A385]/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              
              <div className="space-y-6 relative z-10">
                {chapterContent.verses.map((v: any) => (
                  <p 
                    key={v.number} 
                    id={`verse-${v.number}`}
                    className={`font-serif text-xl leading-relaxed text-[#2C3E50] p-2.5 rounded-2xl transition-all ${
                      highlightedVerse === v.number 
                        ? 'bg-amber-100/50 border border-amber-300/40 shadow-inner scale-[1.01]' 
                        : ''
                    }`}
                  >
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
          </motion.div>
        )}

        {!loading && view === 'search' && (
          <motion.div key="search" className="space-y-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setView('books'); setError(null); }}
                className="text-[#C2A385] flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
              >
                <ArrowLeft size={12} /> Ir para Livros
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: 'Efésios 6:10', 'Salmos 23', ou busque palavras como 'Amor'..."
                className="w-full pl-6 pr-16 py-5 bg-white rounded-[2rem] border border-[#C2A385]/20 shadow-sm outline-none text-sm font-medium text-[#2C3E50] focus:border-[#C2A385] transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#C2A385]">
                <Sparkles />
              </button>
            </form>

            <p className="text-[10px] text-[#C2A385]/65 text-center mt-2 font-medium">
              Dica: Digite referências diretas como <span className="font-bold">"João 3:16"</span> para carregar a passagem instantaneamente.
            </p>

            {!error && searchResult && Array.isArray(searchResult) && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center px-4">
                  <span className="text-[10px] font-black text-[#C2A385] uppercase tracking-widest">{searchResult.length} Versículos Encontrados Encontrados</span>
                  <button 
                    onClick={() => { setSearchResult(null); setSearchQuery(''); }}
                    className="text-[#C2A385] text-[10px] font-black uppercase tracking-widest active:scale-95 bg-[#C2A385]/10 px-3 py-1.5 rounded-full"
                  >
                    Limpar
                  </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-32">
                  {searchResult.map((result: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={async () => {
                        if (!result.bookName || !result.chapter) return;
                        setLoading(true);
                        setError(null);
                        try {
                          const book = books.find(b => b.name === result.bookName);
                          if (book) {
                            setSelectedBook(book);
                            setSelectedChapter(result.chapter);
                            const content = await bibleService.getChapterText(result.bookName, result.chapter);
                            if (content) {
                              setChapterContent(content);
                              setHighlightedVerse(result.verse);
                              setView('reading');
                            }
                          }
                        } catch (err) {
                          setError("Ocorreu um erro ao carregar o capítulo completo.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-white p-6 rounded-[2rem] border border-[#C2A385]/15 shadow-sm hover:shadow-md hover:border-[#C2A385]/30 transition-all cursor-pointer group active:scale-98 flex flex-col justify-between space-y-4"
                    >
                      <p className="font-serif text-[#2C3E50] leading-relaxed italic text-base">
                        "{result.text}"
                      </p>
                      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] font-black text-[#C2A385] uppercase tracking-widest">{result.reference}</span>
                        <span className="text-[9px] text-[#2C3E50]/40 group-hover:text-[#C2A385] transition-colors font-bold uppercase tracking-widest flex items-center gap-1">
                          Ler Capítulo <ChevronRight size={10} />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BibleSearch;