// Define types for our data
export type PlanCategory = 'All Plans' | 'New Arrivals' | 'Promotion';
export type GPUClassify = 'Desktop' | 'Datacenter' | 'Workstation';
export type CPUScenario =
  | 'Live Streaming'
  | 'AI & Deep Learning'
  | 'Android Emulator'
  | 'CAD/CCI/DCC'
  | 'Video Editing'
  | '3D Rendering'
  | 'HD Gaming';
export type CPUMemory =
  | '1 GB'
  | '2 GB'
  | '4 GB'
  | '6 GB'
  | '8 GB'
  | '16 GB'
  | '24 GB'
  | '32 GB'
  | '64 GB'
  | '40 GB'
  | '48 GB'
  | '72 GB'
  | '74 GB'
  | '80 GB'
  | '128 GB';
export type GPUModel =
  | 'GT 710'
  | 'CT 730'
  | 'K620'
  | 'P600'
  | 'P620'
  | 'P1000'
  | 'T1000'
  | 'GTX 1650'
  | 'GTX 1660'
  | 'RTX 2060'
  | 'RTX 3060'
  | 'RTX 4000'
  | 'RTX A5000'
  | 'RTX A6600'
  | 'RTX 4060'
  | 'RTX 4090'
  | 'RTX 5050'
  | 'RTX 5060'
  | 'K80'
  | 'V100'
  | 'A40'
  | 'A100'
  | 'H100';

export interface HostingPlan {
  id: string;
  name: string;
  price: number;
  priceUnit: string;
  category: PlanCategory[];
  gpuClassify: GPUClassify;
  cpuScenario: CPUScenario[];
  cpuMemory: CPUMemory;
  gpuModel: GPUModel;
  cpuCores: number;
  storage: string;
  bandwidth: string;
  popular?: boolean;
  features: string[];
}

// Fake data for hosting plans
export const hostingPlans: HostingPlan[] = [
  {
    id: 'plan1',
    name: 'Basic GPU Hosting',
    price: 29.99,
    priceUnit: 'month',
    category: ['All Plans'],
    gpuClassify: 'Desktop',
    cpuScenario: ['Live Streaming', 'Android Emulator'],
    cpuMemory: '4 GB',
    gpuModel: 'GT 710',
    cpuCores: 2,
    storage: '50 GB SSD',
    bandwidth: '1 TB',
    features: ['24/7 Support', '99.9% Uptime', 'Free Setup'],
  },
  {
    id: 'plan2',
    name: 'Standard GPU Hosting',
    price: 59.99,
    priceUnit: 'month',
    category: ['All Plans', 'Promotion'],
    gpuClassify: 'Desktop',
    cpuScenario: ['Video Editing', 'Live Streaming'],
    cpuMemory: '8 GB',
    gpuModel: 'GTX 1650',
    cpuCores: 4,
    storage: '100 GB SSD',
    bandwidth: '2 TB',
    popular: true,
    features: ['24/7 Support', '99.9% Uptime', 'Free Setup', 'DDoS Protection'],
  },
  {
    id: 'plan3',
    name: 'Pro GPU Hosting',
    price: 99.99,
    priceUnit: 'month',
    category: ['All Plans', 'New Arrivals'],
    gpuClassify: 'Workstation',
    cpuScenario: ['3D Rendering', 'AI & Deep Learning'],
    cpuMemory: '16 GB',
    gpuModel: 'RTX 3060',
    cpuCores: 8,
    storage: '250 GB SSD',
    bandwidth: '5 TB',
    features: [
      '24/7 Priority Support',
      '99.99% Uptime',
      'Free Setup',
      'DDoS Protection',
      'Dedicated IP',
    ],
  },
  {
    id: 'plan4',
    name: 'Enterprise GPU Hosting',
    price: 299.99,
    priceUnit: 'month',
    category: ['All Plans', 'New Arrivals'],
    gpuClassify: 'Datacenter',
    cpuScenario: ['AI & Deep Learning', '3D Rendering', 'CAD/CCI/DCC'],
    cpuMemory: '32 GB',
    gpuModel: 'RTX A5000',
    cpuCores: 16,
    storage: '500 GB SSD',
    bandwidth: '10 TB',
    features: [
      '24/7 Priority Support',
      '99.99% Uptime',
      'Free Setup',
      'DDoS Protection',
      'Dedicated IP',
      'Backup Service',
    ],
  },
  {
    id: 'plan5',
    name: 'Ultimate GPU Hosting',
    price: 499.99,
    priceUnit: 'month',
    category: ['All Plans', 'New Arrivals', 'Promotion'],
    gpuClassify: 'Datacenter',
    cpuScenario: [
      'AI & Deep Learning',
      '3D Rendering',
      'HD Gaming',
      'Video Editing',
    ],
    cpuMemory: '64 GB',
    gpuModel: 'RTX 4090',
    cpuCores: 32,
    storage: '1 TB NVMe SSD',
    bandwidth: 'Unlimited',
    features: [
      '24/7 Priority Support',
      '99.999% Uptime',
      'Free Setup',
      'DDoS Protection',
      'Dedicated IP',
      'Backup Service',
      'Load Balancing',
    ],
  },
  {
    id: 'plan6',
    name: 'AI Research Cluster',
    price: 1299.99,
    priceUnit: 'month',
    category: ['All Plans', 'New Arrivals'],
    gpuClassify: 'Datacenter',
    cpuScenario: ['AI & Deep Learning'],
    cpuMemory: '128 GB',
    gpuModel: 'A100',
    cpuCores: 64,
    storage: '2 TB NVMe SSD',
    bandwidth: 'Unlimited',
    features: [
      '24/7 Priority Support',
      '99.999% Uptime',
      'Free Setup',
      'DDoS Protection',
      'Dedicated IP',
      'Backup Service',
      'Load Balancing',
      'Custom Configuration',
    ],
  },
];
