'use client';

import { FC, useState } from 'react';
import { Item, User } from '@prisma/client';
import { purchaseItem } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface ItemCardProps {
  item: Item & { seller: User };
  session: { user: { id: string; email: string; credits: number } } | null;
}

export const ItemCard: FC<ItemCardProps> = ({ item, session }) => {
  const router = useRouter();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isLoggedOut = !session?.user;
  const isSeller = session?.user?.id === item.sellerId;
  const canAfford = session?.user?.credits && session.user.credits >= item.price;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await purchaseItem(item.id);
      if (result.ok) {
        setSuccess('Item purchased successfully!');
        setTimeout(() => {
          router.refresh(); // Refresh the page to remove the sold item and update credits
        }, 1500);
      } else {
        let errorMessage = 'Failed to purchase item.';
        switch (result.code) {
          case 'unauthorized':
            errorMessage = 'You must be logged in to purchase.';
            break;
          case 'item_not_found':
            errorMessage = 'Item not found.';
            break;
          case 'item_already_sold':
            errorMessage = 'This item has already been sold.';
            break;
          case 'cannot_buy_own_item':
            errorMessage = 'You cannot buy your own item.';
            break;
          case 'insufficient_credits':
            errorMessage = 'Insufficient credits.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
            break;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
      <p className="text-gray-700 mb-1">Price: {item.price} credits</p>
      <p className="text-gray-600 text-sm mb-4">Seller: {item.seller.email}</p>
      <button
        onClick={handlePurchase}
        disabled={isLoggedOut || isSeller || isPurchasing || !canAfford}
        className={`w-full py-2 px-4 rounded-md text-white
          ${isLoggedOut || isSeller || !canAfford
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
          }
          ${isPurchasing ? 'opacity-75 cursor-not-allowed' : ''}
        `}
      >
        {isPurchasing ? 'Buying...' : isLoggedOut ? 'Log in to Buy' : isSeller ? 'Your Item' : !canAfford ? 'Insufficient Credits' : 'Buy'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
    </div>
  );
};
