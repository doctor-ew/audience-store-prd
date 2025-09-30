'use server';


import prisma from '@/lib/prisma';
import { CreateItemSchema } from '@/lib/validation';
import { logger } from '@/lib/logger';

// Stub for session management
async function getSession() {
  // In a real app, you'd get this from your auth library
  const user = await prisma.user.findUnique({
    where: { email: 'seller@s.example' },
  });
  if (!user) {
    return null;
  }
  return { user: { id: user.id } };
}

export async function createItem(input: {
  name: string;
  description: string;
  price: number;
}) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const result = CreateItemSchema.safeParse(input);
  if (!result.success) {
    // In a real app, you'd probably want to return these errors to the client
    logger.error({ error: result.error.flatten() }, 'Invalid input for createItem');
    throw new Error('Invalid input');
  }

  const { name, description, price } = result.data;

  const item = await prisma.item.create({
    data: {
      name,
      description,
      price,
      sellerId: session.user.id,
    },
  });

  logger.info({ itemId: item.id }, 'Item created successfully');

  return { id: item.id };
}
