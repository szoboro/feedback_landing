import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';
import { createPrescriptionSchema, submissionIdParam } from '@/lib/validators';
import { successResponse, errorResponse, validationError } from '@/lib/utils';

interface RouteContext {
  params: { sessionId: string; submissionId: string };
}

/**
 * GET /api/sessions/:sid/submissions/:subId/prescriptions
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const parsed = submissionIdParam.safeParse(params);
    if (!parsed.success) return validationError(parsed.error);

    const prescriptions = await prisma.prescription.findMany({
      where: { submissionId: parsed.data.submissionId },
      include: { reviewer: true },
      orderBy: { version: 'desc' },
    });

    return successResponse(prescriptions);
  } catch (error) {
    console.error('GET prescriptions error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to fetch prescriptions', 500);
  }
}

/**
 * POST /api/sessions/:sid/submissions/:subId/prescriptions
 * 새 처방전 생성 (피드백 이미지 + 5축 점수)
 */
export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const paramsParsed = submissionIdParam.safeParse(params);
    if (!paramsParsed.success) return validationError(paramsParsed.error);

    const body = await req.json();
    const parsed = createPrescriptionSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    const reviewerId = req.headers.get('x-user-id');
    if (!reviewerId) return errorResponse('UNAUTHORIZED', 'Authentication required', 401);

    const submission = await prisma.submission.findUnique({
      where: { id: paramsParsed.data.submissionId },
    });
    if (!submission) return errorResponse('SUBMISSION_NOT_FOUND', 'Submission not found', 404);

    // 버전 자동 증가
    const latestVersion = await prisma.prescription.findFirst({
      where: { submissionId: paramsParsed.data.submissionId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    const prescription = await prisma.prescription.create({
      data: {
        submissionId: paramsParsed.data.submissionId,
        reviewerId,
        feedbackImageUrl: parsed.data.feedbackImageUrl ?? null,
        feedbackImageKey: parsed.data.feedbackImageKey ?? null,
        version: (latestVersion?.version ?? 0) + 1,
        anatomyScore: parsed.data.scores.anatomyScore,
        coloringScore: parsed.data.scores.coloringScore,
        compositionScore: parsed.data.scores.compositionScore,
        lineQualityScore: parsed.data.scores.lineQualityScore,
        creativityScore: parsed.data.scores.creativityScore,
        overallComment: parsed.data.overallComment ?? null,
        areaComments: parsed.data.areaComments ?? [],
        isFinal: parsed.data.isFinal ?? false,
      },
      include: { reviewer: true },
    });

    // Submission 상태 전환
    if (submission.status === 'WAITING') {
      await prisma.submission.update({
        where: { id: paramsParsed.data.submissionId },
        data: { status: 'IN_REVIEW' },
      });
    }
    if (parsed.data.isFinal) {
      await prisma.submission.update({
        where: { id: paramsParsed.data.submissionId },
        data: { status: 'COMPLETED' },
      });

      // 성장 스코어 업데이트
      await updateGrowthMetrics(submission.submitterId);
    }

    return successResponse(prescription, undefined, 201);
  } catch (error) {
    console.error('POST prescription error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to create prescription', 500);
  }
}

/**
 * 유저의 성장 스코어 메타데이터를 재계산합니다.
 * 모든 최종 처방전의 평균 점수와 성장률을 산출합니다.
 */
async function updateGrowthMetrics(userId: string) {
  const allFinal = await prisma.prescription.findMany({
    where: {
      isFinal: true,
      submission: { submitterId: userId },
    },
    orderBy: { createdAt: 'asc' },
    select: {
      anatomyScore: true,
      coloringScore: true,
      compositionScore: true,
      lineQualityScore: true,
      creativityScore: true,
      createdAt: true,
    },
  });

  if (allFinal.length === 0) return;

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const avgAnatomy = avg(allFinal.map((p) => p.anatomyScore));
  const avgColoring = avg(allFinal.map((p) => p.coloringScore));
  const avgComposition = avg(allFinal.map((p) => p.compositionScore));
  const avgLineQuality = avg(allFinal.map((p) => p.lineQualityScore));
  const avgCreativity = avg(allFinal.map((p) => p.creativityScore));

  const overallScores = allFinal.map(
    (p) => (p.anatomyScore + p.coloringScore + p.compositionScore + p.lineQualityScore + p.creativityScore) / 5
  );

  // 성장률: 최근 5회 평균 vs 첫 5회 평균
  let growthRate = null;
  if (overallScores.length >= 5) {
    const first5 = avg(overallScores.slice(0, 5));
    const last5 = avg(overallScores.slice(-5));
    growthRate = first5 > 0 ? ((last5 - first5) / first5) * 100 : null;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalPrescriptionsReceived: allFinal.length,
      avgAnatomyScore: Math.round(avgAnatomy * 10) / 10,
      avgColoringScore: Math.round(avgColoring * 10) / 10,
      avgCompositionScore: Math.round(avgComposition * 10) / 10,
      avgLineQualityScore: Math.round(avgLineQuality * 10) / 10,
      avgCreativityScore: Math.round(avgCreativity * 10) / 10,
      latestOverallScore: Math.round(overallScores[overallScores.length - 1] * 10) / 10,
      growthRate: growthRate !== null ? Math.round(growthRate * 100) / 100 : null,
    },
  });
}
