import { z } from 'zod';

export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(8, 'Password must be at least 8 characters long.');

export const CreateItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().int().positive(),
});