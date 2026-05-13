'use client';

import { generateDiagnosis, generateGrowthInsights, generateRehabTasks } from '@/lib/growth';
import { calculateBadge } from '@/lib/badges';
import { ScoreRadarChart } from './ScoreRadarChart';
import type { PrescriptionScores, Submission, Prescription, ExpertComment } from '@/types';
import { useRef, useCallback, useState } from 'react';

// ═══════════════════════════════════════════════════════════
// PrescriptionReport — 커뮤니티형 처방전 카드
// ═══════════════════════════════════════════════════════════

interface PrescriptionReportProps {
  submission: Submission;
  prescription: Prescription;
  previousScores?: PrescriptionScores | null;
  feedbackImageUrl?: string | null;
  comments?: ExpertComment[];
}

const TREND_ICON = { up: '📈', down: '📉', stable: '➡️', new: '🆕' };
const TREND_COLOR = { up: 'text-green-400', down: 'text-red-400', stable: 'text-gray-400', new: 'text-blue-400' };
const PRIORITY_STYLE = {
  high: 'border-red-500 bg-red-950/30',
  medium: 'border-yellow-500 bg-yellow-950/20',
  low: 'border-green-500 bg-green-950/20',
};
const PRIORITY_LABEL = { high: '🔴 긴급', medium: '🟡 권장', low: '🟢 참고' };

export function PrescriptionReport({
  submission,
  prescription,
  previousScores = null,
  feedbackImageUrl,
  comments = [],
}: PrescriptionReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<ExpertComment[]>(comments);

  const diagnosis = generateDiagnosis(prescription.scores);
  const insights = generateGrowthInsights({
    current: prescription.scores,
    previous: previousScores,
    allTime: [],
  });
  const tasks = generateRehabTasks(prescription.scores);

  const overallScore = Math.round(
    (prescription.scores.anatomyScore +
      prescription.scores.coloringScore +
      prescription.scores.compositionScore +
      prescription.scores.lineQualityScore +
      prescription.scores.creativityScore) / 5 * 10
  ) / 10;

  const handleExport = useCallback(async () => {
    if (!reportRef.current) return;
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: '#030712',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = `처방전_${submission.title}_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [submission.title]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: ExpertComment = {
      id: `comment-${Date.now()}`,
      prescriptionId: prescription.id,
      authorId: 'me',
      authorNickname: '나',
      authorAvatarUrl: null,
      authorReputation: 50, // 뉴비 상태
      content: newComment.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    setLocalComments((prev) => [...prev, comment]);
    setNewComment('');
  };

  const handleLike = (commentId: string) => {
    setLocalComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-lg text-sm font-mono bg-indigo-700 text-white hover:bg-indigo-600 transition-colors"
        >
          📸 PNG로 저장
        </button>
      </div>

      {/* ─── Report Content (캡처 대상) ─── */}
      <div ref={reportRef} className="flex flex-col gap-4 p-6 bg-gray-950 rounded-xl">

        {/* ─── 1. 진단서 헤더 ─── */}
        <div className="border border-gray-700 rounded-xl p-5 bg-gray-900/50">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{diagnosis.emoji}</span>
            <h2 className="text-xl font-bold text-white">진단 결과</h2>
            <span className={`ml-auto px-2 py-0.5 rounded text-xs font-mono ${
              diagnosis.severity === 'severe' ? 'bg-red-900 text-red-300' :
              diagnosis.severity === 'moderate' ? 'bg-yellow-900 text-yellow-300' :
              'bg-green-900 text-green-300'
            }`}>
              {diagnosis.severity === 'severe' ? '중증' : diagnosis.severity === 'moderate' ? '주의' : '양호'}
            </span>
          </div>
          <h3 className="text-lg text-blue-400 font-bold mb-1">{diagnosis.name}</h3>
          <p className="text-sm text-gray-400">{diagnosis.description}</p>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700">
            <span className="text-xs text-gray-500">작품: {submission.title}</span>
            <span className="text-xs text-gray-500">회차 #{prescription.version}</span>
            <span className="text-xs text-gray-500">종합 {overallScore}점</span>
          </div>
        </div>

        {/* ─── 2. 레이더 차트 + 성장 분석 ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-gray-700 rounded-xl p-4 bg-gray-900/50">
            <h3 className="text-sm text-gray-400 mb-2">📊 능력치 분석</h3>
            <ScoreRadarChart current={prescription.scores} previous={previousScores} size={280} />
          </div>
          <div className="border border-gray-700 rounded-xl p-4 bg-gray-900/50">
            <h3 className="text-sm text-gray-400 mb-3">📈 성장 분석</h3>
            <div className="flex flex-col gap-2">
              {insights.map((insight) => (
                <div key={insight.axisKey} className="flex items-center gap-2 text-sm">
                  <span>{TREND_ICON[insight.trend]}</span>
                  <span className="text-gray-300 w-12">{insight.axis}</span>
                  <span className="text-white font-bold w-6">{insight.current}</span>
                  {insight.delta !== null && (
                    <span className={`text-xs ${TREND_COLOR[insight.trend]}`}>
                      ({insight.delta > 0 ? '+' : ''}{insight.delta})
                    </span>
                  )}
                  <span className={`text-xs flex-1 ${TREND_COLOR[insight.trend]}`}>
                    {insight.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── 3. 피드백 이미지 ─── */}
        {feedbackImageUrl && (
          <div className="border border-gray-700 rounded-xl p-4 bg-gray-900/50">
            <h3 className="text-sm text-gray-400 mb-2">🖼️ 피드백 이미지</h3>
            <img src={feedbackImageUrl} alt="Feedback" className="w-full rounded-lg object-contain max-h-96" />
          </div>
        )}

        {/* ─── 4. 재활 과제 ─── */}
        <div className="border border-gray-700 rounded-xl p-4 bg-gray-900/50">
          <h3 className="text-sm text-gray-400 mb-3">📋 추천 연습 과제</h3>
          <div className="flex flex-col gap-2">
            {tasks.map((task, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${PRIORITY_STYLE[task.priority]}`}>
                <span className="text-xs shrink-0">{PRIORITY_LABEL[task.priority]}</span>
                <span className="text-xs text-gray-400 w-12 shrink-0">{task.category}</span>
                <span className="text-sm text-white">{task.task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 5. 고수들의 소견 (댓글 스레드, 캡처 대상 밖) ─── */}
      <div className="border border-gray-700 rounded-xl p-5 bg-gray-900/50">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm text-gray-400">💬 고수들의 소견</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-900/40 text-blue-400 border border-blue-700/50">
            {localComments.length}개
          </span>
        </div>

        {/* Comments list */}
        <div className="flex flex-col gap-3 mb-4">
          {localComments.length === 0 && (
            <p className="text-center text-gray-600 text-sm py-6">
              아직 소견이 없어요. 첫 번째 의견을 남겨보세요! ✍️
            </p>
          )}
          {localComments.map((comment) => {
            const badge = calculateBadge(comment.authorReputation);
            return (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/60 transition-colors">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {comment.authorNickname[0]}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{comment.authorNickname}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${badge.style}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {comment.authorReputation.toLocaleString()}p
                    </span>
                    <span className="text-[10px] text-gray-600 ml-auto shrink-0">
                      {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                  <button
                    onClick={() => handleLike(comment.id)}
                    className="mt-1.5 text-xs text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    👍 {comment.likes > 0 && comment.likes}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comment input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="소견을 남겨주세요 (고수가 아니어도 괜찮아요!)"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-sm font-medium transition-colors"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
