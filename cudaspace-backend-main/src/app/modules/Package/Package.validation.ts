import {z} from 'zod';

// Zod schema for Blog validation
const PackageSchema = z.object({
    packageType: z.string().min(1, "Title is required"),
    serviceName: z.string().min(1, "Description is required"),
    vpsType: z.enum(["WINDOWS_DESKTOP_VPS", "WINDOWS_SERVER_VPS","LINUX_VPS","GPU_VPS"]).optional(),
    serverType: z.enum(["NVME_SERVER", "SSD_SERVER","HDD_SERVER","RAID_SERVER"]).optional(),
    perMonthPrice: z.number(),
    serviceDetails: z.array(z.string()),
    packageImage: z.string().url().optional(),
});

const updatePackageSchema = PackageSchema.partial()

export const packageValidation = {
    PackageSchema,
    updatePackageSchema
};

export type IPackage = z.infer<typeof PackageSchema>;