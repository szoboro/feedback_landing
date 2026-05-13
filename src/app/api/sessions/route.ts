import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { createSessionSchema, paginationSchema } from '@/lib/validators';
import {
  successResponse, errorResponse, validationError,
  buildPaginationMeta, parseSearchParams,
} from '@/lib/utils';

/**
 * GET /api/sessions
 */
export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(request.url);
    const query = paginationSchema.safeParse(params);
    if (!query.success) return validationError(query.error);

    const { page, limit } = query.data;

    const [sessions, totalCount] = await Promise.all([
      prisma.session.findMany({
        include: { host: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.session.count(),
    ]);

    return successResponse(sessions, buildPaginationMeta(page, limit, totalCount));
  } catch (error) {
    console.error('GET /api/sessions error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch sessions', 500);
  }
}

/**
 * POST /api/sessions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const hostId = request.headers.get('x-user-id');
    if (!hostId) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const session = await prisma.session.create({
      data: {
        hostId,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        maxSubmissions: parsed.data.maxSubmissions ?? 30,
      },
      include: { host: true },
    });

    return successResponse(session, undefined, 201);
  } catch (error) {
    console.error('POST /api/sessions error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to create session', 500);
  }
}
