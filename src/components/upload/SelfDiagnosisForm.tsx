'use client';

import { useState, useRef } from 'react';
import type { ConcernCategory, DiagnosisPin } from '@/types';

// ═══════════════════════════════════════════════════════════
// SelfDiagnosisForm — 자가 진단서 (핀 찍기 + 메모 작성) 폼
// ═══════════════════════════════════════════════════════════

interface SelfDiagnosisFormProps {
  originalImageUrl: string;
  onSubmit: (data: {
    title: string;
    description: string;
    concernCategories: ConcernCategory[];
    diagnosisPins: DiagnosisPin[];
    selfNote: string;
  }) => void;
}

const CATEGORY_LABELS: Record<ConcernCategory, string> = {
  ANATOMY: '인체',
  COLORING: '채색',
  COMPOSITION: '구도',
  PERSPECTIVE: '원근법',
  LINE_QUALITY: '선질',
  CREATIVITY: '창의성',
  OTHER: '기타',
};

const CATEGORY_COLORS: Record<ConcernCategory, string> = {
  ANATOMY: '#FF4444',
  COLORING: '#FF8C00',
  COMPOSITION: '#22C55E',
  PERSPECTIVE: '#3B82F6',
  LINE_QUALITY: '#8B5CF6',
  CREATIVITY: '#EC4899',
  OTHER: '#9CA3AF',
};

