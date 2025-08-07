import { useState } from 'react';
import { Word } from '@/types';
import { Card } from '@/components/ui/card';

interface FlashcardProps {
  word: Word;
  showTranslation: boolean;
  nativeFirst: boolean;
  onTap: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const Flashcard = ({ 
  word, 
  showTranslation, 
  nativeFirst, 
  onTap, 
  onSwipeLeft, 
  onSwipeRight 
}: FlashcardProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const offset = currentX - startX;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const offset = e.clientX - startX;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    setDragOffset(0);
    setIsDragging(false);
  };

  const getDisplayText = () => {
    if (!showTranslation) {
      return nativeFirst ? word.word : word.translation;
    }
    return nativeFirst ? word.translation : word.word;
  };

  const getCardBackground = () => {
    if (Math.abs(dragOffset) > 50) {
      return dragOffset > 0 ? 'flashcard-learned' : 'flashcard-not-learned';
    }
    return 'flashcard';
  };

  const rotation = dragOffset * 0.1;
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset) * 0.002);

  return (
    <div className="flex items-center justify-center h-full px-4 py-2">
      <Card
        className={`w-full max-w-xs aspect-[4/5] flex items-center justify-center cursor-pointer select-none ${getCardBackground()}`}
        style={{
          transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
          opacity,
          transition: isDragging ? 'none' : 'var(--transition-spring)',
        }}
        onClick={!isDragging ? onTap : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="text-center p-4">
          <p className="text-xl font-medium leading-relaxed">
            {getDisplayText()}
          </p>
          
          {!showTranslation && (
            <p className="text-xs text-muted-foreground mt-3 opacity-70">
              Tap to reveal
            </p>
          )}
        </div>
      </Card>
      
      {/* Swipe indicators */}
      {Math.abs(dragOffset) > 30 && (
        <div className="absolute inset-x-0 bottom-20 flex justify-center">
          <div className={`px-3 py-1 rounded-full text-xs font-medium transition-opacity ${
            dragOffset > 0 
              ? 'bg-success text-success-foreground opacity-100' 
              : 'bg-destructive text-destructive-foreground opacity-100'
          }`}>
            {dragOffset > 0 ? '✓ Learned' : '✗ Not Learned'}
          </div>
        </div>
      )}
    </div>
  );
};