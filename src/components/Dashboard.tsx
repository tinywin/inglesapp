import { useState } from "react";
import { UserProfile, LessonContent } from "../types";
import { generateCustomLesson } from "../services/geminiService";
import { Book, Plus, Loader2, LogOut, ChevronRight, Volume2, Music, Film, Video, Mic2, Mic, Heart, Trophy, Sparkles, BookMarked, Trash2, FastForward } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardProps {
  profile: UserProfile;
  onReset: () => void;
  onSaveLesson: (lesson: LessonContent) => void;
  onSaveWord: (word: string, meaning: string) => void;
  onRemoveWord: (word: string) => void;
  onCompleteChallenge: () => void;
}

export function Dashboard({ profile, onReset, onSaveLesson, onSaveWord, onRemoveWord, onCompleteChallenge }: DashboardProps) {
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'history' | 'dictionary'>('daily');
  const [customScenario, setCustomScenario] = useState("");
  const [showScenarioInput, setShowScenarioInput] = useState(false);
  const [viewingHistoryLesson, setViewingHistoryLesson] = useState<LessonContent | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [flashcardsMode, setFlashcardsMode] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8; // Slightly slower for better understanding
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startLesson = async (scenario?: string) => {
    setIsLoading(true);
    try {
      const lesson = await generateCustomLesson(profile, scenario);
      setCurrentLesson(lesson);
      setShowScenarioInput(false);
      setCustomScenario("");
    } catch (error) {
      console.error(error);
      alert("Não consegui criar a lição agora. Tente de novo?");
    } finally {
      setIsLoading(false);
    }
  };

  const finishLesson = () => {
    if (currentLesson) {
      onSaveLesson(currentLesson);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setCurrentLesson(null);
        setViewingHistoryLesson(null);
      }, 2000);
    } else {
      setCurrentLesson(null);
      setViewingHistoryLesson(null);
    }
  };

  const lessonToDisplay = currentLesson || viewingHistoryLesson;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative">
      {/* Decorative Step Number */}
      <div className="absolute top-0 right-0 serif text-6xl md:text-[200px] leading-none font-bold text-slate-400/20 dark:text-slate-600/10 select-none -z-10 mt-8 md:mt-12 pr-4 md:pr-12 lg:pr-0">
        {lessonToDisplay ? "02" : "01"}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 md:mb-16 relative z-10">
        <div>
          <div className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-secondary dark:text-brand-accent mb-3 md:mb-4">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1 className="text-3xl sm:text-6xl md:text-7xl text-slate-950 dark:text-white serif italic leading-tight tracking-tighter">Bom dia, {profile.name}!</h1>
          <p className="text-slate-700 dark:text-slate-300 font-sans text-base md:text-xl mt-3 md:mt-4 max-w-lg leading-relaxed font-black">
            Pronto para expandir seus horizontes hoje?
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4 bg-white dark:bg-slate-800 p-2 md:p-3 rounded-2xl md:rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-md">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-brand-primary dark:text-white font-black text-xl md:text-2xl shadow-sm border-2 border-slate-200 dark:border-slate-500">
            {profile.name[0]}
          </div>
          <div className="pr-2 md:pr-4">
            <div className="text-[10px] md:text-xs font-black tracking-widest uppercase text-brand-primary dark:text-white">Explorador</div>
            <button 
              onClick={onReset}
              className="text-[9px] md:text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 hover:text-brand-accent transition-colors"
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-bg/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-editorial border border-stone-100 dark:border-slate-800 flex flex-col items-center text-center max-w-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center text-white mb-8"
              >
                <motion.svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    d="M20 6L9 17l-5-5"
                  />
                </motion.svg>
              </motion.div>
              <h3 className="text-3xl serif italic text-brand-primary dark:text-white mb-4">Lição Salva!</h3>
              <p className="text-slate-900 dark:text-slate-50 font-serif font-bold">Sua conquista foi guardada com carinho no álbum.</p>
            </motion.div>
          </motion.div>
        )}

        {lessonToDisplay ? (
          <motion.div 
            key="lesson"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bento-card !p-0 overflow-hidden border-none shadow-2xl"
          >
            <div className="w-full bg-slate-200 h-1.5 flex transition-all duration-1000">
               <div className={`bg-brand-accent h-full transition-all duration-1000 ${viewingHistoryLesson ? 'w-full' : 'w-1/4'}`}></div>
            </div>
            
            <div className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 md:mb-16">
                <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-accent mb-4">Módulo de Estudo</div>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl text-slate-900 dark:text-white serif italic mb-4 leading-tight tracking-tighter">{lessonToDisplay.title}</h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-brand-accent rounded-xl text-[10px] uppercase tracking-widest font-black border-2 border-slate-300 dark:border-slate-700">
                    {lessonToDisplay.encouragement || "Keep going!"}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setCurrentLesson(null);
                    setViewingHistoryLesson(null);
                  }}
                  className="w-full md:w-auto px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl text-[10px] uppercase tracking-widest font-black border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-sans"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <section className="space-y-12 md:space-y-16">
                  <div className="font-sans text-xl md:text-2xl leading-relaxed text-brand-text max-w-3xl font-black">
                    {lessonToDisplay.intro}
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border-2 border-slate-300 dark:border-slate-800 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white dark:bg-slate-800 opacity-60 dark:opacity-20 rounded-bl-full translate-x-12 -translate-y-12"></div>
                    
                    {lessonToDisplay.imagePrompt && (
                      <div className="mb-10 rounded-3xl md:rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl aspect-video relative group/img">
                        <img 
                           src={`https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop`} // Fallback base
                           className="w-full h-full object-cover grayscale brightness-50 group-hover/img:grayscale-0 group-hover/img:brightness-100 transition-all duration-1000" 
                           alt={lessonToDisplay.imagePrompt}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 md:right-6">
                           <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-white/80 mb-1">Visual Fragment</div>
                           <div className="text-white font-serif italic text-xs md:text-sm">{lessonToDisplay.imagePrompt}</div>
                        </div>
                      </div>
                    )}

                    <div className="relative z-10 space-y-8 md:space-y-10">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-secondary dark:text-brand-secondary mb-6 flex items-center gap-2">
                           English Fragment
                        </div>
                        <div className="space-y-8">
                          <p className="text-2xl sm:text-5xl md:text-6xl serif text-slate-900 dark:text-white leading-[1.1] tracking-tighter italic">
                            "{lessonToDisplay.story}"
                          </p>
                          <button 
                            onClick={() => speak(lessonToDisplay.story)}
                            disabled={isSpeaking}
                            className="accent-button !py-4 !px-8 flex items-center justify-center gap-3 text-sm w-full md:w-auto"
                          >
                            <Mic size={20} className={isSpeaking ? "animate-pulse" : ""} />
                            {isSpeaking ? "Speaking..." : "Pronunciation"}
                          </button>
                        </div>
                      </div>
                      <div className="pt-8 md:pt-10 border-t-2 border-slate-400 dark:border-slate-600">
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 dark:text-slate-400 mb-4">Tradução</div>
                        <p className="text-xl md:text-2xl text-slate-900 dark:text-slate-200 font-sans font-black leading-relaxed italic underline decoration-brand-accent/30 decoration-4">
                          {lessonToDisplay.translation}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                      <div className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-text">Vocabulary & Focus</div>
                      <div className="bg-slate-300 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1">
                        <button 
                          onClick={() => setFlashcardsMode(false)}
                          className={`px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${!flashcardsMode ? "bg-brand-primary text-white dark:bg-white dark:text-slate-950 shadow-sm" : "text-slate-800 dark:text-slate-300 hover:text-brand-accent"}`}
                        >
                          List View
                        </button>
                        <button 
                          onClick={() => setFlashcardsMode(true)}
                          className={`px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${flashcardsMode ? "bg-brand-primary text-white dark:bg-white dark:text-slate-950 shadow-sm" : "text-slate-800 dark:text-slate-300 hover:text-brand-accent"}`}
                        >
                          Flashcards
                        </button>
                      </div>
                    </div>

                    {flashcardsMode ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessonToDisplay.vocabulary.map((item: any, i: number) => (
                           <Flashcard key={i} word={item.word} meaning={item.meaning} onSpeak={speak} />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {lessonToDisplay.vocabulary.map((item: any, i: number) => {
                           const isSaved = profile.savedWords?.some(w => w.word.toLowerCase() === item.word.toLowerCase());
                           return (
                            <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-300 dark:border-slate-600 group hover:border-brand-accent transition-all hover:shadow-xl">
                              <div className="flex flex-col">
                                <span className="font-black text-slate-900 dark:text-brand-accent tracking-tight text-xl">{item.word}</span>
                                <span className="text-slate-600 dark:text-slate-400 font-sans font-black text-sm mt-1">{item.meaning}</span>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => onSaveWord(item.word, item.meaning)}
                                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm ${isSaved ? "bg-red-500/10 border-red-500 text-red-500" : "bg-slate-100 dark:bg-slate-700 text-slate-400 border-slate-200 dark:border-slate-600 hover:text-red-400 hover:border-red-400"}`}
                                >
                                  <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                                </button>
                                <button 
                                  onClick={() => speak(item.word)}
                                  className="w-12 h-12 bg-slate-200 dark:bg-slate-700 text-brand-primary dark:text-white rounded-2xl flex items-center justify-center border-2 border-slate-300 dark:border-slate-500 hover:bg-brand-accent hover:text-white transition-all shadow-sm"
                                >
                                  <Mic size={20} />
                                </button>
                              </div>
                            </div>
                           );
                         })}
                      </div>
                    )}
                  </div>

                   {/* Songs Section */}
                   {lessonToDisplay.songLyric && (
                     <div className="bg-brand-accent/5 dark:bg-slate-900 p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border-2 border-brand-accent/20 dark:border-slate-800 relative group">
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-accent mb-6 md:mb-8 flex items-center gap-2">
                           <Music size={14} /> Músicas que Conectam
                        </div>
                        <div className="space-y-6">
                           <div className="font-serif italic text-2xl md:text-4xl leading-tight text-slate-950 dark:text-white tracking-tighter">
                              "{lessonToDisplay.songLyric.english}"
                           </div>
                           <div className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-black italic">
                              {lessonToDisplay.songLyric.portuguese}
                           </div>
                           <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                              <div className="flex flex-col min-w-0">
                                 <span className="text-[9px] md:text-xs uppercase tracking-widest font-black text-brand-accent truncate">{lessonToDisplay.songLyric.artist}</span>
                                 <span className="text-base md:text-lg font-black text-slate-900 dark:text-white truncate">{lessonToDisplay.songLyric.songTitle}</span>
                              </div>
                              <button 
                                onClick={() => speak(lessonToDisplay.songLyric?.english || '')}
                                className="w-12 h-12 md:w-16 md:h-16 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all flex-shrink-0"
                              >
                                <Volume2 size={20} className="md:w-6 md:h-6" />
                              </button>
                           </div>
                        </div>
                     </div>
                   )}

                  {/* Games & Insights Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {lessonToDisplay.quiz && (
                      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[350px] md:min-h-[400px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-bl-full translate-x-8 -translate-y-8"></div>
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-accent mb-8">Skill Check</div>
                        <LessonQuiz quiz={lessonToDisplay.quiz} />
                      </div>
                    )}

                    {lessonToDisplay.scramble && (
                      <div className="bg-slate-100 dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-slate-300 dark:border-slate-800 shadow-xl flex flex-col justify-between min-h-[350px] md:min-h-[400px]">
                        <div className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-text mb-8">Sentence Construct</div>
                        <SentenceScramble data={lessonToDisplay.scramble} />
                      </div>
                    )}
                  </div>

                  {lessonToDisplay.funFact && (
                    <div className="bg-brand-secondary/10 dark:bg-brand-secondary/20 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-brand-secondary/20 dark:border-brand-secondary/30 relative overflow-hidden group">
                      <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-secondary text-white rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0 animate-bounce">
                          <Book size={32} />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-secondary mb-3 md:mb-4">Curiosidade do Guia</div>
                          <p className="text-2xl md:text-3xl text-brand-primary serif italic leading-tight">
                            "{lessonToDisplay.funFact}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {lessonToDisplay.recommendations && lessonToDisplay.recommendations.length > 0 && (
                    <div className="space-y-6 md:space-y-8">
                      <div className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-secondary mb-1">Dica do Guia</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {lessonToDisplay.recommendations.map((rec, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex items-center gap-4 md:gap-6 hover:border-brand-secondary transition-all hover:shadow-lg">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-secondary/10 text-brand-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                               <RecommendationIcon type={rec.type} />
                            </div>
                            <div>
                               <div className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-700 dark:text-slate-300 mb-1">{rec.type}</div>
                               <div className="text-lg md:text-xl font-black text-brand-primary leading-tight">{rec.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <div className="mt-12 md:mt-20 pb-8 md:pb-12 flex flex-col md:flex-row gap-4">
                <button 
                  onClick={finishLesson}
                  className="accent-button !py-4 md:!py-6 text-lg md:text-xl tracking-widest uppercase font-black w-full shadow-2xl shadow-brand-accent/30"
                >
                  {viewingHistoryLesson ? "Back to HQ" : "Complete & Save to Album"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4 p-1.5 md:p-2 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] w-full md:w-fit border-2 border-slate-200 dark:border-slate-800">
               <button 
                 onClick={() => setActiveTab('daily')}
                 className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black transition-all ${activeTab === 'daily' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-600 dark:text-slate-400'}`}
               >
                 Diário
               </button>
               <button 
                 onClick={() => setActiveTab('history')}
                 className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black transition-all ${activeTab === 'history' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-600 dark:text-slate-400'}`}
               >
                 Álbum
               </button>
               <button 
                 onClick={() => setActiveTab('dictionary')}
                 className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black transition-all ${activeTab === 'dictionary' ? 'bg-brand-accent text-white shadow-lg' : 'text-slate-600 dark:text-slate-400'}`}
               >
                 Dicionário
               </button>
            </div>

            {activeTab === 'daily' && (
              <div className="bento-grid">
                {/* Desafio do Dia */}
                <div className="md:col-span-12">
                   <div className="bg-brand-accent rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl group">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-x-12 -translate-y-24 blur-3xl"></div>
                      <div className="relative z-10 flex flex-col items-start md:flex-row md:items-center justify-between gap-8 md:gap-12">
                         <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="p-3 bg-white/20 rounded-xl md:rounded-2xl">
                                  <Trophy className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                               <span className="text-[10px] uppercase tracking-[0.5em] font-black opacity-80">Desafio do Dia</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl serif italic leading-tight">Narrar um momento especial da sua semana em inglês.</h2>
                            <p className="text-lg md:text-xl font-black text-white/90">Complete esse desafio para ganhar um selo de explorador veterano!</p>
                         </div>
                         <button 
                           onClick={() => {
                             setShowScenarioInput(true);
                             onCompleteChallenge();
                           }}
                           className={`w-full md:w-auto px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl font-black text-lg md:text-xl transition-all shadow-2xl flex items-center justify-center gap-3 ${profile.dailyChallengeDone ? 'bg-white/20 text-white cursor-default' : 'bg-white text-brand-accent hover:scale-105 active:scale-95'}`}
                         >
                           {profile.dailyChallengeDone ? <><Sparkles /> Desafio Concluído</> : <><Plus /> Aceitar Desafio</>}
                         </button>
                      </div>
                   </div>
                </div>

                {/* Onde paramos */}
                <div className="md:col-span-8 flex flex-col gap-6">
                  <div className="bento-card flex-1 bg-[#020617] text-white border-none relative overflow-hidden group shadow-2xl min-h-[300px] md:min-h-auto">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale transition-transform duration-700 group-hover:scale-110"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-accent mb-4 md:mb-8 drop-shadow-lg">Play</div>
                        <h3 className="text-3xl sm:text-5xl md:text-6xl serif italic mb-6 md:mb-8 leading-none tracking-tight text-white drop-shadow-2xl">Continuar<br/>de onde parei</h3>
                      </div>
                      <button 
                        onClick={() => startLesson()}
                        disabled={isLoading}
                        className="bg-brand-accent text-white rounded-2xl px-10 md:px-12 py-4 md:py-6 text-lg md:text-2xl font-black transition-all active:scale-95 shadow-2xl shadow-brand-accent/40 hover:scale-105 border-2 border-white/20"
                      >
                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Retomar Lição"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-6">
                  <div className="bento-card bg-slate-900 border-2 border-slate-800 text-white flex flex-col gap-6 min-h-[300px] md:min-h-[400px]">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Categorias Rápidas</div>
                    <div className="flex flex-col gap-3">
                      <button onClick={() => startLesson("Saudações e Apresentações")} className="w-full py-4 bg-slate-800 rounded-xl text-white font-black hover:bg-brand-accent dark:hover:text-slate-950 transition-all border-2 border-slate-700 text-left px-5 shadow-sm">Saudações</button>
                      <button onClick={() => startLesson("Comidas e Restaurante")} className="w-full py-4 bg-slate-800 rounded-xl text-white font-black hover:bg-brand-accent dark:hover:text-slate-950 transition-all border-2 border-slate-700 text-left px-5 shadow-sm">Comidas</button>
                      <button onClick={() => startLesson("Viagens e Passeios")} className="w-full py-4 bg-slate-800 rounded-xl text-white font-black hover:bg-brand-accent dark:hover:text-slate-950 transition-all border-2 border-slate-700 text-left px-5 shadow-sm">Viagens</button>
                    </div>
                  </div>
                </div>

                {/* Narrar Momento */}
                <div className="md:col-span-12">
                  <div className="bento-card bg-slate-800 border-2 border-slate-700 text-white flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-between p-8 md:p-12">
                    <div className="flex-1">
                       <div className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-accent mb-4 md:mb-6">Input Criativo</div>
                       <h3 className="text-3xl md:text-5xl serif italic mb-4 leading-tight">O que você está vivendo agora?</h3>
                       <p className="text-slate-400 font-sans font-black text-base md:text-lg mb-0 leading-relaxed max-w-xl">
                         Transforme seu cotidiano em aprendizado real. Jogos, filmes, animes ou hobbies — conte para o Paulo e comece uma lição personalizada.
                       </p>
                    </div>

                    <div className="w-full md:w-auto">
                      {!showScenarioInput ? (
                        <button 
                          onClick={() => setShowScenarioInput(true)}
                          className="bg-white text-slate-950 rounded-2xl md:rounded-[2rem] px-10 md:px-12 py-4 md:py-6 text-lg md:text-xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 w-full"
                        >
                          <Plus size={24} />
                          Narrar Momento
                        </button>
                      ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4 w-full md:w-[400px]">
                           <textarea 
                             autoFocus
                             value={customScenario}
                             onChange={(e) => setCustomScenario(e.target.value)}
                             placeholder="Ex: Preparando um jantar especial..."
                             className="w-full bg-slate-900 text-white rounded-2xl md:rounded-3xl p-6 md:p-8 border-2 border-slate-700 focus:border-brand-accent transition-colors min-h-[120px] outline-none text-base"
                           />
                           <div className="flex gap-4">
                              <button 
                                onClick={() => startLesson(customScenario)}
                                disabled={isLoading || !customScenario}
                                className="flex-1 bg-brand-accent text-white py-4 rounded-xl font-black hover:scale-105 transition-all"
                              >
                                {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Gerar"}
                              </button>
                              <button 
                                onClick={() => setShowScenarioInput(false)}
                                className="px-4 text-slate-400 uppercase text-[10px] font-black"
                              >
                                Cancelar
                              </button>
                           </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                 <div className="flex flex-col gap-1 mb-8">
                    <div className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-accent">Álbum de Memórias</div>
                    <h2 className="text-5xl serif italic text-white tracking-tighter">O que você já dominou</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.history && profile.history.length > 0 ? (
                      profile.history.map((lesson, idx) => (
                        <button 
                           key={idx}
                           onClick={() => setViewingHistoryLesson(lesson)}
                           className="bento-card group flex flex-col justify-between !p-8 bg-slate-900 hover:bg-brand-accent hover:border-white transition-all text-left min-h-[250px]"
                        >
                          <div>
                             <div className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-accent group-hover:text-white/80 mb-4 transition-colors">Lesson Fragment</div>
                             <div className="text-3xl font-serif italic text-white group-hover:text-slate-950 transition-colors leading-tight mb-4">{lesson.title}</div>
                          </div>
                          <div className="flex items-center justify-between border-t border-slate-800 pt-6 group-hover:border-slate-950/20 transition-colors">
                             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-950/60 transition-colors">Finalizada</div>
                             <ChevronRight className="text-slate-400 group-hover:text-slate-950 transition-colors" />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full py-32 flex flex-col items-center justify-center text-center border-4 border-dashed border-slate-800 rounded-[3.5rem]">
                        <BookMarked className="text-slate-700 mb-6" size={80} />
                        <h4 className="text-3xl serif italic text-slate-400 mb-4">Seu álbum está em branco</h4>
                        <p className="text-slate-600 font-sans font-black text-lg max-w-sm px-6">Comece sua primeira lição para guardar momentos aqui.</p>
                      </div>
                    )}
                 </div>
              </motion.div>
            )}

            {activeTab === 'dictionary' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                 <div className="flex flex-col gap-1">
                    <div className="text-[10px] uppercase tracking-[0.5em] font-black text-brand-accent">Dicionário Sentimental</div>
                    <h2 className="text-5xl serif italic text-white tracking-tighter">Palavras com significado</h2>
                    <p className="text-slate-400 font-sans font-black text-lg max-w-2xl mt-4">Termos e frases que você escolheu salvar por se conectarem com a sua vida.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.savedWords && profile.savedWords.length > 0 ? (
                      profile.savedWords.map((item, idx) => (
                        <div key={idx} className="bento-card relative bg-slate-900 border-2 border-slate-800 p-8 hover:border-red-500 transition-all flex flex-col justify-between group h-64">
                           <div className="absolute top-6 right-6">
                              <Heart size={24} className="text-red-500 fill-red-500" />
                           </div>
                           <div>
                              <div className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mb-4">Word Fragment</div>
                              <h3 className="text-4xl text-white font-serif italic tracking-tighter group-hover:text-red-400 transition-colors leading-tight">{item.word}</h3>
                           </div>
                           <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800">
                             <div className="flex flex-col">
                               <span className="text-slate-400 font-sans font-black text-xl italic">{item.meaning}</span>
                               <span className="text-[9px] uppercase tracking-widest text-slate-600 mt-1">{new Date(item.date).toLocaleDateString()}</span>
                             </div>
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => speak(item.word)}
                                  className="p-3 bg-slate-800 text-white rounded-xl hover:bg-brand-accent transition-all"
                                >
                                  <Volume2 size={20} />
                                </button>
                                <button 
                                  onClick={() => onRemoveWord(item.word)}
                                  className="p-3 bg-slate-800 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <Trash2 size={20} />
                                </button>
                             </div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-32 flex flex-col items-center justify-center text-center border-4 border-dashed border-slate-800 rounded-[3.5rem]">
                        <Heart className="text-slate-700 mb-6 opacity-20" size={80} />
                        <h4 className="text-3xl serif italic text-slate-400 mb-4">Nenhuma palavra guardada ainda</h4>
                        <p className="text-slate-600 font-sans font-black text-lg max-w-sm px-6">Toque no coração ao lado de novas palavras para salvá-las aqui.</p>
                      </div>
                    )}
                 </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SentenceScramble({ data }: { data: { sentence: string; translation: string } }) {
  const words = data.sentence.split(' ');
  const [shuffled, setShuffled] = useState(() => [...words].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const toggleWord = (word: string, index: number, isRemoving: boolean) => {
    if (isRemoving) {
      setCurrent(current.filter((_, i) => i !== index));
      setShuffled([...shuffled, word]);
    } else {
      const newCurrent = [...current, word];
      setCurrent(newCurrent);
      setShuffled(shuffled.filter((_, i) => i !== index));
      
      if (newCurrent.join(' ') === data.sentence) {
        setIsCorrect(true);
      }
    }
  };

  return (
    <div className="space-y-8 text-slate-950 dark:text-white">
      <div>
        <p className="text-slate-800 dark:text-slate-200 font-serif mb-4">Monte esta frase: <span className="italic font-bold">"{data.translation}"</span></p>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border-4 border-dashed border-slate-400 dark:border-slate-800">
          {current.map((word, i) => (
            <motion.button
              layoutId={`word-${word}-${i}`}
              key={`${word}-${i}`}
              onClick={() => toggleWord(word, i, true)}
              className="bg-brand-accent text-white dark:bg-white dark:text-slate-950 px-4 py-2 rounded-lg font-black shadow-md border-2 border-slate-950 dark:border-brand-accent"
            >
              {word}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {shuffled.map((word, i) => (
          <motion.button
             layoutId={`word-${word}-${i}`}
             key={`${word}-${i}`}
             onClick={() => toggleWord(word, i, false)}
             disabled={isCorrect}
             className="bg-white dark:bg-slate-700 border-4 border-slate-950 dark:border-slate-500 text-slate-950 dark:text-white px-4 py-2 rounded-lg font-black hover:bg-brand-accent hover:text-white transition-all shadow-sm"
          >
             {word}
          </motion.button>
        ))}
      </div>

      {isCorrect && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-400 rounded-2xl border-4 border-green-600 dark:border-green-800 flex items-center justify-center font-black gap-3"
        >
          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
          Frase montada com sucesso!
        </motion.div>
      )}
    </div>
  );
}

function RecommendationIcon({ type }: { type: string }) {
  switch (type) {
    case 'music': return <Music size={20} />;
    case 'movie': return <Film size={20} />;
    case 'video': return <Video size={20} />;
    case 'podcast': return <Mic2 size={20} />;
    default: return <Book size={20} />;
  }
}

function Flashcard({ word, meaning, onSpeak }: { word: string; meaning: string; onSpeak: (text: string) => void }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      onClick={() => setIsFlipped(!isFlipped)}
      className="perspective-1000 h-64 cursor-pointer group"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-sm group-hover:border-brand-accent transition-all group-hover:shadow-xl group-hover:shadow-slate-200/50">
          <div className="text-[9px] uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-4 font-black">English</div>
          <div className="text-4xl font-black text-brand-primary dark:text-white tracking-tighter">{word}</div>
          <button 
            onClick={(e) => { e.stopPropagation(); onSpeak(word); }}
            className="mt-6 w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:bg-brand-accent hover:text-white transition-all shadow-sm"
          >
            <Mic size={24} />
          </button>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-brand-primary rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="text-[9px] uppercase tracking-widest text-slate-100/60 mb-4 font-black">Translation</div>
          <div className="text-3xl italic serif text-white leading-tight">{meaning}</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LessonQuiz({ quiz }: { quiz: { question: string; options: string[]; answer: string } }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="space-y-6">
      <h4 className="text-2xl serif text-brand-primary italic">{quiz.question}</h4>
      <div className="grid grid-cols-1 gap-3">
        {quiz.options.map(opt => (
          <button
            key={opt}
            onClick={() => {
              setSelected(opt);
              setShowResult(true);
            }}
            className={`w-full p-6 rounded-2xl text-left border-4 transition-all font-sans font-black text-lg ${
              selected === opt 
                ? (opt === quiz.answer ? "border-green-600 bg-green-50 text-green-900" : "border-red-600 bg-red-50 text-red-900")
                : "border-slate-300 dark:border-slate-600 hover:border-brand-accent bg-white dark:bg-slate-800 text-slate-950 dark:text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {showResult && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }} 
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl font-bold flex items-center gap-3 ${selected === quiz.answer ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"}`}
        >
          {selected === quiz.answer ? (
            <>Muito bem! Você acertou!</>
          ) : (
            <>Tente novamente! A resposta correta era: {quiz.answer}</>
          )}
        </motion.div>
      )}
    </div>
  );
}

function Star({ size, fill }: { size: number, fill: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill={fill} 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
