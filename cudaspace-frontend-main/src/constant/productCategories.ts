export type Product = {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
  buttonLink: string;
};

export type ProductCategories = {
  title: string;
  description: string;
  products: Product[];
};

export const productCategories: ProductCategories = {
  title: 'Product Categories',
  description:
    'Store your critical data with confidence in our highly secure cloud infrastructure. DataVault ensures your data is protected with industry-leading encryption and backed up for peace of mind.',
  products: [
    {
      title: 'Gpu Server',
      description:
        'Take your data processing, machine learning models, and AI workloads to the next level with CudaSpace GPU Servers. Designed for high-performance computing.',
      imageSrc: '/category1.png',
      buttonText: 'Order now',
      buttonLink: '/products/gpu-server',
    },
    {
      title: 'Vps Server',
      description:
        'Take your data processing, machine learning models, and AI workloads to the next level with CudaSpace CPU Servers. Designed for high-performance computing.',
      imageSrc: '/category2.png',
      buttonText: 'Order now',
      buttonLink: '/products/vps-server',
    },
    {
      title: 'Dedicated Server',
      description:
        'Take your data processing, machine learning models, and AI workloads to the next level with CudaSpace CPU Servers. Designed for high-performance computing.',
      imageSrc: '/category3.png',
      buttonText: 'Order now',
      buttonLink: '/products/dedicated-server',
    },
  ],
};
