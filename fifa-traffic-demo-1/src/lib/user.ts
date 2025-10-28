import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getOrCreateUserProfile(userId: string) {
  return prisma.userProfile.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
    include: { favorites: true },
  });
}

export async function updateUserLanguage(userId: string, language: string) {
  return prisma.userProfile.update({
    where: { id: userId },
    data: { language },
    include: { favorites: true },
  });
}

export async function toggleFavoriteVenue(userId: string, venueId: string) {
  // Check if the favorite already exists
  const existingFavorite = await prisma.userFavorite.findUnique({
    where: { profileId_venueId: { profileId: userId, venueId } },
  });

  if (existingFavorite) {
    // Remove it
    await prisma.userFavorite.delete({ where: { id: existingFavorite.id } });
  } else {
    // Add it
    await prisma.userFavorite.create({ data: { profileId: userId, venueId } });
  }
  return getOrCreateUserProfile(userId);
}