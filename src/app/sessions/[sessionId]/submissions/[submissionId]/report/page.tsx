'use client';

import { PrescriptionReport } from '@/components/prescription/PrescriptionReport';
import type { Submission, Prescription, ExpertComment } from '@/types';

/**
 * 처방전 리포트 페이지
 * /sessions/:sessionId/submissions/:submissionId/report
 */
export function generateStaticParams() {
  return [{ sessionId: 'test-session', submissionId: 'test-sub' }];
}

export default function ReportPage({
  params,
}: {
  params: { sessionId: string; submissionId: string };
}) {
  const mockSubmission: Submission = {
    id: params.submissionId,
    sessionId: params.sessionId,
    submitterId: 'user-1',
    originalImageUrl: 'https://picsum.photos/id/25/1200/800',
    originalImageKey: 'sessions/test/submissions/test/original/img.png',
    title: '포트폴리오 일러스트',
    description: '인체 비율 피드백 부탁드립니다',
    concernCategories: ['ANATOMY', 'COLORING'],
    diagnosisPins: [
      { id: 'pin-1', x: 400, y: 300, label: '팔 비율이 어색합니다', category: 'ANATOMY' },
    ],
    selfNote: '특히 팔 길이가 맞는지 확인해주세요',
    status: 'COMPLETED',
    queuePosition: 0,
    createdAt: new Date().toISOString(),
  };

  const mockPrescription: Prescription = {
    id: 'rx-1',
    submissionId: params.submissionId,
    reviewerId: 'streamer-1',
    feedbackImageUrl: 'https://picsum.photos/id/26/1200/800',
    feedbackImageKey: 'sessions/test/submissions/test/feedback/rx-1/img.png',
    version: 2,
    scores: {
      anatomyScore: 6,
      coloringScore: 8,
      compositionScore: 7,
      lineQualityScore: 5,
      creativityScore: 9,
    },
    overallComment: '전체적으로 좋은 작품입니다!',
    areaComments: [
      { pinId: 'pin-1', comment: '팔 길이를 10% 줄이면 자연스러워집니다' },
    ],
    isFinal: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPreviousScores = {
    anatomyScore: 4,
    coloringScore: 7,
    compositionScore: 6,
    lineQualityScore: 5,
    creativityScore: 7,
  };

  const mockComments: ExpertComment[] = [
    {
      id: 'c1',
      prescriptionId: 'rx-1',
      authorId: 'user-pro',
      authorNickname: '루나틱화백',
      authorAvatarUrl: null,
      authorReputation: 21500, // 마스터 레벨
      content: '팔 길이도 중요하지만, 어깨 넓이 대비 머리 크기를 한번 확인해보세요. 7~8등신 기준으로 머리가 살짝 큰 것 같아요. 전체적인 프로포션은 많이 좋아졌습니다! 👍',
      likes: 12,
      createdAt: '2026-05-13T10:00:00Z',
    },
    {
      id: 'c2',
      prescriptionId: 'rx-1',
      authorId: 'user-mentor',
      authorNickname: '김멘토',
      authorAvatarUrl: null,
      authorReputation: 3200, // 멘토 레벨
      content: '채색은 정말 좋은데, 명암 경계를 좀 더 부드럽게 처리하면 완성도가 확 올라갈 거예요. 에어브러시보다는 수채 브러시 추천드립니다~',
      likes: 8,
      createdAt: '2026-05-13T11:30:00Z',
    },
    {
      id: 'c3',
      prescriptionId: 'rx-1',
      authorId: 'user-member',
      authorNickname: '그림초보_진수',
      authorAvatarUrl: null,
      authorReputation: 120, // 멤버 레벨
      content: '저도 인체 비율 때문에 고민이 많은데 이런 피드백 너무 도움됩니다ㅠㅠ 같이 화이팅해요!',
      likes: 5,
      createdAt: '2026-05-13T12:00:00Z',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <header>
          <h1 className="text-xl font-bold">Canvas Verdict — 처방전</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mockSubmission.title} · #{mockPrescription.version}회차
          </p>
        </header>

        <PrescriptionReport
          submission={mockSubmission}
          prescription={mockPrescription}
          previousScores={mockPreviousScores}
          feedbackImageUrl={mockPrescription.feedbackImageUrl}
          comments={mockComments}
        />
      </div>
    </main>
  );
}
