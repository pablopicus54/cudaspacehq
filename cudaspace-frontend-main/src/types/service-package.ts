// export type TServicePackage = {
//   id: string;
//   packageType: string; // Add more specific types if needed
//   serviceName: string;
//   perMonthPrice: number;
//   serviceDetails: string[];
//   promotianal: boolean;
//   vpsType: string | null;
//   serverType: string | null;
//   packageImage: string;
//   packageStatus: string; // Add more statuses if needed
//   createdAt: string; // ISO 8601 date string
//   updatedAt: string; // ISO 8601 date string
// };


export type THostingPackage = {
  id: string;
  packageType: string;
  serviceName: string;
  perMonthPrice: number;
  perYearPrice: number;
  perQuarterPrice: number;
  serviceDetails: string[];
  promotianal: boolean;
  vpsType: string | null;
  serverType: string | null;
  packageImage: string;
  stripePriceId: string;
  productId: string;
  totalSales: number;
  totalReveneue: number;
  packageStatus: string;
  createdAt: string;
  updatedAt: string;
};