export function SelfDiagnosisForm({ originalImageUrl, onSubmit }: SelfDiagnosisFormProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  
  // 다중 이미지 상태
  const [images, setImages] = useState<string[]>([originalImageUrl]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selfNote, setSelfNote] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ConcernCategory[]>([]);
  
  const [pins, setPins] = useState<DiagnosisPin[]>([]);
  const [activePinDraft, setActivePinDraft] = useState<{ x: number, y: number } | null>(null);
  const [draftLabel, setDraftLabel] = useState('');
  const [draftCategory, setDraftCategory] = useState<ConcernCategory>('ANATOMY');

  // 이미지 위를 클릭하여 새로운 핀 초안 생성
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    
    // 이미지를 벗어난 클릭 방지
    if (
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top || e.clientY > rect.bottom
    ) return;

    // 자연 크기 기준 절대 좌표 매핑
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    setActivePinDraft({ x, y });
    setDraftLabel('');
  };

  // 핀 저장
  const savePin = () => {
    if (!activePinDraft || !draftLabel.trim()) return;
    setPins([
      ...pins,
      {
        id: `pin-${Date.now()}`,
        imageIndex: currentIndex,
        x: activePinDraft.x,
        y: activePinDraft.y,
        label: draftLabel,
        category: draftCategory,
      }
    ]);
    setActivePinDraft(null);
  };

  // 임시 다중 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...newImages]);
  };

  // 핀 취소
  const cancelPin = () => setActivePinDraft(null);

  // 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      concernCategories: selectedCategories,
      diagnosisPins: pins,
      selfNote,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
      
      {/* ─── 왼쪽: 캔버스 (이미지 + 핀 찍기) ─── */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        
        {/* 다중 이미지 썸네일 바 */}
        <div className="border border-gray-700 bg-gray-900/50 rounded-xl p-3 flex gap-3 overflow-x-auto items-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setActivePinDraft(null);
              }}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === currentIndex ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`img-${i}`} className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-0 left-0 bg-blue-600 text-[9px] px-1 font-bold text-white">MAIN</span>}
            </button>
          ))}
          <label className="shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-gray-600 hover:border-gray-400 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-gray-300 transition-colors bg-gray-800">
            <span className="text-xl">+</span>
            <span className="text-[10px]">추가</span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="border border-gray-700 bg-gray-900/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">🖼️ 고민 부위 핀 찍기 ({currentIndex + 1}/{images.length})</h2>
            <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">
              이미지를 클릭하면 핀을 추가할 수 있습니다.
            </span>
          </div>

          <div 
            className="relative w-full rounded-lg overflow-hidden bg-gray-950 cursor-crosshair border border-gray-800"
            onClick={handleImageClick}
          >
            <img
              ref={imageRef}
              src={images[currentIndex]}
              alt="Artwork"
              className="w-full h-auto object-contain block pointer-events-none select-none max-h-[60vh]"
            />

            {/* 현재 이미지에 해당하는 핀들 렌더링 */}
            {pins.filter(p => p.imageIndex === currentIndex).map((pin, i) => {
              if (!imageRef.current) return null;
              const leftPct = (pin.x / imageRef.current.naturalWidth) * 100;
              const topPct = (pin.y / imageRef.current.naturalHeight) * 100;
              
              return (
                <div
                  key={pin.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                >
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
                    style={{ backgroundColor: CATEGORY_COLORS[pin.category] }}
                  >
                    {i + 1}
                  </div>
                </div>
              );
            })}

            {/* 초안 핀 입력 UI */}
            {activePinDraft && imageRef.current && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
                style={{
                  left: `${(activePinDraft.x / imageRef.current.naturalWidth) * 100}%`,
                  top: `${(activePinDraft.y / imageRef.current.naturalHeight) * 100}%`,
                }}
                onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
              >
                <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-lg animate-ping absolute" />
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg absolute" />
                
                <div className="absolute left-6 -top-6 w-56 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl">
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value as ConcernCategory)}
                    className="w-full bg-gray-900 text-sm text-white rounded p-1 mb-2 border border-gray-700"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    autoFocus
                    placeholder="어떤 점이 고민인가요?"
                    value={draftLabel}
                    onChange={(e) => setDraftLabel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && savePin()}
                    className="w-full bg-gray-900 text-sm text-white rounded p-1.5 mb-2 border border-gray-700 focus:border-blue-500 outline-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={savePin} disabled={!draftLabel.trim()} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs py-1 rounded">저장</button>
                    <button onClick={cancelPin} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 rounded">취소</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 핀 리스트 뷰 */}
        {pins.length > 0 && (
          <div className="border border-gray-700 bg-gray-900/50 rounded-xl p-4 flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {pins.map((pin, i) => (
              <div key={pin.id} className="flex items-center gap-2 bg-gray-800 rounded px-2 py-1 text-sm border border-gray-700">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: CATEGORY_COLORS[pin.category] }}>
                  {i + 1}
                </span>
                <span className="text-gray-400 text-xs">
                  {CATEGORY_LABELS[pin.category]} {pin.imageIndex !== undefined && pin.imageIndex > 0 ? `(img ${pin.imageIndex + 1})` : ''}
                </span>
                <span className="text-white max-w-[150px] truncate">{pin.label}</span>
                <button 
                  onClick={() => setPins(pins.filter(p => p.id !== pin.id))}
                  className="text-gray-500 hover:text-red-400 ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 오른쪽: 자가 진단서 폼 ─── */}
      <div className="lg:col-span-2">
        <div className="border border-gray-700 bg-gray-900/50 rounded-xl p-5 sticky top-24">
          <h2 className="font-bold text-xl text-white mb-6">📝 자가 진단서 작성</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">작품 제목</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 빛을 받는 소녀 일러스트"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">작품 설명 (선택)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="어떤 의도로 그렸는지, 참고한 자료가 있다면 적어주세요."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">가장 피드백 받고 싶은 항목 (다중 선택)</label>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(CATEGORY_LABELS) as [ConcernCategory, string][]).map(([key, label]) => {
                  const isSelected = selectedCategories.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedCategories(prev => 
                        isSelected ? prev.filter(k => k !== key) : [...prev, key]
                      )}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">자가 진단 메모</label>
              <textarea
                value={selfNote}
                onChange={e => setSelfNote(e.target.value)}
                placeholder="본인이 생각할 때 가장 아쉬운 점이나 고치고 싶은 점을 자유롭게 적어주세요."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors h-28 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-800 mt-2">
              <button
                type="submit"
                disabled={!title || pins.length === 0}
                className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold transition-colors"
              >
                진단 신청하기
              </button>
              {pins.length === 0 && (
                <p className="text-center text-xs text-red-400 mt-2">
                  최소 1개 이상의 고민 부위(핀)를 이미지에 찍어주세요.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
