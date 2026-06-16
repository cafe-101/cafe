'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';

type ConnectionState = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

interface Order {
  id: string;
  status: string;
  items: string;
  created_at: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeOrders() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('CONNECTING');
  const [orders, setOrders] = useState<Order[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as Order, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === (payload.new as Order).id ? (payload.new as Order) : order
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((order) => order.id !== (payload.old as Order).id));
          }
        }
      )
      .subscribe((status) => {
        switch (status) {
          case 'SUBSCRIBED':
            setConnectionState('CONNECTED');
            break;
          case 'CHANNEL_ERROR':
          case 'TIMED_OUT':
          case 'CLOSED':
            setConnectionState('DISCONNECTED');
            break;
          default:
            setConnectionState('CONNECTING');
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { connectionState, orders };
}
