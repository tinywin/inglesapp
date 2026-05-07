export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface LessonContent {
  title: string;
  intro: string;
  story: string;
  translation: string;
  vocabulary: { word: string; meaning: string }[];
  encouragement: string;
  quiz?: { question: string; options: string[]; answer: string };
  scramble?: { sentence: string; translation: string };
  funFact?: string;
  recommendations?: { type: 'music' | 'movie' | 'video' | 'podcast'; title: string; link?: string }[];
  songLyric?: { english: string; portuguese: string; songTitle: string; artist: string };
  imagePrompt?: string;
}

export interface UserProfile {
  name: string;
  age: string;
  interests: string[];
  lifeExperience: string;
  difficulty: Difficulty;
  history?: LessonContent[];
  savedWords?: { word: string; meaning: string; date: number }[];
  dailyChallengeDone?: boolean;
  lastChallengeDate?: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'health' | 'family' | 'experience';
  content: string;
  vocabulary: { word: string; translation: string }[];
}
