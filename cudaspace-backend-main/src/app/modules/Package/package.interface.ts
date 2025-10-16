import { PackageStatus, PackageType, ServerType, VpsType } from "@prisma/client";

export interface IPackage {
  packageType: PackageType;
  serviceName: string;
  perMonthPrice: number;
  perYearPrice: number;
  perQuarterPrice: number;
  serviceDetails: string[];
  promotianal: boolean;
  vpsType?: VpsType;
  serverType?: ServerType;
  packageImage: string;
  packageStatus: PackageStatus;
}
