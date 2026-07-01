import { Text, View } from 'react-native';

import type { DailyMinutes } from '@/features/insights/compute';

const BAR_AREA = 120;

export function WeeklyChart({ data }: { data: DailyMinutes[] }) {
  const max = Math.max(...data.map((d) => d.minutes), 1);

  return (
    <View className="gap-2">
      <View className="flex-row items-end justify-between" style={{ height: BAR_AREA }}>
        {data.map((d, i) => {
          const height = d.minutes > 0 ? Math.max(6, (d.minutes / max) * BAR_AREA) : 4;
          return (
            <View key={i} className="flex-1 items-center justify-end">
              <View
                style={{ height }}
                className={`w-6 rounded-t-md ${d.minutes > 0 ? 'bg-brand' : 'bg-surface-muted'}`}
              />
            </View>
          );
        })}
      </View>
      <View className="flex-row justify-between">
        {data.map((d, i) => (
          <Text key={i} className="flex-1 text-center text-xs text-muted">
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
