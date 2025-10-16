import MyButton from '@/components/ui/MyButton/MyButton';
import { Product } from '@/constant/productCategories';
import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }: { product: Product }) {
  const { title, description, imageSrc } = product;
  const navigateRoute =
    title === 'Gpu Server'
      ? 'gpu-hosting'
      : title === 'Vps Server'
      ? 'vps-hosting'
      : title === 'Dedicated Server'
      ? 'dedicated-hosting'
      : '';
  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageSrc || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-xl font-semibold text-blue-700 mb-3">{title}</h3>
        <p className="text-gray-700 mb-5 flex-grow">{description}</p>
        <Link href={`/pricing/${navigateRoute}`}>
          <MyButton label="Order now" className="px-8 rounded-full" fullWidth />
        </Link>
      </div>
    </div>
  );
}
