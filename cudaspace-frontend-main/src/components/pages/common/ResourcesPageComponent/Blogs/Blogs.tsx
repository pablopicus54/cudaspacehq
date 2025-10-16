'use client';
import BlogCardSkeleton from '@/components/shared/BlogCard/BlogCardSkeleton';
import BlogSection from '@/components/shared/BlogSection/BlogSection';
import MyButton from '@/components/ui/MyButton/MyButton';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { useGetAllBlogQuery } from '@/redux/features/blog/blog.user.api';
import { Empty } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Blogs = () => {
  const [showAll, setShowAll] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([]);

  // Initialize query
  useEffect(() => {
    setObjectQuery([
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
    ]);
  }, [page, pageSize]);
  const {
    data: getAllBlogResponse,
    isLoading: isBlogLoading,
    isFetching: isBlogFetching,
  } = useGetAllBlogQuery(objectQuery, {
    refetchOnMountOrArgChange: true,
  });
  return (
    <div>
      {!isBlogLoading &&
      !isBlogFetching &&
      getAllBlogResponse?.data?.data?.length > 0 ? (
        <>
          <BlogSection
            //  blogData={showAll ? blogPosts : blogPosts?.slice(0, 4)}
            blogData={getAllBlogResponse?.data?.data}
          />
        </>
      ) : (
        ''
      )}
      {isBlogLoading || isBlogFetching ? (
        <MyContainer>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-screen items-center">
            {Array.from({ length: 8 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </MyContainer>
      ) : (
        ''
      )}
      {!isBlogLoading &&
      !isBlogFetching &&
      getAllBlogResponse?.data?.data?.length < 1 ? (
        <div className="text-center flex items-center justify-center flex-col h-[calc(100vh-200px)] py-12">
          <Empty description={false} />
          <h3 className="text-lg font-medium text-gray-900">No Blog found</h3>
        </div>
      ) : (
        ''
      )}
      <div className="mb-5 text-center flex items-center justify-center">
        <Link href={'/blogs'}>
          <MyButton label="See more" className="rounded-full px-8" />
        </Link>
      </div>
    </div>
  );
};

export default Blogs;
