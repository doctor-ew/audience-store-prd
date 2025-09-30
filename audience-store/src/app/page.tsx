import prisma from '@/lib/prisma';
import { ItemCard } from '@/components/ItemCard';

// Stub for session management - duplicated from actions.ts for page-level auth check
async function getSession() {
  // In a real app, you'd get this from your auth library
  // For now, let's assume 'buyer@s.example' is logged in
  const user = await prisma.user.findUnique({
    where: { email: 'buyer@s.example' },
  });
  if (!user) {
    return null;
  }
  return { user: { id: user.id, email: user.email, credits: user.credits } };
}

export default async function HomePage() {
  const items = await prisma.item.findMany({
    where: {
      purchasedById: null, // Only show unsold items
    },
    orderBy: {
      createdAt: 'desc', // Newest first
    },
    include: {
      seller: true, // Include seller information
    },
  });

  const session = await getSession(); // Fetch session here

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      {
        items.length === 0 ? (
          <p className="text-center text-gray-500">No items for sale yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} session={session} /> // Pass session to ItemCard
            ))}
          </div>
        )
      }
    </div>
  );
}
