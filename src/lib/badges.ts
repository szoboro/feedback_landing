export type BadgeTier = 'NEWBIE' | 'MEMBER' | 'MENTOR' | 'PRO' | 'MASTER';

export interface BadgeInfo {
  tier: BadgeTier;
  label: string;
  style: string;
}

export function calculateBadge(points: number): BadgeInfo {
  if (points >= 20000) {
    return {
      tier: 'MASTER',
      label: '👑 마스터',
      style: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    };
  }
  if (points >= 5000) {
    return {
      tier: 'PRO',
      label: '🏆 고수',
      style: 'bg-amber-900/60 text-amber-300 border-amber-600',
    };
  }
  if (points >= 1000) {
    return {
      tier: 'MENTOR',
      label: '🎓 멘토',
      style: 'bg-purple-900/60 text-purple-300 border-purple-600',
    };
  }
  if (points >= 100) {
    return {
      tier: 'MEMBER',
      label: '✨ 멤버',
      style: 'bg-blue-900/60 text-blue-300 border-blue-600',
    };
  }
  
  return {
    tier: 'NEWBIE',
    label: '🌱 뉴비',
    style: 'bg-gray-800 text-gray-400 border-gray-700',
  };
}
