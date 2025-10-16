import Image from 'next/image';
import Link from 'next/link';
import resources1 from '@/assets/images/resources1.png';
import resources2 from '@/assets/images/resources2.png';
import resources3 from '@/assets/images/resources3.png';
import MyButton from '@/components/ui/MyButton/MyButton';

export default function ResourcesBanner() {
  return (
    <div className="w-full bg-white py-12 px-4 flex flex-col items-center">
      <div className="max-w-3xl mx-auto text-center  flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Top US Provider for VPS, Dedicated, and GPU Hosting
        </h1>

        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          As a top-tier hosting provider based in the USA, we specialize in
          delivering powerful and reliable VPS, dedicated, and GPU server
          solutions.
        </p>

        <Link href="/pricing/gpu-hosting">
          <MyButton label="Get Started" className="rounded-full px-8 md:px-12 mb-6 md:mb-8" />
        </Link>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          <div className="w-40 h-40 md:w-48 md:h-48 relative transform -rotate-[10deg]">
            <Image
              src={resources1.src}
              alt="Server technology illustration"
              width={192}
              height={192}
              className="rounded-lg"
            />
          </div>

          <div className="w-48 h-48 md:w-56 md:h-56 relative z-10">
            <Image
              src={resources2.src}
              alt="Security lock illustration"
              width={224}
              height={224}
              className="rounded-lg"
            />
          </div>

          <div className="w-40 h-40 md:w-48 md:h-48 relative transform rotate-[10deg]">
            <Image
              src={resources3.src}
              alt="Security badge illustration"
              width={192}
              height={192}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
