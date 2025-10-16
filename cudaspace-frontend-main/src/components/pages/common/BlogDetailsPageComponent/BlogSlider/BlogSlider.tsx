'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import { blogPosts } from '@/constant/blogData';
import 'swiper/css';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

export default function BlogSlider({blogs}:{blogs: any}) {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return (
    <section className="w-full py-12 px-4 bg-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Related blogs and study
          </h2>

          <div className="flex gap-2 z-10">
            <button
              onClick={handlePrev}
              className="p-3 rounded-md border bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              aria-label="Previous slide"
            >
              <ArrowLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="p-3 rounded-md bg-blue-900 text-white hover:bg-blue-800"
              aria-label="Next slide"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Navigation, A11y]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="!pb-4"
          >
            {blogs.map((blog: any) => (
              <SwiperSlide key={blog.id}>
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {blog.title}
                  </h3>
                  {/* <p className="text-gray-600 text-sm mb-3">
                    {blog.descriptions}
                  </p> */}
                  <Link
                    href={`/blogs/${blog?.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-auto"
                  >
                    see more
                  </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
