import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma =
  globalThis.prisma ??
  (() => {
    const client = prismaClientSingleton();
    if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;
    return client;
  })();

export default prisma;
