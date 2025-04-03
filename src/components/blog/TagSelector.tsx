
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogTag } from '@/types/blog';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tagIds: string[]) => void;
}

const TagSelector = ({ selectedTags, onChange }: TagSelectorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTag, setNewTag] = useState('');

  // Fetch tags for the select component
  const { data: tags } = useQuery({
    queryKey: ['blogTags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  const createTag = async (name: string) => {
    const { data, error } = await supabase
      .from('blog_tags')
      .insert([{ name }])
      .select();
      
    if (error) throw error;
    return data[0];
  };

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogTags'] });
    },
    onError: (error) => {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive"
      });
    }
  });

  const handleTagAdd = async () => {
    if (!newTag.trim()) return;
    
    try {
      const existingTag = tags?.find(tag => 
        tag.name.toLowerCase() === newTag.trim().toLowerCase()
      );
      
      let tagId;
      
      if (existingTag) {
        tagId = existingTag.id;
      } else {
        const createdTag = await createTagMutation.mutateAsync(newTag.trim());
        tagId = createdTag.id;
      }
      
      if (!selectedTags.includes(tagId)) {
        onChange([...selectedTags, tagId]);
      }
      
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };
  
  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags?.map((tag: BlogTag) => (
          <Button
            key={tag.id}
            type="button"
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            size="sm"
            onClick={() => handleTagSelect(tag.id)}
          >
            {tag.name}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Input 
          placeholder="Add new tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleTagAdd();
            }
          }}
        />
        <Button 
          type="button" 
          variant="outline"
          onClick={handleTagAdd}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default TagSelector;
