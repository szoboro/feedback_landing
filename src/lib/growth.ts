import type { PrescriptionScores } from '@/types';

// ═══════════════════════════════════════════════════════════
// Growth Analysis — 성장 분석 유틸리티
// 과거 vs 현재 점수를 비교하여 분석 텍스트 생성
// ═══════════════════════════════════════════════════════════

interface ScoreHistory {
  current: PrescriptionScores;
  previous: PrescriptionScores | null;
  allTime: PrescriptionScores[];
}

export interface GrowthInsight {
  axis: string;
  axisKey: keyof PrescriptionScores;
  current: number;
  previous: number | null;
  delta: number | null;
  deltaPercent: number | null;
  trend: 'up' | 'down' | 'stable' | 'new';
  message: string;
}

export interface DiagnosisResult {
  name: string;
  emoji: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
}

// ─── 축 한글 매핑 ───────────────────────────────────────

const AXIS_LABELS: Record<keyof PrescriptionScores, string> = {
  anatomyScore: '인체',
  coloringScore: '채색',
  compositionScore: '구도',
  lineQualityScore: '선질',
  creativityScore: '창의성',
};

// ─── 의료 테마 진단명 ───────────────────────────────────

const DIAGNOSIS_MAP: Record<keyof PrescriptionScores, { mild: string; moderate: string; severe: string }> = {
  anatomyScore: {
    mild: '경미한 인체 비율 편차',
    moderate: '인체 부조화 증후군',
    severe: '급성 인체 부조화',
  },
  coloringScore: {
    mild: '경미한 색감 불균형',
    moderate: '색채 감각 결핍증',
    severe: '만성 채색 부조화',
  },
  compositionScore: {
    mild: '경미한 구도 편향',
    moderate: '구도 불균형 증후군',
    severe: '급성 구도 붕괴',
  },
  lineQualityScore: {
    mild: '경미한 선질 불안정',
    moderate: '선질 떨림 증후군',
    severe: '만성 선질 경직',
  },
  creativityScore: {
    mild: '경미한 창의력 저하',
    moderate: '창의적 고착 증후군',
    severe: '급성 발상 결핍',
  },
};

const SEVERITY_EMOJI: Record<string, string> = {
  mild: '💊',
  moderate: '🩺',
  severe: '🏥',
};

// ─── 성장 분석 텍스트 생성 ───────────────────────────────

export function generateGrowthInsights(history: ScoreHistory): GrowthInsight[] {
  const axes = Object.keys(AXIS_LABELS) as (keyof PrescriptionScores)[];

  return axes.map((key) => {
    const current = history.current[key];
    const previous = history.previous?.[key] ?? null;

    let delta: number | null = null;
    let deltaPercent: number | null = null;
    let trend: GrowthInsight['trend'] = 'new';
    let message: string;

    if (previous !== null) {
      delta = current - previous;
      deltaPercent = previous > 0 ? Math.round((delta / previous) * 100) : null;

      if (delta > 0) {
        trend = 'up';
        message = `지난번보다 ${AXIS_LABELS[key]} 점수가 ${Math.abs(deltaPercent ?? 0)}% 상승했습니다! 🎉`;
      } else if (delta < 0) {
        trend = 'down';
        message = `${AXIS_LABELS[key]} 점수가 ${Math.abs(deltaPercent ?? 0)}% 하락했습니다. 복습이 필요합니다.`;
      } else {
        trend = 'stable';
        message = `${AXIS_LABELS[key]} 점수가 유지되고 있습니다. 꾸준히 연습하세요.`;
      }
    } else {
      message = `${AXIS_LABELS[key]} 첫 번째 진단 결과입니다. 앞으로의 성장을 기대합니다!`;
    }

    return {
      axis: AXIS_LABELS[key],
      axisKey: key,
      current,
      previous,
      delta,
      deltaPercent,
      trend,
      message,
    };
  });
}

// ─── 진단명 생성 ─────────────────────────────────────────

export function generateDiagnosis(scores: PrescriptionScores): DiagnosisResult {
  const axes = Object.keys(AXIS_LABELS) as (keyof PrescriptionScores)[];

  // 가장 낮은 축 찾기
  let weakestKey = axes[0];
  let weakestScore = scores[axes[0]];
  for (const key of axes) {
    if (scores[key] < weakestScore) {
      weakestScore = scores[key];
      weakestKey = key;
    }
  }

  const severity: DiagnosisResult['severity'] =
    weakestScore <= 3 ? 'severe' : weakestScore <= 6 ? 'moderate' : 'mild';

  const name = DIAGNOSIS_MAP[weakestKey][severity];
  const descriptions: Record<string, string> = {
    mild: `전반적으로 양호하나, ${AXIS_LABELS[weakestKey]} 영역에서 경미한 개선이 필요합니다.`,
    moderate: `${AXIS_LABELS[weakestKey]} 영역에서 중간 정도의 교정이 필요합니다. 집중 훈련을 권장합니다.`,
    severe: `${AXIS_LABELS[weakestKey]} 영역에서 즉각적인 교정이 필요합니다. 기초부터 재훈련하세요.`,
  };

  return {
    name,
    emoji: SEVERITY_EMOJI[severity],
    severity,
    description: descriptions[severity],
  };
}

// ─── 재활 과제 생성 ──────────────────────────────────────

export interface RehabTask {
  category: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
}

const TASK_TEMPLATES: Record<keyof PrescriptionScores, string[]> = {
  anatomyScore: [
    '크로키 10분 드로잉 5회',
    '인체 비율 참고서 1장 모사',
    '관절 구조 스케치 연습',
  ],
  coloringScore: [
    '색상환 기반 배색 연습',
    '명암 3단계 톤 연습',
    '좋아하는 작품의 색상 팔레트 분석',
  ],
  compositionScore: [
    '3분할 법칙 적용 썸네일 스케치',
    '시선 유도 흐름도 작성',
    '마스터 작품 구도 분석 1회',
  ],
  lineQualityScore: [
    '직선/곡선 긋기 워밍업 5분',
    '한 획 드로잉 연습',
    '필압 조절 그라데이션 연습',
  ],
  creativityScore: [
    '랜덤 키워드 3개로 일러스트 구상',
    '일상 사물 의인화 스케치',
    '다른 작가 스타일로 같은 주제 그리기',
  ],
};

export function generateRehabTasks(scores: PrescriptionScores): RehabTask[] {
  const axes = Object.keys(AXIS_LABELS) as (keyof PrescriptionScores)[];
  const tasks: RehabTask[] = [];

  const sorted = axes.sort((a, b) => scores[a] - scores[b]);

  for (let i = 0; i < sorted.length; i++) {
    const key = sorted[i];
    const score = scores[key];
    if (score >= 9) continue; // 9점 이상은 과제 불필요

    const priority: RehabTask['priority'] = score <= 4 ? 'high' : score <= 7 ? 'medium' : 'low';
    const templates = TASK_TEMPLATES[key];
    const task = templates[Math.min(i, templates.length - 1)];

    tasks.push({ category: AXIS_LABELS[key], task, priority });
  }

  return tasks;
}

// ─── 레이더 차트 데이터 변환 ─────────────────────────────

export function toRadarData(
  current: PrescriptionScores,
  previous?: PrescriptionScores | null
) {
  const axes = Object.keys(AXIS_LABELS) as (keyof PrescriptionScores)[];
  return axes.map((key) => ({
    axis: AXIS_LABELS[key],
    current: current[key],
    previous: previous?.[key] ?? 0,
    fullMark: 10,
  }));
}
