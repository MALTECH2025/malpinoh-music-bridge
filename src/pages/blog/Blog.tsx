
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Headphones } from "lucide-react";
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types';
import AudioPlayer from '@/components/blog/AudioPlayer';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Fetch blog posts
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      try {
        // Using any type as a workaround
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            blog_posts_tags(
              blog_tags(id, name)
            )
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Format the posts to include tags
        return data.map((post: any) => ({
          ...post,
          tags: post.blog_posts_tags?.map((pt: any) => pt.blog_tags) || []
        })) as BlogPost[];
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        throw err;
      }
    }
  });

  // Handle post click - navigate to post detail
  const handlePostClick = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load blog posts",
      variant: "destructive"
    });
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
            MalpinohDistro Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Latest news, updates, and insights from the music distribution world
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden h-[400px]">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card 
                key={post.id} 
                className="overflow-hidden h-[400px] flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="relative h-48 bg-muted">
                  {post.cover_image_url ? (
                    <img 
                      src={post.cover_image_url} 
                      alt={post.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300">
                      <span className="text-gray-400 text-2xl font-bold">MalpinohDistro</span>
                    </div>
                  )}
                  {post.audio_url && (
                    <div className="absolute top-2 right-2 bg-black/70 p-1 rounded-full">
                      <Headphones className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(post.created_at), 'MMMM dd, yyyy')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-2 flex-grow">
                  <div 
                    className="line-clamp-3 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>
                
                <CardFooter className="pt-0 flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag: any) => (
                    <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-4">No blog posts yet</h3>
            <p className="text-muted-foreground">Check back later for updates!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Blog;
