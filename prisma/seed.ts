import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Seed master processes
  const processes = [
    '要件定義',
    '基本設計',
    '詳細設計',
    '実装',
    'テスト',
    '保守・運用',
  ];

  for (const processName of processes) {
    await prisma.masterProcess.upsert({
      where: { name: processName },
      update: {},
      create: { name: processName },
    });
  }

  console.log('Master processes seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
