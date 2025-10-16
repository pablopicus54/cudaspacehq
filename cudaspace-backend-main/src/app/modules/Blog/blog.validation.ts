import { z } from 'zod';

const BlogSchema = z.object({
  displayImage: z
    .string()
    .min(1, 'Display image is required')
    .optional(),
  secondaryImages: z.array(z.string()).default([]).optional(),
  title: z.string().min(1, 'Title is required'),
  descriptions: z.string().min(1, 'Descriptions are required'),
  category: z.string().min(1, 'Category is required'),
});

const updateBlogSchema = BlogSchema.partial();

export const BlogValidation = {
  BlogSchema,
  updateBlogSchema,
};

export type IBlogPayload = z.infer<typeof BlogSchema>;