import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { generateWeeklySummary, type WeeklySummaryStats } from '@/lib/ai';
import { reportError } from '@/lib/reportError';
import { useTheme } from '@/theme/useTheme';

export function CoachCard({ stats }: { stats: WeeklySummaryStats }) {
  const toast = useToast();
  const theme = useTheme();
  const [summary, setSummary] = useState<string>();
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      setSummary(await generateWeeklySummary(stats));
    } catch (e) {
      reportError(e, 'generateWeeklySummary');
      toast(e instanceof Error ? e.message : 'Failed to generate summary.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="gap-3 rounded-2xl border border-border bg-card p-5">
      <View className="flex-row items-center gap-2">
        <Ionicons name="sparkles" size={18} color={theme.brand} />
        <Text className="text-base font-semibold text-foreground">AI coach</Text>
      </View>
      <Text className="text-sm leading-5 text-muted">
        {summary ?? 'Get an AI summary of your week and what to focus on next.'}
      </Text>
      <Button
        label={summary ? 'Refresh summary' : 'Summarize my week'}
        variant="secondary"
        onPress={run}
        loading={loading}
      />
    </View>
  );
}
