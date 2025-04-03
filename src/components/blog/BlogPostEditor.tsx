import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash, ImageIcon, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPostFormValues, BlogPost } from '@/types';
import RichTextEditor from './RichTextEditor';

interface BlogPostEditorProps {
  post?: BlogPost;
}

const BlogPostEditor = ({ post }: BlogPostEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [coverPreview, setCoverPreview] = useState<string | null>(post?.cover_image_url || null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [richContent, setRichContent] = useState<any>(post?.rich_content || null);
  
  const form = useForm<BlogPostFormValues>({
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      published: post?.published ?? false,
      tags: []
    },
  });
  
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
  
  // Fetch post's tags if editing
  useEffect(() => {
    const fetchPostTags = async () => {
      if (!post) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts_tags')
          .select('blog_tags(id, name)')
          .eq('post_id', post.id);
          
        if (error) throw error;
        
        const tagIds = data.map((item: any) => item.blog_tags.id);
        setSelectedTags(tagIds);
      } catch (err) {
        console.error('Error fetching post tags:', err);
      }
    };
    
    fetchPostTags();
  }, [post]);

  const handleContentChange = (content: string, updatedRichContent: any) => {
    form.setValue('content', content);
    setRichContent(updatedRichContent);
  };

  const createOrUpdatePost = async (formData: BlogPostFormValues) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setIsUploading(true);
    
    try {
      let cover_image_url = post?.cover_image_url;
      let audio_url = post?.audio_url;
      
      // Handle cover image upload
      if (formData.cover_image) {
        const fileExt = formData.cover_image.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `blog_images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog_media')
          .upload(filePath, formData.cover_image);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('blog_media')
          .getPublicUrl(filePath);
          
        cover_image_url = data.publicUrl;
      }
      
      // Handle audio upload
      if (formData.audio_file) {
        const fileExt = formData.audio_file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `blog_audio/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog_media')
          .upload(filePath, formData.audio_file);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('blog_media')
          .getPublicUrl(filePath);
          
        audio_url = data.publicUrl;
      }
      
      // Handle media files in rich content
      if (richContent && richContent.mediaItems) {
        // In a real app, you would upload the media files to storage here
        // For now, we'll just keep the rich content as is
      }
      
      const postData = {
        title: formData.title,
        content: formData.content,
        author_id: user.id,
        cover_image_url,
        audio_url,
        published: formData.published,
        updated_at: new Date().toISOString(),
        rich_content: richContent
      };
      
      let postId = post?.id;
      
      if (post) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);
          
        if (error) throw error;
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select();
          
        if (error) throw error;
        postId = data[0].id;
      }
      
      // Handle tags
      if (postId) {
        // Remove existing tags if editing
        if (post) {
          await supabase
            .from('blog_posts_tags')
            .delete()
            .eq('post_id', postId);
        }
        
        // Add selected tags
        if (selectedTags.length > 0) {
          const tagRelations = selectedTags.map(tagId => ({
            post_id: postId,
            tag_id: tagId
          }));
          
          const { error } = await supabase
            .from('blog_posts_tags')
            .insert(tagRelations);
            
          if (error) throw error;
        }
      }
      
      return postId;
    } finally {
      setIsUploading(false);
    }
  };
  
  const createTag = async (name: string) => {
    const { data, error } = await supabase
      .from('blog_tags')
      .insert([{ name }])
      .select();
      
    if (error) throw error;
    return data[0];
  };
  
  const mutation = useMutation({
    mutationFn: createOrUpdatePost,
    onSuccess: (postId) => {
      toast({
        title: "Success",
        description: `Post ${post ? 'updated' : 'created'} successfully!`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['adminBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      
      navigate('/admin/blog');
    },
    onError: (error) => {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: `Failed to ${post ? 'update' : 'create'} post.`,
        variant: "destructive"
      });
    }
  });
  
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
        const createdTag = await createTag(newTag.trim());
        tagId = createdTag.id;
        queryClient.invalidateQueries({ queryKey: ['blogTags'] });
      }
      
      if (!selectedTags.includes(tagId)) {
        setSelectedTags([...selectedTags, tagId]);
      }
      
      setNewTag('');
    } catch (error) {
      console.error('Error adding tag:', error);
      toast({
        title: "Error",
        description: "Failed to add tag",
        variant: "destructive"
      });
    }
  };
  
  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  
  const onSubmit = (data: BlogPostFormValues) => {
    mutation.mutate(data);
  };
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              initialContent={post?.content || ''}
              onContentChange={handleContentChange}
            />
          </FormItem>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base">Cover Image</FormLabel>
                {coverPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearCoverImage}
                  >
                    <Trash className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>
              {coverPreview ? (
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <img 
                    src={coverPreview} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed rounded-md aspect-video bg-muted">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        asChild
                      >
                        <label className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverImageChange}
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Audio File */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-base">Audio File</FormLabel>
                {audioFileName && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAudioFile}
                  >
                    <Trash className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>
              {audioFileName ? (
                <div className="flex items-center p-4 border rounded-md bg-muted/50">
                  <Music className="h-8 w-8 mr-2 text-muted-foreground" />
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{audioFileName}</p>
                    <p className="text-sm text-muted-foreground">Audio file selected</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center border-2 border-dashed rounded-md aspect-video bg-muted">
                  <div className="text-center">
                    <Music className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        asChild
                      >
                        <label className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Audio
                          <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={handleAudioFileChange}
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div className="space-y-4">
            <FormLabel className="text-base">Tags</FormLabel>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag) => (
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
              disabled={mutation.isPending || isUploading}
            >
              {mutation.isPending || isUploading 
                ? 'Saving...' 
                : post ? 'Update Post' : 'Create Post'
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BlogPostEditor;
