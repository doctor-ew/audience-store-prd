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
  console.log({ buyer, seller });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
