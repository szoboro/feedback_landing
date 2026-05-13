'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════
// useComparisonViewer — 동기화 Zoom/Pan + 모드 전환 훅
// ═══════════════════════════════════════════════════════════

import type { ComparisonMode } from '@/types';

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UseComparisonViewerReturn {
  mode: ComparisonMode;
  setMode: (m: ComparisonMode) => void;
  transform: Transform;
  sliderPosition: number;
  setSliderPosition: (pos: number) => void;
  isToggleActive: boolean;
  // 이벤트 핸들러
  handleWheel: (e: React.WheelEvent) => void;
  handlePanStart: (e: React.PointerEvent) => void;
  handlePanMove: (e: React.PointerEvent) => void;
  handlePanEnd: () => void;
  resetTransform: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_SENSITIVITY = 0.002;

export function useComparisonViewer(): UseComparisonViewerReturn {
  const [mode, setMode] = useState<ComparisonMode>('slider');
  const [transform, setTransform] = useState<Transform>({
    scale: 1, translateX: 0, translateY: 0,
  });
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isToggleActive, setIsToggleActive] = useState(false);
  const isPanningRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  // ─── Zoom (마우스 휠) ─────────────────────────────────

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setTransform((prev) => {
      const delta = -e.deltaY * ZOOM_SENSITIVITY;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale + delta));
      return { ...prev, scale: newScale };
    });
  }, []);

  // ─── Pan (드래그) ──────────────────────────────────────

  const handlePanStart = useCallback((e: React.PointerEvent) => {
    if (e.button !== 1 && !e.altKey) return; // 중간 버튼 또는 Alt+드래그
    isPanningRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePanMove = useCallback((e: React.PointerEvent) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    setTransform((prev) => ({
      ...prev,
      translateX: prev.translateX + dx,
      translateY: prev.translateY + dy,
    }));
  }, []);

  const handlePanEnd = useCallback(() => {
    isPanningRef.current = false;
  }, []);

  const resetTransform = useCallback(() => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  // ─── Toggle Mode (Space key) ──────────────────────────

  useEffect(() => {
    if (mode !== 'toggle') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setIsToggleActive(true); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); setIsToggleActive(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      setIsToggleActive(false);
    };
  }, [mode]);

  return {
    mode, setMode, transform,
    sliderPosition, setSliderPosition,
    isToggleActive,
    handleWheel, handlePanStart, handlePanMove, handlePanEnd,
    resetTransform,
  };
}
