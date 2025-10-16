import { TBlogPost } from '@/constant/blogData';
import BlogCard from '../BlogCard/BlogCard';
import SectionHead from '../SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';

interface BlogSectionProps {
  blogData: TBlogPost[];
}

export default function BlogSection({
  blogData,
}: BlogSectionProps) {
  return (
    <section className="w-full py-8 md:py-12">
      <MyContainer>
        <SectionHead
          title="Blog and News"
          description="Get reliable, high-performance server hosting tailored to your
            needs."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogData?.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </MyContainer>
    </section>
  );
}
