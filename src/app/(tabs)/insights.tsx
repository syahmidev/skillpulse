import { View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';

export default function InsightsScreen() {
  return (
    <View className="flex-1 bg-slate-50">
      <EmptyState
        icon="stats-chart-outline"
        title="Insights coming soon"
        message="Streaks, totals, and your weekly chart arrive in Phase 5."
      />
    </View>
  );
}
