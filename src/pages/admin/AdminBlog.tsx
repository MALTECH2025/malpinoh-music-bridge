
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { PlusCircle, Search, MoreVertical, Pencil, Trash, Eye, HeadphonesIcon } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types';
import { useNavigate } from 'react-router-dom';

const AdminBlog = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch blog posts
  const { data: blogPosts, isLoading, error, refetch } = useQuery({
    queryKey: ['adminBlogPosts'],
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

  const deletePost = async (id: string) => {
    try {
      // Using any type as a workaround
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      refetch();
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  // Filter posts based on search query and tab
  const filteredPosts = blogPosts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'published' && post.published) ||
      (activeTab === 'draft' && !post.published);
    
    return matchesSearch && matchesTab;
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load blog posts",
      variant: "destructive"
    });
  }

  return (
    <MainLayout requireAuth adminOnly>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">Create and manage blog posts</p>
          </div>
          <Button onClick={() => navigate('/admin/blog/create')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Post
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="bg-muted h-20" />
                <CardContent className="h-24 bg-muted mt-4" />
              </Card>
            ))}
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      {post.title}
                      {post.audio_url && (
                        <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      {post.published ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Draft
                        </Badge>
                      )}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/blog/${post.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/blog/edit/${post.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => deletePost(post.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>Created: {format(new Date(post.created_at), 'PPP')}</div>
                    <div>Updated: {format(new Date(post.updated_at), 'PPP')}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                    ))}
                    {(!post.tags || post.tags.length === 0) && (
                      <span className="text-sm text-muted-foreground">No tags</span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Create your first blog post'}
            </p>
            <Button onClick={() => navigate('/admin/blog/create')}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminBlog;
