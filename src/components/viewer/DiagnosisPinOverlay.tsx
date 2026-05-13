'use client';

import { useState } from 'react';
import type { DiagnosisPin, AreaComment } from '@/types';

// ═══════════════════════════════════════════════════════════
// DiagnosisPinOverlay — 진단 핀 + 텍스트 피드백 오버레이
// ═══════════════════════════════════════════════════════════

interface DiagnosisPinOverlayProps {
  pins: DiagnosisPin[];
  areaComments: AreaComment[];
  imageWidth: number;
  imageHeight: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  ANATOMY: '#FF4444',
  COLORING: '#FF8C00',
  COMPOSITION: '#22C55E',
  PERSPECTIVE: '#3B82F6',
  LINE_QUALITY: '#8B5CF6',
  CREATIVITY: '#EC4899',
  OTHER: '#9CA3AF',
};

const CATEGORY_LABELS: Record<string, string> = {
  ANATOMY: '인체',
  COLORING: '채색',
  COMPOSITION: '구도',
  PERSPECTIVE: '원근법',
  LINE_QUALITY: '선질',
  CREATIVITY: '창의성',
  OTHER: '기타',
};

export function DiagnosisPinOverlay({
  pins, areaComments, imageWidth, imageHeight,
}: DiagnosisPinOverlayProps) {
  const [activePin, setActivePin] = useState<string | null>(null);

  if (pins.length === 0) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {pins.map((pin) => {
        const leftPct = (pin.x / imageWidth) * 100;
        const topPct = (pin.y / imageHeight) * 100;
        const color = CATEGORY_COLORS[pin.category] ?? '#9CA3AF';
        const comment = areaComments.find((c) => c.pinId === pin.id);
        const isActive = activePin === pin.id;

        return (
          <div
            key={pin.id}
            className="absolute pointer-events-auto"
            style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Pin marker */}
            <button
              onClick={() => setActivePin(isActive ? null : pin.id)}
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg transition-transform hover:scale-125 cursor-pointer"
              style={{ backgroundColor: color }}
              title={`${CATEGORY_LABELS[pin.category]}: ${pin.label}`}
            >
              {pins.indexOf(pin) + 1}
            </button>

            {/* Tooltip */}
            {isActive && (
              <div className="absolute left-8 top-0 w-56 p-2 bg-gray-900/95 border border-gray-600 rounded-lg shadow-xl z-30">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-mono text-gray-400">
                    {CATEGORY_LABELS[pin.category]}
                  </span>
                </div>
                <p className="text-sm text-white">{pin.label}</p>
                {comment && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-gray-400 font-mono mb-0.5">처방:</p>
                    <p className="text-sm text-green-400">{comment.comment}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
