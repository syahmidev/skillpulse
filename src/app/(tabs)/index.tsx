import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { StatCard } from '@/components/StatCard';
import { Button } from '@/components/ui/Button';
import { useInsights } from '@/features/insights/useInsights';
import { formatHours } from '@/lib/format';
import { useTheme } from '@/theme/useTheme';

export default function HomeScreen() {
  const router = useRouter();
  const stats = useInsights();
  const theme = useTheme();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-5 p-5">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-foreground">Welcome back 👋</Text>
        <Text className="text-sm text-muted">Here&apos;s your learning at a glance.</Text>
      </View>

      <View className="flex-row items-center gap-4 rounded-2xl bg-brand p-5">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <Ionicons name="flame" size={26} color="#ffffff" />
        </View>
        <View>
          <Text className="text-3xl font-bold text-white">
            {stats.currentStreak} day{stats.currentStreak === 1 ? '' : 's'}
          </Text>
          <Text className="text-xs text-indigo-100">Current streak</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <StatCard
          icon="time-outline"
          label="Total hours"
          value={formatHours(stats.totalLearningMinutes)}
        />
        <StatCard
          icon="library-outline"
          label="Active skills"
          value={String(stats.activeSkills)}
        />
      </View>
      <View className="flex-row gap-3">
        <StatCard
          icon="trophy-outline"
          label="Milestones done"
          value={String(stats.completedMilestones)}
        />
        <StatCard
          icon="calendar-outline"
          label="This week"
          value={formatHours(stats.weeklyMinutes)}
        />
      </View>

      {stats.mostPracticedSkill ? (
        <View className="rounded-2xl border border-border bg-card p-4">
          <Text className="text-xs text-muted">Most practiced skill</Text>
          <Text className="text-lg font-semibold text-foreground">
            {stats.mostPracticedSkill}
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={() => router.push('/ai-plan')}
        className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 active:bg-surface-muted">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-brand">
          <Ionicons name="sparkles" size={20} color="#ffffff" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">AI learning plan</Text>
          <Text className="text-xs text-muted">Generate milestones with Gemini</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.muted} />
      </Pressable>

      <View className="gap-3">
        <Button label="Add learning log" onPress={() => router.push('/log/create')} />
        <Button
          label="Add skill"
          variant="secondary"
          onPress={() => router.push('/skills/create')}
        />
      </View>
    </ScrollView>
  );
}
