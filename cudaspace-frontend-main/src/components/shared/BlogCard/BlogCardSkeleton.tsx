import React from 'react';

const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[24px] flex flex-col overflow-hidden shadow-sm border border-gray-100 h-[350px] animate-pulse">
      <div className="relative h-48 w-full p-3">
        <div className="h-full w-full bg-gray-200 rounded-[12px]" />
      </div>

      <div className="p-3">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
