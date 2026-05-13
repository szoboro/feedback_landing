/**
 * Session 상세 페이지 (Submission 목록 포함)
 * TODO: 세션 정보 표시 + 제출물 그리드
 */
export function generateStaticParams() {
  return [{ sessionId: 'test-session' }];
}

export default function SessionDetailPage({
  params,
}: {
  params: { sessionId: string };
}) {
  return (
    <main>
      <h1>세션 상세</h1>
      <p>Session ID: {params.sessionId}</p>
    </main>
  );
}
