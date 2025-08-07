import { useState, useEffect } from 'react';
import { Word, AppState } from '@/types';

const STORAGE_KEY = 'wordlearner-data';

export const useWords = () => {
  const [state, setState] = useState<AppState>({
    words: [],
    currentWordIndex: 0,
    showTranslation: false,
    nativeFirst: true,
    importedWordsCount: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsedState.words = parsedState.words.map((word: any) => ({
          ...word,
          createdAt: new Date(word.createdAt),
          lastReviewed: word.lastReviewed ? new Date(word.lastReviewed) : undefined,
        }));
        setState(parsedState);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const importWordsFromCSV = (csvContent: string) => {
    const lines = csvContent.trim().split('\n');
    const newWords: Word[] = lines.map((line, index) => {
      const [word, translation] = line.split(',').map(s => s.trim().replace(/"/g, ''));
      return {
        id: `${Date.now()}-${index}`,
        word: word || '',
        translation: translation || '',
        status: 'learning' as const,
        createdAt: new Date(),
      };
    }).filter(word => word.word && word.translation);

    setState(prev => ({
      ...prev,
      words: [...prev.words, ...newWords],
      importedWordsCount: prev.importedWordsCount + newWords.length,
    }));

    return newWords.length;
  };

  const markWord = (status: 'learned' | 'not-learned') => {
    setState(prev => {
      const currentWord = prev.words.find((_, index) => index === prev.currentWordIndex);
      if (!currentWord) return prev;

      const updatedWords = prev.words.map((word, index) => 
        index === prev.currentWordIndex 
          ? { ...word, status, lastReviewed: new Date() }
          : word
      );

      const learningWords = updatedWords.filter(w => w.status === 'learning');
      const nextIndex = learningWords.length > 0 
        ? updatedWords.findIndex(w => w.status === 'learning')
        : 0;

      return {
        ...prev,
        words: updatedWords,
        currentWordIndex: nextIndex,
        showTranslation: false,
      };
    });
  };

  const toggleTranslation = () => {
    setState(prev => ({ ...prev, showTranslation: !prev.showTranslation }));
  };

  const toggleLanguageOrder = () => {
    setState(prev => ({ ...prev, nativeFirst: !prev.nativeFirst }));
  };

  const resetWord = (wordId: string) => {
    setState(prev => ({
      ...prev,
      words: prev.words.map(word =>
        word.id === wordId ? { ...word, status: 'learning' } : word
      ),
    }));
  };

  const getWordsByStatus = (status: Word['status']) => {
    return state.words.filter(word => word.status === status);
  };

  const getCurrentWord = () => {
    const learningWords = getWordsByStatus('learning');
    return learningWords[0] || null;
  };

  return {
    state,
    importWordsFromCSV,
    markWord,
    toggleTranslation,
    toggleLanguageOrder,
    resetWord,
    getWordsByStatus,
    getCurrentWord,
  };
};