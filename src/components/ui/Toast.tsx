import { Ionicons } from '@expo/vector-icons';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';
type ToastState = { message: string; type: ToastType } | null;

const STYLES: Record<ToastType, { bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: 'bg-emerald-600', icon: 'checkmark-circle' },
  error: { bg: 'bg-rose-600', icon: 'alert-circle' },
  info: { bg: 'bg-slate-800', icon: 'information-circle' },
};

type ShowToast = (message: string, type?: ToastType) => void;

const ToastContext = createContext<ShowToast>(() => {});

export const useToast = (): ShowToast => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const show = useCallback<ShowToast>(
    (message, type = 'info') => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, type });
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, 2600);
    },
    [opacity]
  );

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={{ opacity, position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 16 }}>
          <View
            className={`flex-row items-center gap-2 rounded-xl px-4 py-3 ${STYLES[toast.type].bg}`}>
            <Ionicons name={STYLES[toast.type].icon} size={18} color="#ffffff" />
            <Text className="flex-1 text-sm font-medium text-white">{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}
