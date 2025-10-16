/* eslint-disable @next/next/no-img-element */
'use client';
import Loading from '@/components/ui/Loading/Loading';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { useGetSingleBlogQuery } from '@/redux/features/blog/blog.user.api';
import { getImageSrc } from '@/utils/getImageSrc';
import BlogSlider from './BlogSlider/BlogSlider';

type TBlogDetailsProps = {
  blogId: string;
};

const BlogDetailsPageComponent = ({ blogId }: TBlogDetailsProps) => {
  const {
    data: singleBlogResponse,
    isLoading: isBlogLoading,
    isFetching: isBlogFetching,
  } = useGetSingleBlogQuery(blogId, { skip: !blogId });
  const blog = singleBlogResponse?.data?.blog;
  if (isBlogFetching || isBlogLoading) {
    return <Loading />;
  }
  return (
    <div className="py-8 md:py-12">
      <MyContainer>
        {/* Removed front image/banner from blog details page */}
        <article className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Text Content Column */}
            <div className="space-y-6">
              <header>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {blog?.title}
                </h1>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: blog?.descriptions || '' }}
                />
              </header>
              <div />
            </div>

            {/* Images Column */}
            <div className="grid grid-rows-2 gap-4 h-fit">
              {/* Top image (full width) */}
              <div className=" w-full h-full">
                {blog?.secondaryImages[0] && (
                  <img
                    src={getImageSrc(blog?.secondaryImages[0])}
                    alt="Cabinet hardware and accessories"
                    className="object-cover rounded-lg h-fit"
                  />
                )}
              </div>

              {/* Bottom two images (side by side) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative w-full h-[180px">
                  {blog?.secondaryImages[1] && (
                    // <Image
                    //   src={blog?.secondaryImages[1]}
                    //   alt="Cabinet wiring and components"
                    //   fill
                    //   className="object-cover rounded-lg"
                    // />
                    <img
                      src={getImageSrc(blog?.secondaryImages[1])}
                      alt="Cabinet hardware and accessories"
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="relative w-full h-[180px]">
                  {blog?.secondaryImages[2] && (
                    <img
                      src={getImageSrc(blog?.secondaryImages[2])}
                      alt="Cabinet hardware and accessories"
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </MyContainer>
      {singleBlogResponse?.data?.relatedBlog > 0 ? (
        <BlogSlider blogs={singleBlogResponse?.data?.relatedBlog} />
      ) : (
        ''
      )}
    </div>
  );
};

export default BlogDetailsPageComponent;
