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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined in the environment variables.');
}
if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in the environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useRealtimeOrders(storeId: string) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('CONNECTING');
  const [orders, setOrders] = useState<Order[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching initial orders:', error);
      } else if (data && isMounted) {
        setOrders(data as Order[]);
      }
    };

    fetchInitialOrders();

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `store_id=eq.${storeId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new as Order, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) => {
              const updatedOrder = payload.new as Order;
              const exists = prev.some((order) => order.id === updatedOrder.id);
              if (exists) {
                return prev.map((order) =>
                  order.id === updatedOrder.id ? updatedOrder : order
                );
              } else {
                return [updatedOrder, ...prev];
              }
            });
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
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [storeId]);

  return { connectionState, orders };
}
