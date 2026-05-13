'use client';

import { ComparisonViewer } from '@/components/viewer/ComparisonViewer';
import { StreamerToolbox } from '@/components/streamer/StreamerToolbox';
import { useState } from 'react';
import type { Submission } from '@/types';

/**
 * 피드백 비교 뷰어 페이지
 * 신청자의 원본 그림과 스트리머의 피드백 그림을 비교합니다.
 */
export default function FeedbackViewerPage({
  params,
}: {
  params: { sessionId: string; submissionId: string };
}) {
  // TODO: API에서 데이터 로드. 현재 데모 데이터 사용.
  const DEMO_ORIGINAL = 'https://picsum.photos/id/25/1200/800';
  const DEMO_FEEDBACK = 'https://picsum.photos/id/26/1200/800';

  const [feedbackUrl, setFeedbackUrl] = useState<string | null>(DEMO_FEEDBACK);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mockSubmission: Submission = {
    id: params.submissionId,
    sessionId: params.sessionId,
    submitterId: 'user-1',
    originalImageUrl: DEMO_ORIGINAL,
    originalImageKey: 'sessions/test/submissions/test/original/img.png',
    title: '포트폴리오 일러스트',
    description: '인체 비율 피드백 부탁드립니다',
    concernCategories: ['ANATOMY', 'COLORING'],
    diagnosisPins: [
      { id: 'pin-1', x: 400, y: 300, label: '팔 비율이 어색합니다', category: 'ANATOMY' },
      { id: 'pin-2', x: 700, y: 200, label: '하늘 색감 조언 부탁', category: 'COLORING' },
      { id: 'pin-3', x: 600, y: 500, label: '다리 원근감 부족', category: 'PERSPECTIVE' },
    ],
    selfNote: '특히 팔 길이가 맞는지 확인해주세요',
    status: 'IN_REVIEW',
    queuePosition: 0,
    createdAt: new Date().toISOString(),
  };

  const demoAreaComments = [
    { pinId: 'pin-1', comment: '팔 길이를 10% 줄이면 자연스러워집니다' },
    { pinId: 'pin-2', comment: '하늘에 보라색 그라데이션을 추가해보세요' },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* ─── Left: Comparison Viewer ─── */}
        <div className="flex-1 flex flex-col gap-4">
          <header>
            <h1 className="text-xl font-mono font-bold">Canvas Verdict — Feedback Viewer</h1>
            <p className="text-sm text-gray-500 font-mono mt-1">
              Session: {params.sessionId} / Submission: {params.submissionId}
            </p>
          </header>

          <ComparisonViewer
            originalImageUrl={DEMO_ORIGINAL}
            feedbackImageUrl={feedbackUrl}
            diagnosisPins={mockSubmission.diagnosisPins}
            areaComments={demoAreaComments}
            originalWidth={1200}
            originalHeight={800}
          />
        </div>

        {/* ─── Right: Streamer Toolbox ─── */}
        <div className="w-full lg:w-80 shrink-0">
          <StreamerToolbox
            sessionId={params.sessionId}
            currentSubmission={mockSubmission}
            queue={[mockSubmission]}
            currentIndex={currentIndex}
            onNavigate={setCurrentIndex}
            onFeedbackUploaded={(result) => setFeedbackUrl(result.url)}
          />
        </div>
      </div>
    </main>
  );
}
