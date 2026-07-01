import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, Switch, Text, View } from 'react-native';

import { useReminderStore } from '@/stores/useReminderStore';
import { useTheme } from '@/theme/useTheme';

function formatTime(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function ReminderSettings() {
  const theme = useTheme();
  const enabled = useReminderStore((s) => s.enabled);
  const hour = useReminderStore((s) => s.hour);
  const minute = useReminderStore((s) => s.minute);
  const setEnabled = useReminderStore((s) => s.setEnabled);
  const setTime = useReminderStore((s) => s.setTime);
  const [showPicker, setShowPicker] = useState(false);

  const pickerValue = () => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  return (
    <View className="gap-2">
      <Text className="px-1 text-sm font-medium text-muted">Daily reminder</Text>
      <View className="rounded-2xl border border-border bg-card">
        <View className="flex-row items-center gap-3 p-4">
          <Ionicons name="notifications-outline" size={22} color={theme.brand} />
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">Remind me to learn</Text>
            <Text className="text-sm text-muted">A daily nudge to keep your streak.</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={(v) => void setEnabled(v)}
            trackColor={{ true: theme.brand }}
          />
        </View>

        {enabled ? (
          <>
            <View className="h-px bg-border" />
            <Pressable
              onPress={() => setShowPicker((s) => !s)}
              className="flex-row items-center justify-between p-4 active:opacity-70">
              <Text className="text-base text-foreground">Time</Text>
              <Text className="text-base font-medium text-brand">
                {formatTime(hour, minute)}
              </Text>
            </Pressable>
            {showPicker ? (
              <DateTimePicker
                value={pickerValue()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  if (Platform.OS !== 'ios') setShowPicker(false);
                  if (event.type === 'set' && date) {
                    void setTime(date.getHours(), date.getMinutes());
                  }
                }}
              />
            ) : null}
          </>
        ) : null}
      </View>
    </View>
  );
}
