import { Word } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface WordListProps {
  words: Word[];
  title: string;
  onResetWord?: (wordId: string) => void;
  emptyMessage: string;
}

export const WordList = ({ words, title, onResetWord, emptyMessage }: WordListProps) => {
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-6xl mb-4 opacity-20">📚</div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-3">
        {words.map((word) => (
          <Card key={word.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium">{word.word}</div>
                <div className="text-sm text-muted-foreground">{word.translation}</div>
                {word.lastReviewed && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Reviewed: {word.lastReviewed.toLocaleDateString()}
                  </div>
                )}
              </div>
              {onResetWord && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResetWord(word.id)}
                  className="ml-2"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};