/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { UserProfile, Difficulty, Message } from "./types";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { Dashboard } from "./components/Dashboard";
import { Chatbot } from "./components/Chatbot";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Sun, Moon } from "lucide-react";

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);

  // Load from local storage and check for new day
  useEffect(() => {
    const saved = localStorage.getItem("elo_profile");
    if (saved) {
      const parsed = JSON.parse(saved) as UserProfile;
      if (!parsed.age) {
        localStorage.removeItem("elo_profile");
        setProfile(null);
      } else {
        // Reset daily challenge if it's a new day
        const today = new Date().toLocaleDateString();
        if (parsed.lastChallengeDate !== today) {
          parsed.dailyChallengeDone = false;
        }
        setProfile(parsed);
      }
    }
  }, []);

  const handleProfileComplete = (newProfile: UserProfile) => {
    const today = new Date().toLocaleDateString();
    const profileWithHistory = { 
      ...newProfile, 
      history: newProfile.history || [],
      dailyChallengeDone: false,
      lastChallengeDate: today
    };
    setProfile(profileWithHistory);
    localStorage.setItem("elo_profile", JSON.stringify(profileWithHistory));
  };

  const handleUpdateProfile = (updatedData: Partial<UserProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updatedData };
    setProfile(newProfile);
    localStorage.setItem("elo_profile", JSON.stringify(newProfile));
  };

  const saveLessonToHistory = (lesson: any) => {
    if (!profile) return;
    const updatedProfile = {
      ...profile,
      history: [lesson, ...(profile.history || [])].slice(0, 20) // Keep last 20
    };
    setProfile(updatedProfile);
    localStorage.setItem("elo_profile", JSON.stringify(updatedProfile));
  };

  const handleSaveWord = (word: string, meaning: string) => {
    if (!profile) return;
    const wordExists = profile.savedWords?.some(w => w.word.toLowerCase() === word.toLowerCase());
    if (wordExists) return;

    const updatedProfile: UserProfile = {
      ...profile,
      savedWords: [{ word, meaning, date: Date.now() }, ...(profile.savedWords || [])]
    };
    setProfile(updatedProfile);
    localStorage.setItem("elo_profile", JSON.stringify(updatedProfile));
  };

  const handleRemoveWord = (word: string) => {
    if (!profile) return;
    const updatedProfile = {
      ...profile,
      savedWords: (profile.savedWords || []).filter(w => w.word !== word)
    };
    setProfile(updatedProfile);
    localStorage.setItem("elo_profile", JSON.stringify(updatedProfile));
  };

  const handleCompleteChallenge = () => {
    if (!profile) return;
    const today = new Date().toLocaleDateString();
    const updatedProfile = {
      ...profile,
      dailyChallengeDone: true,
      lastChallengeDate: today
    };
    setProfile(updatedProfile);
    localStorage.setItem("elo_profile", JSON.stringify(updatedProfile));
  };

  const handleReset = () => {
    localStorage.removeItem("elo_profile");
    setProfile(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <AnimatePresence mode="wait">
        {!profile ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-auto"
          >
            <WelcomeScreen onComplete={handleProfileComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 overflow-auto pb-24"
          >
            <Dashboard 
              profile={profile} 
              onReset={handleReset} 
              onSaveLesson={saveLessonToHistory}
              onSaveWord={handleSaveWord}
              onRemoveWord={handleRemoveWord}
              onCompleteChallenge={handleCompleteChallenge}
              onUpdateProfile={handleUpdateProfile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      {profile && (
        <>
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-24 right-4 left-4 md:left-auto md:right-8 md:w-96 z-50 pointer-events-auto"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-slate-800 overflow-hidden h-[550px] flex flex-col">
                  <div className="bg-white dark:bg-slate-900 p-6 border-b border-stone-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <div className="font-bold text-sm tracking-tight uppercase text-brand-primary dark:text-white">Guia Paulo (Assistente)</div>
                    </div>
                    <button 
                      onClick={() => setIsChatOpen(false)}
                      className="p-1 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-full transition-colors text-stone-400"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <Chatbot 
                      profile={profile} 
                      messages={messages} 
                      setMessages={setMessages} 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-8 right-8 px-8 py-4 bg-brand-primary dark:bg-brand-accent text-white dark:text-slate-950 rounded-full shadow-2xl flex items-center gap-3 z-50 hover:scale-105 active:scale-95 transition-all shadow-editorial"
            aria-label="Falar com o guia"
          >
            <MessageCircle size={24} />
            <span className="text-sm font-black uppercase tracking-[0.2em] leading-none">Conversar</span>
          </motion.button>

          <footer className="w-full py-12 flex flex-col items-center justify-center border-t border-slate-200 dark:border-slate-800 mt-24">
             <div className="text-slate-600 dark:text-slate-400 font-serif italic text-sm mb-2">Criado com carinho por</div>
             <div className="text-brand-primary font-bold tracking-widest uppercase text-xl">Laura Barbosa</div>
             <a href="https://github.com/tinywin" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-black tracking-widest text-xs mt-2 hover:underline">@tinywin</a>
          </footer>
        </>
      )}
    </div>
  );
}

