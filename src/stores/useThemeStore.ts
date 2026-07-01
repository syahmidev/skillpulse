import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeState = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

// Persisted theme preference. The choice is applied to NativeWind's runtime
// color scheme on change and re-applied on launch (onRehydrateStorage).
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => {
        colorScheme.set(preference);
        set({ preference });
      },
    }),
    {
      name: 'skillpulse-theme',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) colorScheme.set(state.preference);
      },
    }
  )
);
