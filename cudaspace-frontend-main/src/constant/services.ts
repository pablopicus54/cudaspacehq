export interface IServiceCard {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
}

export const servicesData: IServiceCard[] = [
  {
    id: 'database-hosting',
    title: 'Database Hosting',
    description:
      'Power your applications with reliable database hosting built for speed, flexibility, and growth. Our managed database solutions take the hassle out of setup.',
    imageSrc: '/service1.png',
  },
  {
    id: 'vps-hosting',
    title: 'Vps Hosting',
    description:
      'Our VPS hosting gives you full root access, lightning-fast SSD storage, and dedicated resources — all backed by 99.9% uptime and 24/7 expert support.',
      imageSrc: '/service2.png',
  },
  {
    id: 'ai-deep-learning',
    title: 'AI Deep Learning',
    description:
      'Built on state-of-the-art neural networks, our platform delivers high-performance training, scalable models and seamless integration with your existing workflow.',
      imageSrc: '/service3.png',
  },
  {
    id: 'cloud-app-hosting',
    title: 'Cloud App Hosting',
    description:
      'Boost your online performance with our cutting-edge PaaS hosting solutions. Get the power of dedicated resources with the flexibility of the cloud — all at an affordable price.',
      imageSrc: '/service4.png',
  },
  {
    id: 'forex-trading',
    title: 'Forex Trading',
    description:
      'Our forex trading solutions offer real-time data, low spreads, and lightning-fast execution — giving you the edge you need to make smarter trades.',
      imageSrc: '/service5.png',
  },
  {
    id: 'website-hosting',
    title: 'Website Hosting',
    description:
      'Enjoy one-click installs, free SSL, daily backups and 24/7 expert support — all backed by a 99.9% uptime guarantee.',
      imageSrc: '/service6.png',
  },
];
