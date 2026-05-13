import Link from 'next/link';

// ─── Data ──────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🖼️',
    title: '그림 올리고 진단받기',
    desc: '고민되는 부위에 핀을 찍어 올리면, 커뮤니티 고수들이 비포/애프터 피드백을 달아줘요.',
    color: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
  },
  {
    icon: '🔀',
    title: '비포/애프터 비교',
    desc: '슬라이더를 밀어서 원본과 피드백을 직접 비교! 사이드바이사이드, 토글 모드도 지원해요.',
    color: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
  },
  {
    icon: '📊',
    title: '능력치 레이더 차트',
    desc: '인체·채색·구도·선질·창의성 5축으로 내 실력을 시각화. 지난번 대비 성장률도 자동 분석!',
    color: 'from-teal-500/10 to-teal-600/5 border-teal-500/20',
  },
  {
    icon: '💬',
    title: '고수들의 소견',
    desc: '한 명이 아닌 여러 멤버가 댓글로 소견을 남겨요. 고수든 초보든, 모든 의견이 도움이 돼요.',
    color: 'from-orange-500/10 to-orange-600/5 border-orange-500/20',
  },
  {
    icon: '🏥',
    title: '공개 처방전 갤러리',
    desc: '"인체 비례" 태그를 눌러보세요. 같은 고민을 가진 사람들의 교정 전후를 모아볼 수 있어요.',
    color: 'from-green-500/10 to-green-600/5 border-green-500/20',
  },
  {
    icon: '📸',
    title: '처방전 PNG 저장',
    desc: '처방전 결과를 이미지로 저장해서 친구한테 자랑하거나, 나중에 복습할 수 있어요.',
    color: 'from-pink-500/10 to-pink-600/5 border-pink-500/20',
  },
];

const WHO = [
  {
    emoji: '🎨',
    title: '그림 올리는 사람',
    desc: '실력이 고민되는 부위를 핀으로 찍어 올리세요. 커뮤니티가 답해줄 거예요.',
    examples: '카페 멤버 · 시청자 · 독학러 · 입시생',
  },
  {
    emoji: '🏆',
    title: '피드백 주는 고수',
    desc: '외부 드로잉 툴로 교정 이미지를 올리고, 댓글로 소견을 남겨주세요.',
    examples: '스트리머 · 멘토 · 카페 고수 · 프로 작가',
  },
  {
    emoji: '👀',
    title: '구경하는 사람',
    desc: '다른 사람의 비포/애프터를 슬라이더로 비교하는 것만으로도 엄청난 공부가 돼요.',
    examples: '시청자 · 입문자 · 갤러리 탐색자',
  },
];

const FLOW = [
  { step: '01', title: '그림 올리기', desc: '고민 부위에 핀 찍고, 자가 진단 메모와 함께 업로드', icon: '📤' },
  { step: '02', title: '피드백 받기', desc: '고수가 교정 이미지를 올리고 5축 점수를 매겨줘요', icon: '🎯' },
  { step: '03', title: '소견 달기', desc: '여러 멤버가 댓글로 추가 소견을 달아줘요', icon: '💬' },
  { step: '04', title: '처방전 확인', desc: '레이더 차트 + 성장 분석 + 연습 과제를 받아보세요', icon: '📋' },
];

const STACK = [
  { name: 'Next.js 14', icon: '▲', color: 'text-white' },
  { name: 'TypeScript', icon: 'TS', color: 'text-blue-400' },
  { name: 'Prisma 7', icon: '◈', color: 'text-teal-400' },
  { name: 'Recharts', icon: '📊', color: 'text-orange-400' },
  { name: 'Pusher', icon: '⚡', color: 'text-green-400' },
  { name: 'Tailwind', icon: '🎨', color: 'text-cyan-400' },
  { name: 'Zod', icon: 'Z', color: 'text-purple-400' },
  { name: 'html2canvas', icon: '📸', color: 'text-pink-400' },
];

