
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface TagsInputProps {
  selectedTags: string[];
  availableTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onSelectTag: (tag: string) => void;
}

export function TagsInput({
  selectedTags,
  availableTags,
  onAddTag,
  onRemoveTag,
  onSelectTag,
}: TagsInputProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    onAddTag(newTag.trim());
    setNewTag('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div>
      <Label htmlFor="tags">Tags</Label>
      <div className="mt-2 mb-2">
        {/* Available tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {availableTags.map(tag => (
            <Badge 
              key={tag}
              variant={selectedTags?.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onSelectTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Add custom tag */}
        <div className="flex gap-2">
          <Input
            id="newTag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add custom tag..."
            className="flex-grow"
          />
          <Button 
            type="button"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            size="icon"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Selected tags */}
      {selectedTags && selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          <Label className="w-full text-sm">Selected Tags:</Label>
          {selectedTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onRemoveTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
