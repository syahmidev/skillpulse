import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  cancelReminders,
  ensureNotificationPermissions,
  scheduleDailyReminder,
} from '@/lib/notifications';

type ReminderState = {
  enabled: boolean;
  hour: number;
  minute: number;
  setEnabled: (enabled: boolean) => Promise<void>;
  setTime: (hour: number, minute: number) => Promise<void>;
};

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      enabled: false,
      hour: 19,
      minute: 0,
      setEnabled: async (enabled) => {
        if (enabled) {
          const granted = await ensureNotificationPermissions();
          if (!granted) {
            set({ enabled: false });
            return;
          }
          await scheduleDailyReminder(get().hour, get().minute);
          set({ enabled: true });
        } else {
          await cancelReminders();
          set({ enabled: false });
        }
      },
      setTime: async (hour, minute) => {
        set({ hour, minute });
        if (get().enabled) await scheduleDailyReminder(hour, minute);
      },
    }),
    {
      name: 'skillpulse-reminder',
      storage: createJSONStorage(() => AsyncStorage),
      // Re-arm the daily reminder on launch so it survives reinstalls/reboots.
      onRehydrateStorage: () => (state) => {
        if (state?.enabled) void scheduleDailyReminder(state.hour, state.minute);
      },
    }
  )
);