// ─── Page ──────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">

      {/* ══ NAV ══════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏥</span>
          <span className="font-bold text-lg tracking-tight">Canvas Verdict</span>
          <span className="hidden sm:inline text-xs text-gray-500 ml-1">그림 교정소</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">기능 소개</a>
          <a href="#who" className="hover:text-white transition-colors">누가 쓰나요?</a>
          <a href="#flow" className="hover:text-white transition-colors">이용 방법</a>
          <a href="#stack" className="hover:text-white transition-colors">기술 스택</a>
        </div>
        <Link
          href="/gallery"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
        >
          갤러리 둘러보기
        </Link>
      </nav>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{animationDelay:'1.5s'}} />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-blue-500/30 text-blue-400 text-sm mb-8 animate-slide-up">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            그림 커뮤니티 피드백 플랫폼
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up delay-100">
            그림 올리면{' '}
            <span className="text-gradient-blue">처방전</span>이<br className="md:hidden" /> 나와요
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed animate-slide-up delay-200">
            고민되는 부위에 핀을 찍어 올리면,<br />
            커뮤니티 고수들이 교정 이미지와 소견을 달아줘요.<br />
            <span className="text-gray-300">스트리머, 카페 멤버, 시청자 — 누구나 환영!</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
            <Link
              href="/sessions/test-session/submissions/test-sub/report"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-lg transition-all hover:scale-105 glow-blue"
            >
              🩺 처방전 체험하기
            </Link>
            <Link
              href="/gallery"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass border border-white/10 hover:border-white/20 font-semibold text-lg transition-all hover:scale-105"
            >
              🏥 갤러리 구경하기
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 mt-16 animate-fade-in delay-500">
            {[
              { value: '누구나', label: '참여 가능' },
              { value: '5축', label: '능력치 분석' },
              { value: '댓글형', label: '고수 소견' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-gradient-blue">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs animate-float">
          <span>아래로 스크롤</span>
          <span>↓</span>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-400 text-sm uppercase tracking-widest">What we do</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">이런 걸 할 수 있어요</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${f.color} transition-all hover:scale-[1.02] hover:shadow-xl`}
              >
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHO ══════════════════════════════════════════════ */}
      <section id="who" className="py-24 px-6 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-400 text-sm uppercase tracking-widest">For everyone</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">누가 쓰나요?</h2>
            <p className="text-gray-500 text-sm mt-2">스트리머만의 도구가 아니에요. 그림 그리는 모든 분을 위한 플랫폼이에요.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHO.map((w) => (
              <div key={w.title} className="glass border border-white/8 rounded-2xl p-6 text-center hover:border-white/15 transition-all">
                <span className="text-4xl mb-3 block">{w.emoji}</span>
                <h3 className="font-bold text-lg mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{w.desc}</p>
                <p className="text-xs text-gray-600">{w.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FLOW ═════════════════════════════════════════════ */}
      <section id="flow" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-teal-400 text-sm uppercase tracking-widest">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">이용 방법</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-teal-500/50 hidden md:block" />
            <div className="flex flex-col gap-5">
              {FLOW.map((step) => (
                <div key={step.step} className="flex gap-5 items-start">
                  <div className="relative shrink-0 w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl z-10">
                    {step.icon}
                  </div>
                  <div className="flex-1 glass border border-white/8 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs text-blue-400">{step.step}</span>
                      <h3 className="font-bold">{step.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STACK ════════════════════════════════════════════ */}
      <section id="stack" className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-cyan-400 text-sm uppercase tracking-widest">Tech Stack</span>
            <h2 className="text-3xl font-bold mt-2">기술 스택</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {STACK.map((tech) => (
              <div key={tech.name} className="glass border border-white/8 rounded-xl p-3 text-center hover:border-white/20 transition-all hover:scale-105 group">
                <div className={`text-lg font-bold mb-1 ${tech.color} group-hover:scale-110 transition-transform inline-block`}>
                  {tech.icon}
                </div>
                <div className="text-[11px] text-gray-400">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-10 rounded-3xl glass border border-white/8 glow-blue overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-teal-600/10 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">직접 체험해보세요!</h2>
              <p className="text-gray-400 mb-8 text-sm">
                가입 없이 데모 페이지에서 모든 기능을 사용해볼 수 있어요
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
                <Link href="/sessions/test-session/submissions/new" className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-medium text-sm transition-all hover:scale-105">
                  📥 자가진단서
                </Link>
                <Link href="/sessions/test-session/submissions/test-sub" className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium text-sm transition-all hover:scale-105">
                  🔀 비교 뷰어
                </Link>
                <Link href="/sessions/test-session/submissions/test-sub/report" className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-medium text-sm transition-all hover:scale-105">
                  🩺 처방전 리포트
                </Link>
                <Link href="/gallery" className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 font-medium text-sm transition-all hover:scale-105">
                  🏥 공개 갤러리
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-10 px-6 text-center text-gray-600 text-sm">
        <p>🏥 Canvas Verdict — 그림 교정소</p>
        <p className="mt-1 text-xs">스트리머 · 카페 멤버 · 시청자 · 독학러, 그림 그리는 모든 분을 위한 커뮤니티 피드백 플랫폼</p>
      </footer>
    </div>
  );
}
