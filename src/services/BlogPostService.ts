
import { supabase } from '@/integrations/supabase/client';
import { BlogPostFormValues } from '@/types/blog';
import { v4 as uuidv4 } from 'uuid';

export async function createOrUpdatePost(formData: BlogPostFormValues, userId: string, existingPostId?: string) {
  let cover_image_url = null;
  let audio_url = null;
  
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
  
  const postData = {
    title: formData.title,
    content: formData.content,
    author_id: userId,
    published: formData.published,
    updated_at: new Date().toISOString(),
    rich_content: formData.rich_content
  } as any;
  
  // Only update media URLs if new files were uploaded
  if (cover_image_url) {
    postData.cover_image_url = cover_image_url;
  }
  
  if (audio_url) {
    postData.audio_url = audio_url;
  }
  
  let postId = existingPostId;
  
  if (existingPostId) {
    // Update existing post
    const { error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', existingPostId);
      
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
  if (postId && formData.tags && formData.tags.length > 0) {
    // Remove existing tags if editing
    if (existingPostId) {
      await supabase
        .from('blog_posts_tags')
        .delete()
        .eq('post_id', postId);
    }
    
    // Add selected tags
    const tagRelations = formData.tags.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));
    
    const { error } = await supabase
      .from('blog_posts_tags')
      .insert(tagRelations);
      
    if (error) throw error;
  }
  
  return postId;
}

export async function fetchPostById(id: string) {
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
  };
}

export async function fetchPostTags(postId: string) {
  const { data, error } = await supabase
    .from('blog_posts_tags')
    .select('blog_tags(id, name)')
    .eq('post_id', postId);
    
  if (error) throw error;
  
  return data.map((item: any) => item.blog_tags.id);
}
