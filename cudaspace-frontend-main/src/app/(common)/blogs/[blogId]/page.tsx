import BlogDetailsPageComponent from '@/components/pages/common/BlogDetailsPageComponent/BlogDetailsPageComponent';
import React from 'react';

const BlogDetailsPage = async ({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) => {
  const { blogId } = await params;
  return (
    <div>
      <BlogDetailsPageComponent blogId={blogId} />
    </div>
  );
};

export default BlogDetailsPage;
