import { TabType } from '@/types';
import { Button } from '@/components/ui/button';
import { BookOpen, X, Check } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  learningCount: number;
  notLearnedCount: number;
  learnedCount: number;
}

export const BottomNavigation = ({ 
  activeTab, 
  onTabChange, 
  learningCount,
  notLearnedCount,
  learnedCount 
}: BottomNavigationProps) => {
  const tabs = [
    {
      id: 'learn' as TabType,
      label: 'Learn',
      icon: BookOpen,
      count: learningCount,
      colorClass: 'tab-learn',
    },
    {
      id: 'not-learned' as TabType,
      label: 'Review',
      icon: X,
      count: notLearnedCount,
      colorClass: 'tab-review',
    },
    {
      id: 'learned' as TabType,
      label: 'Learned',
      icon: Check,
      count: learnedCount,
      colorClass: 'tab-learned',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-3 px-6 min-w-0 flex-1 transition-all duration-200 ${
                isActive ? tab.colorClass : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
                  isActive ? 'bg-current/20' : 'bg-muted'
                }`}>
                  {tab.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};