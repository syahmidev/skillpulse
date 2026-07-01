import { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

import type { HeatCell, HeatLevel } from '@/features/insights/compute';
import { useTheme } from '@/theme/useTheme';

const CELL = 14;
const GAP = 3;
const ALPHA: Record<HeatLevel, number> = { 0: 0, 1: 0.28, 2: 0.5, 3: 0.72, 4: 1 };

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function Heatmap({ data }: { data: HeatCell[][] }) {
  const theme = useTheme();
  const rgb = hexToRgb(theme.brand);
  const scrollRef = useRef<ScrollView>(null);

  const colorFor = (level: HeatLevel) =>
    level === 0 ? theme.surfaceMuted : `rgba(${rgb}, ${ALPHA[level]})`;

  return (
    <View className="gap-2">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
        <View className="flex-row" style={{ gap: GAP }}>
          {data.map((week, wi) => (
            <View key={wi} style={{ gap: GAP }}>
              {week.map((cell) => (
                <View
                  key={cell.date}
                  style={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 3,
                    backgroundColor: colorFor(cell.level),
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-end">
        <Text className="mr-1.5 text-xs text-muted">Less</Text>
        <View className="flex-row" style={{ gap: GAP }}>
          {[0, 1, 2, 3, 4].map((l) => (
            <View
              key={l}
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: colorFor(l as HeatLevel),
              }}
            />
          ))}
        </View>
        <Text className="ml-1.5 text-xs text-muted">More</Text>
      </View>
    </View>
  );
}
