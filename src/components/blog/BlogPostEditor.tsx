
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BlogPost, BlogPostFormValues } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import BlogPostForm from './BlogPostForm';
import { createOrUpdatePost, fetchPostTags } from '@/services/BlogPostService';

interface BlogPostEditorProps {
  post?: BlogPost;
}

const BlogPostEditor = ({ post }: BlogPostEditorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Fetch post's tags if editing
  useEffect(() => {
    const loadPostTags = async () => {
      if (!post) return;
      
      try {
        const tagIds = await fetchPostTags(post.id);
        setSelectedTags(tagIds);
      } catch (err) {
        console.error('Error fetching post tags:', err);
      }
    };
    
    loadPostTags();
  }, [post]);
  
  const mutation = useMutation({
    mutationFn: async (formData: BlogPostFormValues) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      setIsUploading(true);
      try {
        return await createOrUpdatePost(formData, user.id, post?.id);
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
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
  
  const handleSubmit = (data: BlogPostFormValues) => {
    mutation.mutate(data);
  };
  
  const defaultValues = {
    title: post?.title || '',
    content: post?.content || '',
    published: post?.published ?? false,
  };
  
  return (
    <div className="space-y-6">
      <BlogPostForm 
        defaultValues={defaultValues}
        isSubmitting={mutation.isPending || isUploading}
        onSubmit={handleSubmit}
        initialRichContent={post?.rich_content}
        initialCoverImageUrl={post?.cover_image_url}
        initialAudioUrl={post?.audio_url}
        initialSelectedTags={selectedTags}
      />
    </div>
  );
};

export default BlogPostEditor;
