import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    console.error('ADMIN_API_KEY is not set in the environment variables.');
    process.exit(1);
  }
  const hashedApiKey = await hash(adminApiKey, 10);

  await prisma.apiKey.upsert({
    where: { keyHash: hashedApiKey },
    update: {},
    create: {
      keyHash: hashedApiKey,
      description: 'Admin API Key',
      role: Role.ADMIN,
    },
  });

  console.log('Admin API Key has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
