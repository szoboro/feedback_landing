'use client';

import { useComparisonViewer } from '@/hooks/useComparisonViewer';
import { DiagnosisPinOverlay } from './DiagnosisPinOverlay';
import type { DiagnosisPin, AreaComment, ComparisonMode } from '@/types';
import { useRef, useCallback, useState } from 'react';
import Image from 'next/image';

// ═══════════════════════════════════════════════════════════
// ComparisonViewer — 인터랙티브 비교 뷰어
// Slider / Side-by-Side / Toggle 3가지 모드 지원
// ═══════════════════════════════════════════════════════════

interface ComparisonViewerProps {
  originalImageUrl: string;
  feedbackImageUrl: string | null;
  diagnosisPins?: DiagnosisPin[];
  areaComments?: AreaComment[];
  originalWidth: number;
  originalHeight: number;
}

const MODE_LABELS: Record<ComparisonMode, string> = {
  'slider': '🔀 Slider',
  'side-by-side': '📐 Side by Side',
  'toggle': '👁 Toggle (Space)',
};

export function ComparisonViewer({
  originalImageUrl,
  feedbackImageUrl,
  diagnosisPins = [],
  areaComments = [],
  originalWidth,
  originalHeight,
}: ComparisonViewerProps) {
  const viewer = useComparisonViewer();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const aspect = `${originalWidth} / ${originalHeight}`;

  const transformStyle = {
    transform: `scale(${viewer.transform.scale}) translate(${viewer.transform.translateX}px, ${viewer.transform.translateY}px)`,
    transformOrigin: 'center center',
  };

  // ─── Slider drag handler ──────────────────────────────

  const handleSliderInteraction = useCallback(
    (e: React.PointerEvent | React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pos = ((e.clientX - rect.left) / rect.width) * 100;
      viewer.setSliderPosition(Math.max(0, Math.min(100, pos)));
    },
    [viewer]
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* ─── Mode Selector + Controls ─── */}
      <div className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg border border-gray-700">
        {(Object.keys(MODE_LABELS) as ComparisonMode[]).map((m) => (
          <button
            key={m}
            onClick={() => viewer.setMode(m)}
            className={`px-3 py-1.5 rounded text-sm font-mono transition-colors ${
              viewer.mode === m
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
        <div className="w-px h-6 bg-gray-600" />
        <button
          onClick={viewer.resetTransform}
          className="px-3 py-1.5 rounded text-sm font-mono bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          🔄 Reset Zoom
        </button>
        <span className="ml-auto text-xs text-gray-500 font-mono">
          {Math.round(viewer.transform.scale * 100)}%
          {viewer.mode === 'toggle' && (
            <span className="ml-2">
              {viewer.isToggleActive ? '🟢 Feedback' : '⚪ Original'}
            </span>
          )}
        </span>
      </div>

      {/* ─── Viewer Area ─── */}
      <div
        ref={containerRef}
        className="relative w-full bg-gray-950 rounded-lg overflow-hidden border border-gray-700 select-none"
        style={{ aspectRatio: viewer.mode === 'side-by-side' ? `${originalWidth * 2} / ${originalHeight}` : aspect }}
        onWheel={viewer.handleWheel}
        onPointerDown={viewer.handlePanStart}
        onPointerMove={(e) => {
          viewer.handlePanMove(e);
          if (isDraggingSlider && viewer.mode === 'slider') handleSliderInteraction(e);
        }}
        onPointerUp={() => { viewer.handlePanEnd(); setIsDraggingSlider(false); }}
        onPointerLeave={() => { viewer.handlePanEnd(); setIsDraggingSlider(false); }}
      >
        {viewer.mode === 'slider' && (
          <SliderView
            originalUrl={originalImageUrl}
            feedbackUrl={feedbackImageUrl}
            position={viewer.sliderPosition}
            transformStyle={transformStyle}
            pins={diagnosisPins}
            areaComments={areaComments}
            onSliderDown={() => setIsDraggingSlider(true)}
            width={originalWidth}
            height={originalHeight}
          />
        )}

        {viewer.mode === 'side-by-side' && (
          <SideBySideView
            originalUrl={originalImageUrl}
            feedbackUrl={feedbackImageUrl}
            transformStyle={transformStyle}
            pins={diagnosisPins}
            areaComments={areaComments}
            width={originalWidth}
            height={originalHeight}
          />
        )}

        {viewer.mode === 'toggle' && (
          <ToggleView
            originalUrl={originalImageUrl}
            feedbackUrl={feedbackImageUrl}
            isActive={viewer.isToggleActive}
            transformStyle={transformStyle}
            pins={diagnosisPins}
            areaComments={areaComments}
            width={originalWidth}
            height={originalHeight}
          />
        )}
      </div>
    </div>
  );
}

// ─── Slider Mode ─────────────────────────────────────────

function SliderView({
  originalUrl, feedbackUrl, position, transformStyle,
  pins, areaComments, onSliderDown, width, height,
}: {
  originalUrl: string;
  feedbackUrl: string | null;
  position: number;
  transformStyle: React.CSSProperties;
  pins: DiagnosisPin[];
  areaComments: AreaComment[];
  onSliderDown: () => void;
  width: number;
  height: number;
}) {
  return (
    <>
      {/* Original (full) */}
      <div className="absolute inset-0" style={transformStyle}>
        <Image src={originalUrl} alt="Original" fill sizes="100vw" className="object-contain" priority />
        <DiagnosisPinOverlay pins={pins} areaComments={areaComments} imageWidth={width} imageHeight={height} />
      </div>
      {/* Feedback (clipped by slider) */}
      {feedbackUrl && (
        <div
          className="absolute inset-0"
          style={{
            ...transformStyle,
            clipPath: `inset(0 0 0 ${position}%)`,
          }}
        >
          <Image src={feedbackUrl} alt="Feedback" fill sizes="100vw" className="object-contain" />
        </div>
      )}
      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        onPointerDown={(e) => { e.stopPropagation(); onSliderDown(); }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-gray-800 text-xs font-bold">⇔</span>
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded font-mono z-10">Original</span>
      <span className="absolute top-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded font-mono z-10">Feedback</span>
    </>
  );
}

// ─── Side-by-Side Mode ───────────────────────────────────

function SideBySideView({
  originalUrl, feedbackUrl, transformStyle, pins, areaComments, width, height,
}: {
  originalUrl: string;
  feedbackUrl: string | null;
  transformStyle: React.CSSProperties;
  pins: DiagnosisPin[];
  areaComments: AreaComment[];
  width: number;
  height: number;
}) {
  return (
    <div className="flex w-full h-full" style={transformStyle}>
      <div className="relative flex-1 border-r border-gray-600">
        <Image src={originalUrl} alt="Original" fill sizes="50vw" className="object-contain" priority />
        <DiagnosisPinOverlay pins={pins} areaComments={areaComments} imageWidth={width} imageHeight={height} />
        <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded font-mono z-10">Original</span>
      </div>
      <div className="relative flex-1">
        {feedbackUrl ? (
          <Image src={feedbackUrl} alt="Feedback" fill sizes="50vw" className="object-contain" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 font-mono text-sm">
            피드백 이미지 없음
          </div>
        )}
        <span className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded font-mono z-10">Feedback</span>
      </div>
    </div>
  );
}

// ─── Toggle Mode ─────────────────────────────────────────

function ToggleView({
  originalUrl, feedbackUrl, isActive, transformStyle, pins, areaComments, width, height,
}: {
  originalUrl: string;
  feedbackUrl: string | null;
  isActive: boolean;
  transformStyle: React.CSSProperties;
  pins: DiagnosisPin[];
  areaComments: AreaComment[];
  width: number;
  height: number;
}) {
  return (
    <div className="absolute inset-0" style={transformStyle}>
      <Image src={originalUrl} alt="Original" fill sizes="100vw" className="object-contain" priority />
      <DiagnosisPinOverlay pins={pins} areaComments={areaComments} imageWidth={width} imageHeight={height} />
      {feedbackUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: isActive ? 1 : 0 }}
        >
          <Image src={feedbackUrl} alt="Feedback" fill sizes="100vw" className="object-contain" />
        </div>
      )}
    </div>
  );
}
