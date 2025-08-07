export interface Word {
  id: string;
  word: string;
  translation: string;
  status: 'learning' | 'learned' | 'not-learned';
  createdAt: Date;
  lastReviewed?: Date;
}

export interface AppState {
  words: Word[];
  currentWordIndex: number;
  showTranslation: boolean;
  nativeFirst: boolean;
  importedWordsCount: number;
}

export type TabType = 'learn' | 'not-learned' | 'learned';