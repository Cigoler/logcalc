import { useState } from 'react';
import { useSettings } from '@/hooks/use-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LogbookEntry } from '@/types/logbook';

const CATEGORIES = ['maintenance', 'issue', 'solution', 'observation', 'other'] as const;

interface LogbookEntryFormProps {
  onSubmit: (entry: Omit<LogbookEntry, 'id' | 'timestamp' | 'images'>) => void;
  initialValues?: Partial<LogbookEntry>;
  children?: React.ReactNode;
}

export function LogbookEntryForm({ onSubmit, initialValues, children }: LogbookEntryFormProps) {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [category, setCategory] = useState<LogbookEntry['category']>(
    initialValues?.category || 'observation'
  );
  const [tags, setTags] = useState(initialValues?.tags?.join(', ') || '');
  const [diameterId, setDiameterId] = useState(initialValues?.diameterId || 'none');
  const [speed, setSpeed] = useState(initialValues?.speed?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      category,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      diameterId: diameterId === 'none' ? undefined : diameterId,
      speed: speed ? Number(speed) : undefined,
    });
    setOpen(false);
    if (!initialValues) {
      setTitle('');
      setContent('');
      setCategory('observation');
      setTags('');
      setDiameterId('none');
      setSpeed('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? 'Edit Entry' : 'New Logbook Entry'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this entry"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your entry here..."
              required
              className="min-h-[150px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(value: LogbookEntry['category']) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags, separated by commas"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Material (Optional)</Label>
              <Select value={diameterId} onValueChange={setDiameterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No material</SelectItem>
                  {settings.diameters.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.diameter}mm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speed">Speed (Optional)</Label>
              <Input
                id="speed"
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="Enter speed in RPM"
                min="0"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {initialValues ? 'Save Changes' : 'Create Entry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}