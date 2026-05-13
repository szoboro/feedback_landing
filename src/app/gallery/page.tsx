'use client';

import { PublicGallery } from '@/components/gallery/PublicGallery';

/**
 * 공개 처방전 갤러리
 * /gallery — 그림 교정 데이터베이스
 */
export default function GalleryPage() {
  // TODO: API에서 공개 처방전 로드
  const mockItems = [
    {
      id: '1',
      title: '인물화 교정',
      originalImageUrl: 'https://picsum.photos/id/64/800/600',
      feedbackImageUrl: 'https://picsum.photos/id/65/800/600',
      categories: ['ANATOMY' as const, 'LINE_QUALITY' as const],
      scores: { anatomy: 4, coloring: 7, composition: 6, lineQuality: 3, creativity: 8 },
      diagnosisName: '인체 비율 개선',
      overallComment: '팔 비율과 어깨선을 살짝 조절했어요. 크로키 연습을 추천합니다!',
    },
    {
      id: '2',
      title: '풍경화 색감 교정',
      originalImageUrl: 'https://picsum.photos/id/28/800/600',
      feedbackImageUrl: 'https://picsum.photos/id/29/800/600',
      categories: ['COLORING' as const, 'COMPOSITION' as const],
      scores: { anatomy: 8, coloring: 3, composition: 5, lineQuality: 7, creativity: 6 },
      diagnosisName: '풍부한 색감 만들기',
      overallComment: '빛과 그림자의 온도 차이를 활용하면 깊이감이 살아납니다. 너무 잘 하셨어요!',
    },
    {
      id: '3',
      title: '캐릭터 디자인 리뷰',
      originalImageUrl: 'https://picsum.photos/id/96/800/600',
      feedbackImageUrl: 'https://picsum.photos/id/119/800/600',
      categories: ['CREATIVITY' as const, 'ANATOMY' as const],
      scores: { anatomy: 6, coloring: 8, composition: 7, lineQuality: 6, creativity: 4 },
      diagnosisName: '캐릭터 매력 포인트',
      overallComment: '실루엣을 좀 더 과감하게 쓰면 캐릭터의 개성이 훨씬 돋보일 거예요.',
    },
    {
      id: '4',
      title: '정물화 구도 교정',
      originalImageUrl: 'https://picsum.photos/id/30/800/600',
      feedbackImageUrl: 'https://picsum.photos/id/42/800/600',
      categories: ['COMPOSITION' as const, 'PERSPECTIVE' as const],
      scores: { anatomy: 7, coloring: 6, composition: 3, lineQuality: 7, creativity: 5 },
      diagnosisName: '시선 유도 구도',
      overallComment: '3분할 법칙을 적용하고 시선 유도 동선을 정리해봤습니다. 훨씬 안정적이죠?',
    },
    {
      id: '5',
      title: '만화 선화 교정',
      originalImageUrl: 'https://picsum.photos/id/160/800/600',
      feedbackImageUrl: 'https://picsum.photos/id/180/800/600',
      categories: ['LINE_QUALITY' as const],
      scores: { anatomy: 7, coloring: 7, composition: 8, lineQuality: 2, creativity: 7 },
      diagnosisName: '선화 디테일업',
      overallComment: '선에 강약을 주면 드로잉이 훨씬 역동적으로 보입니다. 필압 조절 연습 추천!',
    },
    {
      id: '6',
      title: '원근법 교정',
      originalImageUrl: 'https://picsum.photos/id/164/800/600',
      feedbackImageUrl: 'https://picsum.photos/id/188/800/600',
      categories: ['PERSPECTIVE' as const, 'COMPOSITION' as const],
      scores: { anatomy: 6, coloring: 7, composition: 5, lineQuality: 6, creativity: 6 },
      diagnosisName: '투시 안정화',
      overallComment: '소실점을 기준으로 형태를 다시 잡아보았습니다. 배경 그릴 때 꼭 투시선을 활용해보세요.',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <header>
          <h1 className="text-xl font-bold">👀 모두의 피드백 갤러리</h1>
          <p className="text-sm text-gray-500 mt-1">
            다른 사람들의 교정 전후를 비교해보세요. 드래그해서 원본과 피드백을 실시간으로 확인할 수 있습니다.
          </p>
        </header>

        <PublicGallery items={mockItems} />
      </div>
    </main>
  );
}
