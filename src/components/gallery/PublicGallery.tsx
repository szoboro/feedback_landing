'use client';

import { useState } from 'react';
import type { ConcernCategory } from '@/types';

// ═══════════════════════════════════════════════════════════
// PublicGallery — 공개 처방전 갤러리
// 카테고리 태그 필터 + 비포/애프터 슬라이더 카드
// ═══════════════════════════════════════════════════════════

interface GalleryItem {
  id: string;
  title: string;
  originalImageUrl: string;
  feedbackImageUrl: string;
  categories: ConcernCategory[];
  scores: { anatomy: number; coloring: number; composition: number; lineQuality: number; creativity: number };
  diagnosisName: string;
  overallComment: string | null;
}

interface PublicGalleryProps {
  items: GalleryItem[];
}

const CATEGORY_TAGS: { key: ConcernCategory; label: string; color: string }[] = [
  { key: 'ANATOMY', label: '인체 비례', color: 'bg-red-900/50 text-red-300 border-red-700' },
  { key: 'COLORING', label: '채색', color: 'bg-orange-900/50 text-orange-300 border-orange-700' },
  { key: 'COMPOSITION', label: '구도', color: 'bg-green-900/50 text-green-300 border-green-700' },
  { key: 'PERSPECTIVE', label: '원근법', color: 'bg-blue-900/50 text-blue-300 border-blue-700' },
  { key: 'LINE_QUALITY', label: '선질', color: 'bg-purple-900/50 text-purple-300 border-purple-700' },
  { key: 'CREATIVITY', label: '창의성', color: 'bg-pink-900/50 text-pink-300 border-pink-700' },
];

export function PublicGallery({ items }: PublicGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<ConcernCategory | null>(null);

  const filtered = activeFilter
    ? items.filter((item) => item.categories.includes(activeFilter))
    : items;

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Category Tags ─── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
            activeFilter === null
              ? 'bg-white text-gray-900 border-white'
              : 'bg-gray-800 text-gray-400 border-gray-600 hover:border-gray-400'
          }`}
        >
          전체 ({items.length})
        </button>
        {CATEGORY_TAGS.map(({ key, label, color }) => {
          const count = items.filter((i) => i.categories.includes(key)).length;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(activeFilter === key ? null : key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                activeFilter === key ? color + ' ring-1 ring-white/30' : 'bg-gray-800 text-gray-400 border-gray-600 hover:border-gray-400'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* ─── Gallery Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-600 font-mono text-sm py-12">
          해당 카테고리의 공개 처방전이 없습니다.
        </p>
      )}
    </div>
  );
}

// ─── Gallery Card (슬라이더 비교) ────────────────────────

function GalleryCard({ item }: { item: GalleryItem }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  };

  const overall = Math.round(
    (item.scores.anatomy + item.scores.coloring + item.scores.composition +
      item.scores.lineQuality + item.scores.creativity) / 5 * 10
  ) / 10;

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900/50 hover:border-gray-500 transition-colors">
      {/* Slider comparison */}
      <div
        className="relative w-full aspect-[4/3] cursor-col-resize select-none"
        onPointerDown={() => setIsDragging(true)}
        onPointerMove={handleMove}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
      >
        <img src={item.originalImageUrl} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
          <img src={item.feedbackImageUrl} alt="After" className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-gray-800 text-[10px]">⇔</span>
          </div>
        </div>
        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-mono z-10">Before</span>
        <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-mono z-10">After</span>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono text-white font-bold truncate">{item.diagnosisName}</h3>
          <span className="text-xs font-mono text-blue-400 shrink-0">{overall}점</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.categories.map((cat) => {
            const tag = CATEGORY_TAGS.find((t) => t.key === cat);
            return tag ? (
              <span key={cat} className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${tag.color}`}>
                {tag.label}
              </span>
            ) : null;
          })}
        </div>
        {item.overallComment && (
          <p className="text-xs text-gray-500 line-clamp-2">{item.overallComment}</p>
        )}
      </div>
    </div>
  );
}
