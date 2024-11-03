import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const env = process.env.NODE_ENV;
  console.log(`Seeding for environment: ${env}`);

  if (env === 'development') {
    await seedDevelopment();
  }

  if (env === 'test') {
    await seedTest();
  }
}

async function seedDevelopment() {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    console.error('ADMIN_API_KEY is not set in the environment variables.');
    process.exit(1);
  }
  const hashedApiKey = await hash(adminApiKey, 0);

  console.log(
    `Adding record with plaintext $${adminApiKey}$ and hashed key ${hashedApiKey}`,
  );

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

async function seedTest() {
  const testApiKeyAdmin = 'admin-test-api-key';
  await prisma.apiKey.upsert({
    where: { keyHash: testApiKeyAdmin },
    update: {},
    create: {
      keyHash: testApiKeyAdmin,
      description: 'Test API Key',
      role: Role.ADMIN,
    },
  });

  const testApikeyUser = 'user-test-api-key';
  await prisma.apiKey.upsert({
    where: { keyHash: testApikeyUser },
    update: {},
    create: {
      keyHash: testApikeyUser,
      description: 'Test API Key',
      role: Role.USER,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
