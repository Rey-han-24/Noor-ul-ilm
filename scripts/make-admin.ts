/**
 * Script to promote a user to SUPER_ADMIN
 * Run with: npx ts-node scripts/make-admin.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'reyhanbutt18@gmail.com';
  
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' },
  });

  console.log(`✅ User ${user.name} (${user.email}) is now SUPER_ADMIN`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
