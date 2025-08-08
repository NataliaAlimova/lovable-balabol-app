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
  const [startTime, setStartTime] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastMoveX, setLastMoveX] = useState(0);
  const [isInCommitZone, setIsInCommitZone] = useState(false);

  const calculateVelocity = (currentX: number, currentTime: number) => {
    if (lastMoveTime === 0) return 0;
    const timeDiff = currentTime - lastMoveTime;
    const distanceDiff = Math.abs(currentX - lastMoveX);
    return timeDiff > 0 ? distanceDiff / timeDiff : 0;
  };

  const getScreenWidth = () => window.innerWidth || 375;
  const getCommitThreshold = () => getScreenWidth() * 0.4; // 40% of screen width
  const getMinVelocity = () => 0.5; // Minimum velocity for intentional swipe

  const handleTouchStart = (e: React.TouchEvent) => {
    const currentTime = Date.now();
    const currentX = e.touches[0].clientX;
    
    setStartX(currentX);
    setStartTime(currentTime);
    setLastMoveX(currentX);
    setLastMoveTime(currentTime);
    setIsDragging(true);
    setVelocity(0);
    setIsInCommitZone(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentTime = Date.now();
    const currentX = e.touches[0].clientX;
    const offset = currentX - startX;
    
    // Calculate velocity
    const currentVelocity = calculateVelocity(currentX, currentTime);
    setVelocity(currentVelocity);
    
    // Update position tracking
    setLastMoveX(currentX);
    setLastMoveTime(currentTime);
    setDragOffset(offset);
    
    // Check if in commit zone
    const commitThreshold = getCommitThreshold();
    const inCommitZone = Math.abs(offset) > commitThreshold;
    setIsInCommitZone(inCommitZone);
    
    // Add haptic feedback when entering commit zone
    if (inCommitZone && !isInCommitZone && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const commitThreshold = getCommitThreshold();
    const minVelocity = getMinVelocity();
    const timeDuration = Date.now() - startTime;
    
    // Only trigger swipe if:
    // 1. Distance threshold is met AND
    // 2. Velocity is sufficient (indicating intentional swipe) AND
    // 3. Gesture wasn't too slow (max 2 seconds)
    const shouldTriggerSwipe = 
      Math.abs(dragOffset) > commitThreshold && 
      velocity > minVelocity && 
      timeDuration < 2000;
    
    if (shouldTriggerSwipe) {
      if (dragOffset > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    // Reset all state
    setDragOffset(0);
    setIsDragging(false);
    setVelocity(0);
    setIsInCommitZone(false);
    setStartTime(0);
    setLastMoveTime(0);
    setLastMoveX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const currentTime = Date.now();
    const currentX = e.clientX;
    
    setStartX(currentX);
    setStartTime(currentTime);
    setLastMoveX(currentX);
    setLastMoveTime(currentTime);
    setIsDragging(true);
    setVelocity(0);
    setIsInCommitZone(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const currentTime = Date.now();
    const currentX = e.clientX;
    const offset = currentX - startX;
    
    // Calculate velocity
    const currentVelocity = calculateVelocity(currentX, currentTime);
    setVelocity(currentVelocity);
    
    // Update position tracking
    setLastMoveX(currentX);
    setLastMoveTime(currentTime);
    setDragOffset(offset);
    
    // Check if in commit zone
    const commitThreshold = getCommitThreshold();
    const inCommitZone = Math.abs(offset) > commitThreshold;
    setIsInCommitZone(inCommitZone);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const commitThreshold = getCommitThreshold();
    const minVelocity = getMinVelocity();
    const timeDuration = Date.now() - startTime;
    
    // Only trigger swipe if conditions are met
    const shouldTriggerSwipe = 
      Math.abs(dragOffset) > commitThreshold && 
      velocity > minVelocity && 
      timeDuration < 2000;
    
    if (shouldTriggerSwipe) {
      if (dragOffset > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }
    
    // Reset all state
    setDragOffset(0);
    setIsDragging(false);
    setVelocity(0);
    setIsInCommitZone(false);
    setStartTime(0);
    setLastMoveTime(0);
    setLastMoveX(0);
  };

  const getDisplayText = () => {
    if (!showTranslation) {
      return nativeFirst ? word.word : word.translation;
    }
    return nativeFirst ? word.translation : word.word;
  };

  const getCardBackground = () => {
    const commitThreshold = getCommitThreshold();
    
    if (isInCommitZone && velocity > getMinVelocity()) {
      return dragOffset > 0 ? 'flashcard-learned' : 'flashcard-not-learned';
    } else if (Math.abs(dragOffset) > commitThreshold * 0.7) {
      // Show weaker visual cue when approaching commit zone
      return dragOffset > 0 ? 'flashcard-learned-preview' : 'flashcard-not-learned-preview';
    }
    return 'flashcard';
  };

  const rotation = dragOffset * 0.05;
  const opacity = Math.max(0.8, 1 - Math.abs(dragOffset) * 0.001);

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
          <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            isInCommitZone && velocity > getMinVelocity()
              ? dragOffset > 0 
                ? 'bg-success text-success-foreground opacity-100 scale-110' 
                : 'bg-destructive text-destructive-foreground opacity-100 scale-110'
              : dragOffset > 0 
                ? 'bg-success/60 text-success-foreground opacity-80 scale-100' 
                : 'bg-destructive/60 text-destructive-foreground opacity-80 scale-100'
          }`}>
            {isInCommitZone && velocity > getMinVelocity() 
              ? (dragOffset > 0 ? '✓ Learned!' : '✗ Not Learned!')
              : (dragOffset > 0 ? '→ Keep going...' : '← Keep going...')
            }
          </div>
        </div>
      )}
    </div>
  );
};