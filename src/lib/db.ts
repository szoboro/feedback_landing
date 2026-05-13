import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient 싱글턴 인스턴스.
 * Next.js dev 모드에서 hot-reload 시 커넥션 풀 누수를 방지합니다.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is missing. Using a mock PrismaClient for build.");
    // 빈 객체를 PrismaClient 타입으로 단언하여 빌드 시 크래시 방지
    return {} as PrismaClient; 
  }
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
