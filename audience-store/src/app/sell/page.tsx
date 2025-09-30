import { redirect } from 'next/navigation';
import { SellForm } from '@/components/SellForm';
import { prisma } from '@/lib/prisma';

// Stub for session management - duplicated from actions.ts for page-level auth check
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

export default async function SellPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login'); // Redirect to login if not authenticated
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">List a New Item</h1>
      <SellForm />
    </div>
  );
}
