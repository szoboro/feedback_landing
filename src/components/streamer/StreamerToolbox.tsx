'use client';

// ═══════════════════════════════════════════════════════════
// StreamerToolbox — 스트리머 전용 대시보드 컨트롤
// 대기열 관리, 파일 다운로드, 피드백 업로드
// ═══════════════════════════════════════════════════════════

import type { Submission } from '@/types';
import { FileDropzone } from '@/components/upload/FileDropzone';

interface StreamerToolboxProps {
  sessionId: string;
  currentSubmission: Submission | null;
  queue: Submission[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onFeedbackUploaded?: (result: { url: string; key: string }) => void;
}

export function StreamerToolbox({
  sessionId,
  currentSubmission,
  queue,
  currentIndex,
  onNavigate,
  onFeedbackUploaded,
}: StreamerToolboxProps) {
  const hasNext = currentIndex < queue.length - 1;
  const hasPrev = currentIndex > 0;

  // 파일명 규칙: user_name_date.png
  const downloadFilename = currentSubmission
    ? `${currentSubmission.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.png`
    : 'original.png';

  const handleDownload = async () => {
    if (!currentSubmission) return;
    try {
      const res = await fetch(currentSubmission.originalImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
      <h2 className="text-sm font-mono font-bold text-gray-300">
        🎨 Streamer Toolbox
      </h2>

      {/* ─── Queue Navigation ─── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={!hasPrev}
          className="px-3 py-1.5 rounded text-sm font-mono bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <span className="text-sm font-mono text-gray-400 flex-1 text-center">
          {queue.length > 0
            ? `${currentIndex + 1} / ${queue.length}`
            : '대기열 비어있음'
          }
        </span>
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          disabled={!hasNext}
          className="px-3 py-1.5 rounded text-sm font-mono bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* ─── Current Submission Info ─── */}
      {currentSubmission && (
        <div className="p-2 bg-gray-800 rounded text-xs font-mono text-gray-400 space-y-1">
          <p className="text-white text-sm">{currentSubmission.title}</p>
          <p>카테고리: {currentSubmission.concernCategories.join(', ')}</p>
          {currentSubmission.selfNote && (
            <p>메모: {currentSubmission.selfNote}</p>
          )}
        </div>
      )}

      {/* ─── Download Original ─── */}
      <button
        onClick={handleDownload}
        disabled={!currentSubmission}
        className="w-full px-3 py-2 rounded text-sm font-mono bg-indigo-700 text-white hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ⬇ 원본 다운로드 ({downloadFilename})
      </button>

      {/* ─── Upload Feedback ─── */}
      {currentSubmission && (
        <div>
          <p className="text-xs font-mono text-gray-500 mb-2">
            클립 스튜디오에서 작업한 피드백 이미지를 업로드하세요
          </p>
          <FileDropzone
            sessionId={sessionId}
            submissionId={currentSubmission.id}
            type="feedback"
            onUploadComplete={onFeedbackUploaded}
          />
        </div>
      )}
    </div>
  );
}
