
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import BlogPostEditor from '@/components/blog/BlogPostEditor';

const BlogPostCreate = () => {
  return (
    <MainLayout requireAuth adminOnly>
      <div className="container py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Create Blog Post</h1>
        <BlogPostEditor />
      </div>
    </MainLayout>
  );
};

export default BlogPostCreate;
