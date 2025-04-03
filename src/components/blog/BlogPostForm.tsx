
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { BlogPostFormValues } from '@/types/blog';
import RichTextEditor from './RichTextEditor';
import MediaUploader from './MediaUploader';
import TagSelector from './TagSelector';
import { useNavigate } from 'react-router-dom';

interface BlogPostFormProps {
  defaultValues: Partial<BlogPostFormValues>;
  isSubmitting: boolean;
  onSubmit: (data: BlogPostFormValues) => void;
  initialRichContent?: any;
  initialCoverImageUrl?: string | null;
  initialAudioUrl?: string | null;
  initialSelectedTags?: string[];
}

const BlogPostForm = ({
  defaultValues,
  isSubmitting,
  onSubmit,
  initialRichContent,
  initialCoverImageUrl,
  initialAudioUrl,
  initialSelectedTags = []
}: BlogPostFormProps) => {
  const navigate = useNavigate();
  const [coverPreview, setCoverPreview] = useState<string | null>(initialCoverImageUrl || null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [richContent, setRichContent] = useState<any>(initialRichContent || null);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);
  
  const form = useForm<BlogPostFormValues>({
    defaultValues: {
      title: '',
      content: '',
      published: false,
      tags: [],
      ...defaultValues
    },
  });

  const handleContentChange = (content: string, updatedRichContent: any) => {
    form.setValue('content', content);
    setRichContent(updatedRichContent);
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    form.setValue('cover_image', file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    form.setValue('audio_file', file);
    setAudioFileName(file.name);
  };
  
  const clearCoverImage = () => {
    form.setValue('cover_image', undefined);
    setCoverPreview(null);
  };
  
  const clearAudioFile = () => {
    form.setValue('audio_file', undefined);
    setAudioFileName(null);
  };

  const handleFormSubmit = (data: BlogPostFormValues) => {
    // Include rich content and tags in the submitted data
    const submissionData = {
      ...data,
      rich_content: richContent,
      tags: selectedTags
    };
    onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>Content</FormLabel>
          <RichTextEditor
            initialContent={defaultValues.content || ''}
            onContentChange={handleContentChange}
          />
        </FormItem>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cover Image */}
          <MediaUploader
            type="image"
            preview={coverPreview}
            onFileChange={handleCoverImageChange}
            onClear={clearCoverImage}
          />
          
          {/* Audio File */}
          <MediaUploader
            type="audio"
            preview={initialAudioUrl}
            fileName={audioFileName}
            onFileChange={handleAudioFileChange}
            onClear={clearAudioFile}
          />
        </div>
        
        {/* Tags */}
        <div className="space-y-2">
          <FormLabel className="text-base">Tags</FormLabel>
          <TagSelector
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />
        </div>
        
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Publish post
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  When checked, the post will be visible on the blog
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/admin/blog')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Saving...' 
              : defaultValues.title ? 'Update Post' : 'Create Post'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogPostForm;
