import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { createSubmissionSchema, sessionIdParam, paginationSchema } from '@/lib/validators';
import {
  successResponse, errorResponse, validationError,
  buildPaginationMeta, parseSearchParams,
} from '@/lib/utils';

interface RouteContext {
  params: { sessionId: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const paramsParsed = sessionIdParam.safeParse(params);
    if (!paramsParsed.success) return validationError(paramsParsed.error);

    const queryParams = parseSearchParams(request.url);
    const query = paginationSchema.safeParse(queryParams);
    if (!query.success) return validationError(query.error);

    const { sessionId } = paramsParsed.data;
    const { page, limit } = query.data;

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return errorResponse('SESSION_NOT_FOUND', 'Session not found', 404);

    const where = { sessionId };
    const [submissions, totalCount] = await Promise.all([
      prisma.submission.findMany({
        where,
        include: { submitter: true },
        orderBy: { queuePosition: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.submission.count({ where }),
    ]);

    return successResponse(submissions, buildPaginationMeta(page, limit, totalCount));
  } catch (error) {
    console.error('GET submissions error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch submissions', 500);
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const paramsParsed = sessionIdParam.safeParse(params);
    if (!paramsParsed.success) return validationError(paramsParsed.error);

    const body = await request.json();
    const parsed = createSubmissionSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const { sessionId } = paramsParsed.data;

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return errorResponse('SESSION_NOT_FOUND', 'Session not found', 404);
    if (session.status !== 'OPEN') return errorResponse('SESSION_NOT_OPEN', 'Session is not accepting submissions', 422);

    const currentCount = await prisma.submission.count({ where: { sessionId } });
    if (currentCount >= session.maxSubmissions) {
      return errorResponse('MAX_SUBMISSIONS_REACHED', `Max ${session.maxSubmissions} submissions`, 422);
    }

    const submitterId = request.headers.get('x-user-id');
    if (!submitterId) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const submission = await prisma.submission.create({
      data: {
        sessionId,
        submitterId,
        originalImageUrl: parsed.data.originalImageUrl,
        originalImageKey: parsed.data.originalImageKey,
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        concernCategories: parsed.data.concernCategories,
        diagnosisPins: parsed.data.diagnosisPins ?? [],
        selfNote: parsed.data.selfNote ?? null,
        queuePosition: currentCount,
      },
      include: { submitter: true },
    });

    // 유저의 총 제출 수 증가
    await prisma.user.update({
      where: { id: submitterId },
      data: { totalSubmissions: { increment: 1 } },
    });

    return successResponse(submission, undefined, 201);
  } catch (error) {
    console.error('POST submissions error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to create submission', 500);
  }
}
