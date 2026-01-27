import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const collections = await prisma.hadithCollection.findMany({
    select: { name: true, slug: true, totalHadiths: true }
  });
  console.log('Collections:', JSON.stringify(collections, null, 2));
  
  const hadithCount = await prisma.hadith.count();
  console.log('Total Hadiths:', hadithCount);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
