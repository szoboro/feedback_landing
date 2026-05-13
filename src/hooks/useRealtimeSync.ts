'use client';

import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import type { RealtimeEvent, RealtimeEventType } from '@/types';

// ═══════════════════════════════════════════════════════════
// useRealtimeSync — Pusher 기반 실시간 이벤트 수신 훅
// ═══════════════════════════════════════════════════════════

interface UseRealtimeSyncOptions {
  /** Pusher 채널 (보통 session ID) */
  channelName: string;
  /** 수신할 이벤트 타입들 */
  eventTypes: RealtimeEventType[];
  /** 이벤트 수신 콜백 */
  onEvent: (event: RealtimeEvent) => void;
  /** 활성화 여부 */
  enabled?: boolean;
}

interface UseRealtimeSyncReturn {
  isConnected: boolean;
  connectionError: string | null;
}

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY ?? '';
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'ap3';

export function useRealtimeSync(
  options: UseRealtimeSyncOptions
): UseRealtimeSyncReturn {
  const { channelName, eventTypes, onEvent, enabled = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled || !PUSHER_KEY) return;

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
    });
    pusherRef.current = pusher;

    pusher.connection.bind('connected', () => {
      setIsConnected(true);
      setConnectionError(null);
    });
    pusher.connection.bind('error', (err: unknown) => {
      setIsConnected(false);
      setConnectionError(String(err));
    });

    const channel = pusher.subscribe(channelName);

    for (const eventType of eventTypes) {
      channel.bind(eventType, (data: RealtimeEvent) => {
        onEventRef.current(data);
      });
    }

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      pusherRef.current = null;
      setIsConnected(false);
    };
  }, [channelName, enabled, eventTypes]);

  return { isConnected, connectionError };
}
