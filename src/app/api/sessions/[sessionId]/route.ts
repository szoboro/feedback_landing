import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { updateSessionSchema, sessionIdParam } from '@/lib/validators';
import { successResponse, errorResponse, validationError } from '@/lib/utils';

interface RouteContext {
  params: { sessionId: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const parsed = sessionIdParam.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const session = await prisma.session.findUnique({
      where: { id: parsed.data.sessionId },
      include: {
        host: true,
        submissions: {
          orderBy: { queuePosition: 'asc' },
          include: { submitter: true },
        },
      },
    });

    if (!session) return errorResponse('SESSION_NOT_FOUND', 'Session not found', 404);
    return successResponse(session);
  } catch (error) {
    console.error('GET /api/sessions/:id error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch session', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const paramsParsed = sessionIdParam.safeParse(params);
    if (!paramsParsed.success) return validationError(paramsParsed.error);

    const body = await request.json();
    const parsed = updateSessionSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const existing = await prisma.session.findUnique({
      where: { id: paramsParsed.data.sessionId },
    });
    if (!existing) return errorResponse('SESSION_NOT_FOUND', 'Session not found', 404);

    if (parsed.data.status) {
      const valid = isValidTransition(existing.status, parsed.data.status);
      if (!valid) {
        return errorResponse('INVALID_STATUS_TRANSITION',
          `Cannot transition from ${existing.status} to ${parsed.data.status}`, 422);
      }
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.status === 'OPEN' && existing.status === 'DRAFT') updateData.openedAt = new Date();
    if (parsed.data.status === 'CLOSED') updateData.closedAt = new Date();

    const updated = await prisma.session.update({
      where: { id: paramsParsed.data.sessionId },
      data: updateData,
      include: { host: true },
    });

    return successResponse(updated);
  } catch (error) {
    console.error('PATCH /api/sessions/:id error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to update session', 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const parsed = sessionIdParam.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const existing = await prisma.session.findUnique({ where: { id: parsed.data.sessionId } });
    if (!existing) return errorResponse('SESSION_NOT_FOUND', 'Session not found', 404);

    await prisma.session.delete({ where: { id: parsed.data.sessionId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/sessions/:id error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to delete session', 500);
  }
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['OPEN'], OPEN: ['CLOSED', 'ARCHIVED'], CLOSED: ['ARCHIVED'], ARCHIVED: [],
};

function isValidTransition(from: string, to: string): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
