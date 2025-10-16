import { z } from 'zod';


// Create Order Schema
export const OrderSchema = z.object({
  status: z.string().default('Pending'), // or use OrderStatusEnum.default('Pending')
  userId: z.string().min(5, 'User ID is required'),
  amount: z.number().nonnegative().optional(),
  packageId: z.string().optional(),
  invoiceUrl: z.string().url('Invoice URL must be a valid URL').optional(),
});

// Update Order Schema
export const updateOrderSchema = OrderSchema.partial();

// Export object for validation middleware
export const orderValidation = {
  OrderSchema,
  updateOrderSchema,
};

// Infer TypeScript type
export type IOrder = z.infer<typeof OrderSchema>;

// Extend/set period end payload schema
export const ExtendPeriodEndSchema = z
  .object({
    extendDays: z.number().int().positive().optional(),
    newEndDate: z.string().datetime().optional(),
    reason: z.string().max(500).optional(),
  })
  .refine(
    (val) => val.extendDays || val.newEndDate,
    {
      message: 'Provide either extendDays or newEndDate',
      path: ['extendDays'],
    }
  );

export type IExtendPeriodEnd = z.infer<typeof ExtendPeriodEndSchema>;
