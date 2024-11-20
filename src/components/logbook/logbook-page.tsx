import { useState } from 'react';
import { useLogbook } from '@/hooks/use-logbook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { LogbookEntryForm } from './logbook-entry-form';
import { LogbookEntryCard } from './logbook-entry-card';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = ['maintenance', 'issue', 'solution', 'observation', 'other'] as const;

export function LogbookPage() {
  const { entries, addEntry, updateEntry, deleteEntry, addImage, deleteImage } = useLogbook();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get unique tags from all entries
  const allTags = Array.from(
    new Set(entries.flatMap((entry) => entry.tags))
  ).sort();

  // Filter entries based on search term, category, and tags
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      searchTerm === '' ||
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' || entry.category === selectedCategory;

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => entry.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  return (
    <div className="container max-w-6xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Logbook</CardTitle>
          <LogbookEntryForm onSubmit={(entry) => addEntry({ ...entry, images: [] })}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </LogbookEntryForm>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {/* <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button> */}
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Entries */}
            <div className="grid gap-6">
              {filteredEntries.map((entry) => (
                <LogbookEntryCard
                  key={entry.id}
                  entry={entry}
                  onUpdate={(updates) => updateEntry(entry.id, updates)}
                  onDelete={() => deleteEntry(entry.id)}
                  onAddImage={(image) => addImage(entry.id, image)}
                  onDeleteImage={(imageId) => deleteImage(entry.id, imageId)}
                />
              ))}
              {filteredEntries.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No entries found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}