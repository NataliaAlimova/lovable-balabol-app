import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Upload, Languages } from 'lucide-react';

interface HeaderBarProps {
  nativeFirst: boolean;
  onToggleLanguage: () => void;
  onImport: () => void;
  totalWords: number;
}

export const HeaderBar = ({ 
  nativeFirst, 
  onToggleLanguage, 
  onImport, 
  totalWords 
}: HeaderBarProps) => {
  return (
    <div className="bg-card border-b border-border p-3 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🌿 WordLearn
          </h1>
          <div className="text-xs text-muted-foreground hidden sm:block">
            {totalWords} words
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Languages className="h-3 w-3" />
            <Label htmlFor="language-toggle" className="text-xs hidden sm:inline">
              Native first
            </Label>
            <Switch
              id="language-toggle"
              checked={nativeFirst}
              onCheckedChange={onToggleLanguage}
              className="scale-75"
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={onImport} className="text-xs px-2 py-1">
            <Upload className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Import</span>
          </Button>
        </div>
      </div>
    </div>
  );
};