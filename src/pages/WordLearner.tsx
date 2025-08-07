import { useState } from 'react';
import { TabType } from '@/types';
import { useWords } from '@/hooks/useWords';
import { HeaderBar } from '@/components/HeaderBar';
import { LearnView } from '@/components/LearnView';
import { WordList } from '@/components/WordList';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ImportModal } from '@/components/ImportModal';

export const WordLearner = () => {
  const [activeTab, setActiveTab] = useState<TabType>('learn');
  const [showImportModal, setShowImportModal] = useState(false);
  
  const {
    state,
    importWordsFromCSV,
    markWord,
    toggleTranslation,
    toggleLanguageOrder,
    resetWord,
    getWordsByStatus,
    getCurrentWord,
  } = useWords();

  const currentWord = getCurrentWord();
  const learningWords = getWordsByStatus('learning');
  const notLearnedWords = getWordsByStatus('not-learned');
  const learnedWords = getWordsByStatus('learned');

  const handleImportWords = (csvContent: string) => {
    return importWordsFromCSV(csvContent);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'learn':
        return (
          <LearnView
            currentWord={currentWord}
            showTranslation={state.showTranslation}
            nativeFirst={state.nativeFirst}
            onTap={toggleTranslation}
            onSwipeLeft={() => markWord('not-learned')}
            onSwipeRight={() => markWord('learned')}
            onImport={() => setShowImportModal(true)}
          />
        );
      case 'not-learned':
        return (
          <WordList
            words={notLearnedWords}
            title="Words to Review"
            onResetWord={resetWord}
            emptyMessage="No words need review. Great job!"
          />
        );
      case 'learned':
        return (
          <WordList
            words={learnedWords}
            title="Learned Words"
            onResetWord={resetWord}
            emptyMessage="No words learned yet. Start practicing!"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <HeaderBar
        nativeFirst={state.nativeFirst}
        onToggleLanguage={toggleLanguageOrder}
        onImport={() => setShowImportModal(true)}
        totalWords={state.words.length}
      />
      
      <main className="flex-1 overflow-hidden pb-20">
        {renderContent()}
      </main>
      
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        learningCount={learningWords.length}
        notLearnedCount={notLearnedWords.length}
        learnedCount={learnedWords.length}
      />
      
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportWords}
      />
    </div>
  );
};