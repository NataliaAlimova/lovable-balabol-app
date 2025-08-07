import { Word } from '@/types';
import { Flashcard } from './Flashcard';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface LearnViewProps {
  currentWord: Word | null;
  showTranslation: boolean;
  nativeFirst: boolean;
  onTap: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onImport: () => void;
}

export const LearnView = ({
  currentWord,
  showTranslation,
  nativeFirst,
  onTap,
  onSwipeLeft,
  onSwipeRight,
  onImport,
}: LearnViewProps) => {
  if (!currentWord) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold mb-4">Great job!</h2>
        <p className="text-muted-foreground mb-6">
          You've reviewed all your words. Import more to continue learning!
        </p>
        <Button onClick={onImport} className="gap-2">
          <Upload className="h-4 w-4" />
          Import Words
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <Flashcard
          word={currentWord}
          showTranslation={showTranslation}
          nativeFirst={nativeFirst}
          onTap={onTap}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
        />
      </div>
      
      <div className="p-3 text-center shrink-0">
        <p className="text-xs text-muted-foreground mb-3">
          Swipe left for "Not Learned" • Swipe right for "Learned"
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="destructive"
            size="sm"
            onClick={onSwipeLeft}
            className="min-w-[80px] text-xs py-2"
          >
            Not Learned
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onSwipeRight}
            className="min-w-[80px] text-xs py-2 bg-success text-success-foreground hover:bg-success/90"
          >
            Learned
          </Button>
        </div>
      </div>
    </div>
  );
};