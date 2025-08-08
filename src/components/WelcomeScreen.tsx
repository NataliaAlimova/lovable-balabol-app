import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-background to-muted p-6 text-center">
      <div className="space-y-8 max-w-md">
        {/* Logo and App Name */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/b943041f-cf95-4029-b26a-18bee7b37757.png" 
              alt="Balabol Logo"
              className="w-48 h-auto"
            />
          </div>
          
          {/* Slogan */}
          <p className="text-xl text-muted-foreground font-medium">
            make every count
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg text-foreground leading-relaxed">
            Master foreign words with beautiful flashcards and intuitive swipe gestures
          </p>
          
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <span>📚 Import your word lists</span>
            <span>👆 Swipe to learn or review</span>
            <span>📊 Track your progress</span>
          </div>
        </div>

        {/* Get Started Button */}
        <Button 
          onClick={onGetStarted}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};