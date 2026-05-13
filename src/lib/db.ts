import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient 싱글턴 인스턴스.
 * Next.js dev 모드에서 hot-reload 시 커넥션 풀 누수를 방지합니다.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrismaClient = (): PrismaClient => {
  try {
    return new PrismaClient({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn']
          : ['error'],
    });
  } catch (error) {
    console.warn("PrismaClient initialization failed. Using Mock.");
    // 빌드/데모 환경용 Proxy Mock
    return new Proxy({} as PrismaClient, {
      get() {
        return new Proxy({}, {
          get() {
            return () => Promise.resolve([]);
          }
        });
      }
    });
  }
};

// Vercel 빌드 시점 등에서 크래시를 방지하기 위해 지연 초기화(Lazy init) 또는 프록시 사용
export const prisma = globalForPrisma.prisma ?? new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = getPrismaClient();
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma as PrismaClient;
}
