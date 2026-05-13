import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { submissionIdParam } from '@/lib/validators';
import { successResponse, errorResponse, validationError } from '@/lib/utils';

interface RouteContext {
  params: { sessionId: string; submissionId: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const parsed = submissionIdParam.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const submission = await prisma.submission.findUnique({
      where: { id: parsed.data.submissionId },
      include: {
        submitter: true,
        prescriptions: {
          orderBy: { version: 'desc' },
          include: { reviewer: true },
        },
      },
    });

    if (!submission) return errorResponse('SUBMISSION_NOT_FOUND', 'Submission not found', 404);
    return successResponse(submission);
  } catch (error) {
    console.error('GET submission detail error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch submission', 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const parsed = submissionIdParam.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const existing = await prisma.submission.findUnique({ where: { id: parsed.data.submissionId } });
    if (!existing) return errorResponse('SUBMISSION_NOT_FOUND', 'Submission not found', 404);

    await prisma.submission.delete({ where: { id: parsed.data.submissionId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('DELETE submission error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to delete submission', 500);
  }
}
