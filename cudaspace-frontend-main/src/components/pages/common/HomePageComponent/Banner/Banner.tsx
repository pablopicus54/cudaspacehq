import MyButton from '@/components/ui/MyButton/MyButton';
import bannerImg from '@/assets/images/banner.png';
import Image from 'next/image';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="relative w-full md:h-[600px] overflow-hidden">
      {/* Background Image - Replace the src with your own image */}
      <div className="absolute inset-0">
        <Image
          src={bannerImg.src}
          alt="DataVault Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-blue-950/50 z-10"></div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl mx-auto bg-[rgb(255, 255, 255)]/80 backdrop-blur-[12px] p-8 md:p-12 rounded-lg border border-white/50">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-6">
            Unlock the Power of Your Data with CudaSpace
          </h1>

          <p className="text-blue-100 text-center mb-8 max-w-2xl mx-auto">
            At CudaSpace, we understand that data is your most valuable asset.
            That&apos;s why we&apos;ve designed a robust and secure platform to
            ensure your data is not only protected but also easily accessible
            whenever you need it.
          </p>

          <div className="flex justify-center">
            <Link href={'/pricing/gpu-hosting'}>
              <MyButton
                label="Get Started"
                className="rounded-full px-12 md:px-16"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
