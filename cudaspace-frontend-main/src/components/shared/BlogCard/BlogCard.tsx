import { TBlogPost } from '@/constant/blogData';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  blog: TBlogPost;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div className="bg-white rounded-[24px] space-y-6 overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {blog?.displayImage && (
        <div className="relative h-[158px] w-full p-3">
          <Image
            src={blog.displayImage || '/placeholder.svg'}
            alt={blog?.imageAlt || blog?.title || 'Blog image'}
            height={158}
            width={258}
            className="object-cover w-full h-[158px] rounded-[12px]"
          />
        </div>
      )}

      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{blog.title}</h3>
        {/* <p className="text-gray-600 text-sm mb-3">{blog.descriptions}</p> */}
        <Link
          href={`/blogs/${blog?.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-auto"
        >
          see more
        </Link>
      </div>
    </div>
  );
}
