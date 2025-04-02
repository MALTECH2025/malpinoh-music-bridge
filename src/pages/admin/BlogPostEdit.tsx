
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import BlogPostEditor from '@/components/blog/BlogPostEditor';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

const BlogPostEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!id) throw new Error('Post ID is required');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as BlogPost;
    }
  });
  
  if (error) {
    toast({
      title: "Error",
      description: "Failed to load blog post",
      variant: "destructive"
    });
  }
  
  return (
    <MainLayout requireAuth adminOnly>
      <div className="container py-6 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/admin/blog')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Posts
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size={40} />
          </div>
        ) : post ? (
          <BlogPostEditor post={post} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Post not found</h2>
            <p className="text-muted-foreground mt-2 mb-6">The post you're trying to edit doesn't exist.</p>
            <Button onClick={() => navigate('/admin/blog')}>
              Go back to all posts
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogPostEdit;
