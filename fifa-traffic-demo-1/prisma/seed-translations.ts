import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const translations = [
  // English - General
  { key: 'upcoming_events', locale: 'en', value: 'Upcoming Events', category: 'general' },
  { key: 'stadium', locale: 'en', value: 'Stadium', category: 'general' },
  { key: 'favorite', locale: 'en', value: 'Favorite', category: 'general' },

  // English - Events
  { key: 'event_m01_name', locale: 'en', value: 'Group Stage: USA vs. England', category: 'events' },
  { key: 'event_m01_description', locale: 'en', value: 'A thrilling group stage match.', category: 'events' },
  { key: 'event_m15_name', locale: 'en', value: 'Round of 16: Brazil vs. Germany', category: 'events' },
  { key: 'event_m15_description', locale: 'en', value: 'A knockout stage clash between titans.', category: 'events' },

  // Spanish - General
  { key: 'upcoming_events', locale: 'es', value: 'Próximos Eventos', category: 'general' },
  { key: 'stadium', locale: 'es', value: 'Estadio', category: 'general' },
  { key: 'favorite', locale: 'es', value: 'Favorito', category: 'general' },

  // Spanish - Events
  { key: 'event_m01_name', locale: 'es', value: 'Fase de Grupos: EE.UU. vs. Inglaterra', category: 'events' },
  { key: 'event_m01_description', locale: 'es', value: 'Un emocionante partido de la fase de grupos.', category: 'events' },
  { key: 'event_m15_name', locale: 'es', value: 'Octavos de Final: Brasil vs. Alemania', category: 'events' },
  { key: 'event_m15_description', locale: 'es', value: 'Un choque de fase eliminatoria entre titanes.', category: 'events' },
];

async function seedTranslations() {
  console.log('Seeding translations...');

  for (const translation of translations) {
    await prisma.translation.upsert({
      where: {
        key_locale: {
          key: translation.key,
          locale: translation.locale,
        },
      },
      update: {
        value: translation.value,
        category: translation.category,
      },
      create: translation,
    });
  }

  console.log('✅ Translations seeded successfully');
}

seedTranslations()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
