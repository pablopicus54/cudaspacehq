import {z} from "zod";

const changePasswordValidationSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
});

// Zod schema for validating the User model
const CustomerSchema = z.object({
    name: z.string().max(50),
    password: z.string().min(8).optional(),
    number: z.string(),
    provider: z.enum(["EMAIL", "GOOGLE"]).default("EMAIL"),
    email: z.string().email(),
    uniqueId: z.string().optional(),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
    profileImage: z.string().optional(),
});

const updateCustomerSchema = CustomerSchema.partial()


export const authValidation = {
    changePasswordValidationSchema,
    CustomerSchema,
    updateCustomerSchema,
}

export type ICustomer = z.infer<typeof CustomerSchema>;