import MyButton from '@/components/ui/MyButton/MyButton';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import Image from 'next/image';
import Link from 'next/link';

interface PageBannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

const PackageBanner = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
  imageAlt,
  className = '',
}: PageBannerProps) => {
  return (
    <div className={`w-full py-12 px-4 md:px-6 lg:px-8 ${className}`}>
      <MyContainer className="flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary">
              {title}
            </h2>
            <p className="text-base md:text-lg text-text-sec max-w-xl">
              {description}
            </p>
            <div>
              <Link href={buttonLink}>
                <MyButton
                  label={buttonText}
                  className="rounded-full px-8 md:px-12"
                />
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={imageSrc || '/placeholder.svg'}
                  alt={imageAlt}
                  width={330}
                  height={356}
                  className="w-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default PackageBanner;
