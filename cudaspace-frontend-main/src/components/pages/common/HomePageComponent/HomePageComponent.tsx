import React from 'react';
import Banner from './Banner/Banner';
import { ProductCategoriesSection } from './ProductCategories/ProductCategories';
import LanguageModels from './LanguageModels/LanguageModels';
import Services from './Services/Services';
import ServiceFeature from './ServiceFeature/ServiceFeature';
import { TestimonialsSection } from './TestimonialsSection/TestimonialsSection';

const HomePageComponent = () => {
  return (
    <div>
      <Banner />
      <ProductCategoriesSection />
      <LanguageModels />
      <Services />
      <ServiceFeature />
      <TestimonialsSection />
    </div>
  );
};

export default HomePageComponent;
