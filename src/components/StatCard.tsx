import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export function StatCard({ icon, label, value }: StatCardProps) {
  const theme = useTheme();
  return (
    <View className="flex-1 gap-2 rounded-2xl border border-border bg-card p-4">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-muted">
        <Ionicons name={icon} size={18} color={theme.brand} />
      </View>
      <Text className="text-2xl font-bold text-foreground">{value}</Text>
      <Text className="text-xs text-muted">{label}</Text>
    </View>
  );
}
