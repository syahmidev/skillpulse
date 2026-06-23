import { ScrollView, Text, View } from 'react-native';

import { StatCard } from '@/components/StatCard';
import { WeeklyChart } from '@/components/WeeklyChart';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CATEGORY_LABELS } from '@/constants/options';
import { useInsights } from '@/features/insights/useInsights';
import { formatHours } from '@/lib/format';

export default function InsightsScreen() {
  const stats = useInsights();

  if (stats.logCount === 0) {
    return (
      <View className="flex-1 bg-slate-50">
        <EmptyState
          icon="stats-chart-outline"
          title="No insights yet"
          message="Start logging your learning sessions to see your stats."
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-5 p-5">
      <View className="gap-3 rounded-2xl border border-slate-100 bg-white p-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-slate-900">This week</Text>
          <Text className="text-sm font-semibold text-brand">
            {formatHours(stats.weeklyMinutes)}
          </Text>
        </View>
        <WeeklyChart data={stats.weekly} />
      </View>

      <View className="flex-row gap-3">
        <StatCard
          icon="time-outline"
          label="Total hours"
          value={formatHours(stats.totalLearningMinutes)}
        />
        <StatCard
          icon="document-text-outline"
          label="Logs"
          value={String(stats.logCount)}
        />
      </View>
      <View className="flex-row gap-3">
        <StatCard
          icon="trophy-outline"
          label="Milestones"
          value={`${stats.completedMilestones}/${stats.totalMilestones}`}
        />
        <StatCard icon="flame-outline" label="Streak" value={`${stats.currentStreak}d`} />
      </View>

      {stats.mostPracticedSkill ? (
        <View className="rounded-2xl border border-slate-100 bg-white p-4">
          <Text className="text-xs text-slate-500">Most practiced skill</Text>
          <Text className="text-lg font-semibold text-slate-900">
            {stats.mostPracticedSkill}
          </Text>
        </View>
      ) : null}

      {stats.categoryBreakdown.length > 0 ? (
        <View className="gap-3 rounded-2xl border border-slate-100 bg-white p-5">
          <SectionHeader title="Skills by category" />
          <View className="gap-2">
            {stats.categoryBreakdown.map((c) => (
              <View key={c.category} className="flex-row items-center justify-between">
                <Text className="text-sm text-slate-600">{CATEGORY_LABELS[c.category]}</Text>
                <Text className="text-sm font-semibold text-slate-900">{c.count}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
