import prisma from '../src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
