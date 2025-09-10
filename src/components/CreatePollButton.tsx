import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, X, Loader2 } from 'lucide-react';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/use-toast';

interface PollOption {
  emoji: string;
  text: string;
}

export const CreatePollButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pollTitle, setPollTitle] = useState('');
  const [pollDescription, setPollDescription] = useState('');
  const [duration, setDuration] = useState(7); // days
  const [options, setOptions] = useState<PollOption[]>([
    { emoji: '👍', text: 'Yes' },
    { emoji: '👎', text: 'No' },
  ]);
  const { createPoll, isLoading } = useContract();
  const { toast } = useToast();

  const addOption = () => {
    setOptions([...options, { emoji: '🤔', text: '' }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: 'emoji' | 'text', value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleCreate = async () => {
    if (!pollTitle.trim() || options.some(opt => !opt.text.trim())) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!window.nightly && typeof window.ethereum === 'undefined') {
      toast({
        title: "Wallet Required",
        description: "Please install and connect a Web3 wallet (MetaMask, Nightly, etc.) to create a poll.",
        variant: "destructive",
      });
      return;
    }

    try {
      const emojis = options.map(opt => opt.emoji);
      const texts = options.map(opt => opt.text);
      const durationInSeconds = duration * 24 * 60 * 60; // Convert days to seconds

      const tx = await createPoll(pollTitle, pollDescription, emojis, texts, durationInSeconds);
      
      if (tx) {
        setIsOpen(false);
        // Reset form
        setPollTitle('');
        setPollDescription('');
        setDuration(7);
        setOptions([
          { emoji: '👍', text: 'Yes' },
          { emoji: '👎', text: 'No' },
        ]);
      }
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="poll" size="lg" className="w-full sm:w-auto">
          <Plus className="w-5 h-5" />
          Create New Poll
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">📊</span>
            Create Encrypted Poll
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="poll-title" className="text-sm font-medium">
              Poll Question
            </Label>
            <Input
              id="poll-title"
              placeholder="What's your favorite emoji? 🤔"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poll-description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Input
              id="poll-description"
              placeholder="Add more context about your poll..."
              value={pollDescription}
              onChange={(e) => setPollDescription(e.target.value)}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poll-duration" className="text-sm font-medium">
              Duration (Days)
            </Label>
            <Input
              id="poll-duration"
              type="number"
              min="1"
              max="30"
              placeholder="7"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 7)}
              className="h-12 text-base"
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-sm font-medium">Options</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="🤔"
                  value={option.emoji}
                  onChange={(e) => updateOption(index, 'emoji', e.target.value)}
                  className="w-16 h-12 text-center text-xl"
                  maxLength={2}
                />
                <Input
                  placeholder="Option text"
                  value={option.text}
                  onChange={(e) => updateOption(index, 'text', e.target.value)}
                  className="flex-1 h-12"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="h-12 w-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 6 && (
              <Button
                variant="outline"
                onClick={addOption}
                className="w-full h-12 text-muted-foreground border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="emoji"
              onClick={handleCreate}
              disabled={!pollTitle.trim() || options.some(opt => !opt.text.trim()) || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Poll 🚀'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};