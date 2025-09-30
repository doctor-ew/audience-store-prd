import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('Passw0rd!', 12);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@s.example' },
    update: {},
    create: {
      email: 'buyer@s.example',
      passwordHash: password,
    },
  });
  const seller = await prisma.user.upsert({
    where: { email: 'seller@s.example' },
    update: {},
    create: {
      email: 'seller@s.example',
      passwordHash: password,
    },
  });

  // Create 3 unsold items for the seller
  await prisma.item.createMany({
    data: [
      {
        name: 'Item 1',
        description: 'This is the first item',
        price: 10,
        sellerId: seller.id,
      },
      {
        name: 'Item 2',
        description: 'This is the second item',
        price: 20,
        sellerId: seller.id,
      },
      {
        name: 'Item 3',
        description: 'This is the third item',
        price: 30,
        sellerId: seller.id,
      },
    ],
  });

  console.log({ buyer, seller });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });