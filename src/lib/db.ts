import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient 싱글턴 인스턴스.
 * Next.js dev 모드에서 hot-reload 시 커넥션 풀 누수를 방지합니다.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
