import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

// Stub for session management
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

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const userWithItems = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      itemsListed: {
        orderBy: { createdAt: 'desc' },
      },
      itemsPurchased: {
        orderBy: { createdAt: 'desc' },
        include: { seller: true }, // Include seller info for purchased items
      },
    },
  });

  if (!userWithItems) {
    // This case should ideally not happen if session.user exists, but for safety
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Credits: {userWithItems.credits}</h2>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">My Listings</h2>
        {
          userWithItems.itemsListed.length === 0 ? (
            <p className="text-gray-500">You haven&apos;t listed any items yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userWithItems.itemsListed.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 shadow-sm bg-white">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-700">Price: {item.price} credits</p>
                  <p className="text-gray-500 text-sm">Status: {item.purchasedById ? 'Sold' : 'For Sale'}</p>
                </div>
              ))}
            </div>
          )
        }
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">My Purchases</h2>
        {
          userWithItems.itemsPurchased.length === 0 ? (
            <p className="text-gray-500">You haven&apos;t purchased any items yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userWithItems.itemsPurchased.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 shadow-sm bg-white">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-700">Price: {item.price} credits</p>
                  <p className="text-gray-500 text-sm">Purchased On: {new Date(item.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-sm">From: {item.seller.email}</p>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
