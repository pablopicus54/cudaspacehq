import { productCategories } from '@/constant/productCategories';
import { ProductCard } from './ProductCard';
import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';

export function ProductCategoriesSection() {
  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <MyContainer>
        <SectionHead
          title={productCategories?.title}
          description={productCategories?.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {productCategories?.products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </MyContainer>
    </section>
  );
}
