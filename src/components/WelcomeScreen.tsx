import { useState } from "react";
import { UserProfile, Difficulty } from "../types";
import { motion } from "motion/react";
import { Heart, User, Star, BookOpen } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [lifeExperience, setLifeExperience] = useState("");

  const commonInterests = [
    "Cozinha", "Jardinagem", "Família", "Viagens", 
    "Música (Rock, Pop, Jazz, etc)", "Saúde", "Religião", 
    "Jogos (Online, RPG, Tabuleiro)", "Séries de TV", "Desenhos Animados",
    "Cinema", "Esportes", "Tecnologia", "Artes e Pintura",
    "Cultura Asiática (Anime, K-pop)", "Cultura Latina", "Cultura Europeia",
    "Natureza", "História", "Animais de Estimação"
  ];
  const ageGroups = ["10-20", "20-30", "30-40", "40-50", "50-60", "60-70", "70-80", "80+"];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const next = () => setStep(step + 1);

  return (
    <div className="max-w-xl mx-auto px-6 py-20 relative">
      <div className="text-center mb-16 relative z-10">
        <div className="text-[10px] uppercase tracking-[0.6em] font-bold text-brand-accent mb-6 animate-pulse">Unlock your voice</div>
        <h1 className="text-6xl md:text-8xl text-slate-950 dark:text-brand-accent serif italic mb-6 leading-tight tracking-tighter drop-shadow-sm">Elo</h1>
        <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl font-sans max-w-xs mx-auto leading-relaxed font-black opacity-90">Aprendizado de inglês que se conecta com a sua vida.</p>
      </div>

      <div className="bento-card !p-8 md:!p-12 min-h-[500px] flex flex-col relative overflow-hidden backdrop-blur-xl bg-slate-800/90">
        <div className="absolute -top-10 -left-10 serif text-[80px] md:text-[140px] font-bold text-slate-700/30 select-none -z-10">
          0{step}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl mb-3 serif italic text-white">Como podemos te chamar?</h2>
              <p className="text-slate-300 font-serif leading-relaxed font-black text-sm md:text-base">Não precisa ser o nome completo, apenas como você gosta de ser tratado pelos amigos.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-[2rem] mb-12 border-4 border-white focus-within:border-brand-accent transition-all shadow-xl">
              <User className="text-white" size={24} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Laura"
                className="bg-transparent border-none outline-none text-2xl w-full font-sans font-black text-white placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <button 
              disabled={!name}
              onClick={next}
              className="accent-button w-full disabled:opacity-50 !py-6 text-xl tracking-wide uppercase font-black"
            >
              Começar
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl mb-3 serif italic text-white">Qual a sua idade?</h2>
              <p className="text-slate-300 font-serif leading-relaxed font-black text-sm md:text-base">Isso nos ajuda a sugerir conteúdos e músicas da sua época.</p>
            </div>
            <div className="flex flex-wrap gap-3 mb-12">
              {ageGroups.map(group => (
                <button
                  key={group}
                  onClick={() => setAge(group)}
                  className={`px-8 py-4 rounded-2xl border-4 transition-all font-sans font-black text-lg ${
                    age === group 
                      ? "bg-brand-accent border-brand-accent text-slate-950 shadow-xl scale-105" 
                      : "border-white text-white hover:bg-brand-accent hover:text-white bg-slate-700"
                  }`}
                >
                  {group} anos
                </button>
              ))}
            </div>
            <button 
              disabled={!age}
              onClick={next}
              className="accent-button w-full disabled:opacity-50 !py-6 text-xl uppercase font-black"
            >
              Isso mesmo
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl mb-3 serif italic text-white">O que te encanta?</h2>
              <p className="text-slate-300 font-serif leading-relaxed font-black text-sm md:text-base">Isso nos ajuda a criar lições que façam sentido no seu dia a dia.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-12">
              {commonInterests.map(item => (
                <button
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`px-5 py-3 rounded-[1.5rem] border-2 transition-all font-sans font-black text-sm ${
                    interests.includes(item) 
                      ? "bg-brand-secondary border-brand-secondary text-slate-950 shadow-lg" 
                      : "border-white text-white hover:bg-brand-secondary hover:text-white bg-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <button 
              disabled={interests.length === 0}
              onClick={next}
              className="accent-button w-full disabled:opacity-50 !py-6 text-xl uppercase font-black"
            >
              É a minha cara
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl mb-3 serif italic text-white">Sobre a sua história</h2>
              <p className="text-slate-300 font-serif leading-relaxed font-black italic text-sm md:text-base">"De onde você vem? Teve alguma profissão marcante? O que te move hoje?"</p>
            </div>
            <textarea
              value={lifeExperience}
              onChange={(e) => setLifeExperience(e.target.value)}
              placeholder="Ex: Sou gamer, adoro cultura pop e RPG de mesa..."
              className="w-full bg-slate-900 p-8 rounded-[2rem] mb-12 min-h-[150px] outline-none border-4 border-white text-xl font-sans font-black text-white placeholder:text-slate-400 resize-none focus:border-brand-accent transition-all shadow-xl"
            />
            <button 
              onClick={() => onComplete({
                name,
                age,
                interests,
                lifeExperience,
                difficulty: Difficulty.BEGINNER
              })}
              className="accent-button w-full !py-6 text-xl uppercase font-black tracking-widest"
            >
              Pronto para Elo!
            </button>
          </motion.div>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-12">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${step === i ? "bg-brand-accent w-6" : "bg-slate-300 dark:bg-slate-600"}`}
          />
        ))}
      </div>
    </div>
  );
}
