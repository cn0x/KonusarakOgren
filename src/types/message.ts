export type Mood = 'pozitif' | 'nötr' | 'negatif' | 'happy' | 'neutral' | 'sad';

export interface Message {
  id: string;
  text: string;
  mood: Mood;
  color: string;
  timestamp: Date;
  fromUser: boolean;
  summary?: string;
  recommendation?: string;
}

