const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Mercedes-Benz Stadium
  const mbs = await prisma.venue.create({
    data: {
      name: 'Mercedes-Benz Stadium',
      address: '1 AMB Dr NW, Atlanta, GA 30313',
      latitude: 33.7555,
      longitude: -84.4008,
    },
  });
  console.log(`Created venue: ${mbs.name}`);

  // Create a couple of sample events
  await prisma.event.create({
    data: {
      fifaEventId: 'M01',
      name: 'Group Stage: USA vs. England',
      description: 'A thrilling group stage match.',
      startTime: new Date('2026-06-15T20:00:00Z'),
      venueId: mbs.id,
    },
  });
  console.log('Created event: USA vs. England');

  await prisma.event.create({
    data: {
      fifaEventId: 'M15',
      name: 'Round of 16: Brazil vs. Germany',
      description: 'A knockout stage clash between titans.',
      startTime: new Date('2026-06-28T19:00:00Z'),
      venueId: mbs.id,
    },
  });
  console.log('Created event: Brazil vs. Germany');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
