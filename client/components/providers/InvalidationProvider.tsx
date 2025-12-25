import { authClient } from '@/lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { router, usePathname } from 'expo-router';
import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { io, Socket } from 'socket.io-client';

const InvalidationContext = createContext<{ isConnected: boolean }>({
  isConnected: false,
});

export function InvalidationProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: currentUserData } = authClient.useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const isUnmountingRef = useRef(false);
  const queryClientRef = useRef(queryClient);
  const userIdRef = useRef(currentUserData?.user?.id);

  // Keep refs updated without triggering reconnects
  useEffect(() => {
    queryClientRef.current = queryClient;
    userIdRef.current = currentUserData?.user?.id;
  });

  useEffect(() => {
    if (!currentUserData?.user?.id) {
      return;
    }

    // Mark as not unmounting when setting up new connection
    isUnmountingRef.current = false;

    console.log('Attempting socket connection to:', `${process.env.EXPO_PUBLIC_SERVER_URL}/invalidation`);

    const socket = io(`${process.env.EXPO_PUBLIC_SERVER_URL}/invalidation`, {
      transports: ['websocket'],
      auth: {
        userId: currentUserData.user.id,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected successfully');
      if (!isUnmountingRef.current) {
        setIsConnected(true);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (!isUnmountingRef.current) {
        setIsConnected(false);
      }
    });

    socket.on('connect_error', (error) => {
      console.log('Socket connect_error:', error.message);
      if (!isUnmountingRef.current) {
        setIsConnected(false);
      }
    });

    socket.on('data-invalidated', (queryKey: string[]) => {
      console.log('User Id', currentUserData.user.id, 'Query Key', queryKey);
      if (!isUnmountingRef.current && queryClientRef.current) {
        queryClientRef.current.invalidateQueries({
          queryKey,
        });
      }
    });

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' && socket?.connected) {
        socket.disconnect();
      } else if (nextAppState === 'active' && !socket?.connected && !isUnmountingRef.current) {
        socket.connect();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      isUnmountingRef.current = true;
      subscription?.remove();

      if (socketRef.current) {
        // Remove all listeners first to prevent events during cleanup
        socketRef.current.removeAllListeners();

        if (socketRef.current.connected) {
          socketRef.current.disconnect();
        }

        socketRef.current.close();
        socketRef.current = null;
      }

      setIsConnected(false);
    };
  }, [currentUserData?.user.id]);

  return (
    <InvalidationContext.Provider value={{ isConnected }}>{children}</InvalidationContext.Provider>
  );
}
