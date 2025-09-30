'use server';

import prisma from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Stub for session management - similar to app/sell/actions.ts
async function getSession() {
  // In a real app, you'd get this from your auth library
  const user = await prisma.user.findUnique({
    where: { email: 'buyer@s.example' }, // Assuming buyer is logged in for this action
  });
  if (!user) {
    return null;
  }
  return { user: { id: user.id, email: user.email, credits: user.credits } };
}

export async function purchaseItem(itemId: string): Promise<{ ok: boolean; code?: string }> {
  const session = await getSession();
  if (!session?.user) {
    return { ok: false, code: 'unauthorized' };
  }

  const buyerId = session.user.id;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Re-check item availability and get item details
      const item = await tx.item.findUnique({
        where: { id: itemId },
        include: { seller: true },
      });

      if (!item) {
        logger.warn({ itemId, buyerId }, 'Attempted to purchase non-existent item');
        return { ok: false, code: 'item_not_found' };
      }

      if (item.purchasedById !== null) {
        logger.warn({ itemId, buyerId, purchasedById: item.purchasedById }, 'Attempted to purchase already sold item');
        return { ok: false, code: 'item_already_sold' };
      }

      if (item.sellerId === buyerId) {
        logger.warn({ itemId, buyerId }, 'Attempted to purchase own item');
        return { ok: false, code: 'cannot_buy_own_item' };
      }

      // 2. Check buyer has enough credits
      const buyer = await tx.user.findUnique({
        where: { id: buyerId },
      });

      if (!buyer || buyer.credits < item.price) {
        logger.warn({ itemId, buyerId, buyerCredits: buyer?.credits, itemPrice: item.price }, 'Insufficient credits');
        return { ok: false, code: 'insufficient_credits' };
      }

      // 3. Debit buyer, credit seller, mark item as sold
      await tx.user.update({
        where: { id: buyerId },
        data: { credits: { decrement: item.price } },
      });

      await tx.user.update({
        where: { id: item.sellerId },
        data: { credits: { increment: item.price } },
      });

      await tx.item.update({
        where: { id: itemId },
        data: { purchasedById: buyerId },
      });

      logger.info({ itemId, buyerId, sellerId: item.sellerId, price: item.price }, 'Item purchased successfully');
      return { ok: true };
    });
    return result;
  } catch (error) {
    logger.error({ error, itemId, buyerId }, 'Error during item purchase transaction');
    return { ok: false, code: 'transaction_failed' };
  }
}
