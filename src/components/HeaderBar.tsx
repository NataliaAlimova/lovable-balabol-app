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
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            WordLearn
          </h1>
          <div className="text-sm text-muted-foreground">
            {totalWords} words
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <Label htmlFor="language-toggle" className="text-sm">
              Native first
            </Label>
            <Switch
              id="language-toggle"
              checked={nativeFirst}
              onCheckedChange={onToggleLanguage}
            />
          </div>
          
          <Button variant="outline" size="sm" onClick={onImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};