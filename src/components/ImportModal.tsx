import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (csvContent: string) => number;
}

export const ImportModal = ({ isOpen, onClose, onImport }: ImportModalProps) => {
  const [csvContent, setCsvContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!csvContent.trim()) {
      toast({
        title: "Error",
        description: "Please provide CSV content or upload a file",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const importedCount = onImport(csvContent);
      toast({
        title: "Success!",
        description: `Imported ${importedCount} words successfully`,
      });
      setCsvContent('');
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import words. Please check your CSV format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleCSV = `hello, hola
goodbye, adiós
thank you, gracias
please, por favor`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Import Words</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="text-sm font-medium">
              Upload CSV File
            </Label>
            <div className="mt-2">
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose CSV File
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or paste CSV content
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="csv-content" className="text-sm font-medium">
              CSV Content
            </Label>
            <Textarea
              id="csv-content"
              placeholder={`Format: word, translation\n\nExample:\n${sampleCSV}`}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="mt-2 min-h-[120px] resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={isLoading || !csvContent.trim()}
              className="flex-1"
            >
              {isLoading ? 'Importing...' : 'Import Words'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};