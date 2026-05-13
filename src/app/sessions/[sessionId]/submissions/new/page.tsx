'use client';

import { SelfDiagnosisForm } from '@/components/upload/SelfDiagnosisForm';
import { useRouter } from 'next/navigation';
import type { ConcernCategory, DiagnosisPin } from '@/types';

export function generateStaticParams() {
  return [{ sessionId: 'test-session' }];
}

export default function NewSubmissionPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  
  // 목업용 임시 이미지 URL
  const MOCK_ORIGINAL_IMAGE = 'https://picsum.photos/id/25/1200/800';

  const handleSubmit = (data: {
    title: string;
    description: string;
    concernCategories: ConcernCategory[];
    diagnosisPins: DiagnosisPin[];
    selfNote: string;
  }) => {
    console.log('Submitted Diagnosis Data:', data);
    alert('진단 신청이 완료되었습니다! 뷰어 페이지로 이동합니다.');
    
    // 임시로 test-sub 로 이동
    router.push(`/sessions/${params.sessionId}/submissions/test-sub`);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-2">📥 자가 진단서 작성</h1>
        <p className="text-gray-400 text-sm">
          업로드된 원본 이미지에서 피드백이 필요한 부분을 짚어주세요.
        </p>
      </div>

      <SelfDiagnosisForm
        originalImageUrl={MOCK_ORIGINAL_IMAGE}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
