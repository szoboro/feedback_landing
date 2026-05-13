'use client';

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, Legend, ResponsiveContainer, Tooltip,
} from 'recharts';
import { toRadarData } from '@/lib/growth';
import type { PrescriptionScores } from '@/types';

// ═══════════════════════════════════════════════════════════
// ScoreRadarChart — 5축 레이더 차트
// ═══════════════════════════════════════════════════════════

interface ScoreRadarChartProps {
  current: PrescriptionScores;
  previous?: PrescriptionScores | null;
  size?: number;
}

export function ScoreRadarChart({ current, previous, size = 320 }: ScoreRadarChartProps) {
  const data = toRadarData(current, previous);

  return (
    <div className="flex justify-center">
      <ResponsiveContainer width={size} height={size}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'monospace' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickCount={6}
          />
          {previous && (
            <Radar
              name="이전"
              dataKey="previous"
              stroke="#6B7280"
              fill="#6B7280"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
          )}
          <Radar
            name="현재"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'monospace', fontSize: '12px', color: '#9CA3AF' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
