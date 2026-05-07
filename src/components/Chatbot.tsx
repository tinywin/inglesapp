import { useState, useRef, useEffect } from "react";
import { Message, UserProfile } from "../types";
import { chatWithGuide } from "../services/geminiService";
import { Send, Loader2, Mic, Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatbotProps {
  profile: UserProfile;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function Chatbot({ profile, messages, setMessages }: ChatbotProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [voiceSlow, setVoiceSlow] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Only speak English parts if possible, but let's just speak the whole content for now 
      // since the system instruction says he helps with English.
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR'; // Assistant usually speaks Portuguese explanation + English examples
      if (text.match(/[a-zA-Z]/)) {
        // Simple heuristic: if it looks like English... actually better to just let the user decide.
        // For now, let's keep it simple.
      }
      utterance.rate = voiceSlow ? 0.6 : 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'model',
        content: `Olá, ${profile.name}! Sou o Guia Elo. Quer conversar um pouquinho em inglês hoje ou tem alguma dúvida sobre o que estamos aprendendo?`,
        timestamp: Date.now()
      }]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithGuide([...messages, userMessage], profile);
      const botMessage: Message = {
        role: 'model',
        content: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'model',
        content: "Oops, tive um probleminha aqui. Podemos tentar de novo?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-brand-bg relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] pointer-events-none"></div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth relative z-10"
      >
        {messages.map((m, i) => (
          <div 
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] md:max-w-[80%] p-5 md:p-6 rounded-3xl shadow-editorial relative ${
              m.role === 'user' 
                ? 'chatbot-bubble-user rounded-tr-none' 
                : 'chatbot-bubble-bot rounded-tl-none'
            }`}>
              <div className="markdown-body font-sans font-black text-base md:text-lg leading-relaxed">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              {m.role === 'model' && (
                <button 
                  onClick={() => speak(m.content)}
                  className="mt-4 flex items-center gap-2 text-white bg-brand-accent px-4 py-2 rounded-xl hover:brightness-110 transition-all w-fit border-2 border-slate-950 dark:border-white font-black text-[10px] uppercase tracking-widest shadow-md"
                >
                  <Volume2 size={14} />
                  Ouvir Pronúncia
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-3xl rounded-tl-none flex items-center gap-3 shadow-editorial border-2 border-slate-200 dark:border-slate-700">
              <Loader2 className="animate-spin text-brand-accent" size={20} />
              <span className="text-brand-primary dark:text-white text-sm font-black uppercase tracking-widest">O Guia está escrevendo...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 relative z-10 flex flex-col gap-4">
        <div className="flex gap-2">
           <button 
             onClick={() => setVoiceSlow(!voiceSlow)}
             className={`flex-1 py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${voiceSlow ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700'}`}
           >
              {voiceSlow ? 'Ritmo: Lento' : 'Falar mais devagar?'}
           </button>
        </div>
        
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tire sua dúvida aqui..."
            className="flex-1 bg-white dark:bg-slate-900 border-4 border-slate-950 dark:border-white rounded-2xl px-6 py-4 outline-none text-lg font-sans font-black shadow-inner focus:border-brand-accent transition-all text-slate-950 dark:text-white placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-brand-accent text-white p-4 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center w-14 h-14 shadow-lg shadow-brand-accent/20"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}
