
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User, Headphones } from 'lucide-react';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as BlogPostType } from '@/types';
import AudioPlayer from '@/components/blog/AudioPlayer';
import { useToast } from '@/hooks/use-toast';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch blog post
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      try {
        // Fetch post
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            blog_posts_tags(
              blog_tags(id, name)
            )
          `)
          .eq('id', id)
          .single();
        
        if (postError) throw postError;
        
        // Fetch author name
        const { data: authorData } = await supabase
          .from('artists')
          .select('name')
          .eq('id', postData.author_id)
          .single();
        
        // Format the post to include tags and author name
        return {
          ...postData,
          tags: postData.blog_posts_tags?.map((pt: any) => pt.blog_tags) || [],
          author_name: authorData?.name || 'Anonymous'
        } as BlogPostType;
      } catch (err) {
        console.error('Error fetching blog post:', err);
        throw err;
      }
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
    <MainLayout>
      <div className="container py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/blog')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 mb-2" />
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-80 w-full mb-6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : post ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {format(new Date(post.created_at), 'MMMM dd, yyyy')}
                </div>
                
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  {post.author_name}
                </div>
              </div>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag: any) => (
                    <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                  ))}
                </div>
              )}
            </div>

            {post.cover_image_url && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.cover_image_url} 
                  alt={post.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            {post.audio_url && (
              <div className="mb-8">
                <AudioPlayer audioUrl={post.audio_url} />
              </div>
            )}
            
            <div 
              className="prose prose-sm sm:prose lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">Post not found</h3>
            <p className="text-muted-foreground mb-6">This post might have been removed or is not available.</p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogPost;
