const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@swiftdrop.com';
  const adminPassword = 'Admin@123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      displayName: 'SwiftDrop Admin',
      passwordHash,
      role: 'ADMIN',
      isActive: true
    },
    create: {
      email: adminEmail,
      displayName: 'SwiftDrop Admin',
      passwordHash,
      role: 'ADMIN',
      isActive: true
    }
  });

  const now = new Date();
  const lockedEventTime = new Date(now.getTime() + 10 * 60 * 1000);

  const lockedEvent = await prisma.event.create({
    data: {
      name: 'Locked Flash Drop',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
      scheduledAt: lockedEventTime,
      status: 'LOCKED',
      items: {
        create: [
          {
            name: 'Swift Sneakers',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
            unitPrice: 9900,
            stockQuantity: 300
          },
          {
            name: 'Drop Hoodie',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            unitPrice: 7500,
            stockQuantity: 200
          }
        ]
      }
    }
  });

  const liveEvent = await prisma.event.create({
    data: {
      name: 'Live Mega Drop',
      coverPhotoUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
      scheduledAt: new Date(now.getTime() - 5 * 60 * 1000),
      status: 'LIVE',
      items: {
        create: [
          {
            name: 'Flash Jacket',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            unitPrice: 12900,
            stockQuantity: 500
          },
          {
            name: 'Speed Cap',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
            unitPrice: 2500,
            stockQuantity: 150
          },
          {
            name: 'Swift Socks',
            coverPhotoUrl: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908',
            unitPrice: 1200,
            stockQuantity: 400
          }
        ]
      }
    }
  });

  console.log('Seeded admin user and events', {
    lockedEventId: lockedEvent.id,
    liveEventId: liveEvent.id
  });
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
