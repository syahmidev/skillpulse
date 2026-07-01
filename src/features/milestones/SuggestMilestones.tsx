import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { createMilestone } from '@/db/queries/milestones';
import { suggestNextMilestones } from '@/lib/ai';
import { reportError } from '@/lib/reportError';
import { useTheme } from '@/theme/useTheme';

type SuggestMilestonesProps = {
  skillId: string;
  skillName: string;
  goal?: string;
  existing: string[];
};

export function SuggestMilestones({ skillId, skillName, goal, existing }: SuggestMilestonesProps) {
  const toast = useToast();
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const result = await suggestNextMilestones({ skillName, goal, existing });
      setSuggestions(result);
      if (result.length === 0) toast('No suggestions right now.', 'info');
    } catch (e) {
      reportError(e, 'suggestNextMilestones');
      toast(e instanceof Error ? e.message : 'Failed to suggest milestones.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const add = async (title: string) => {
    await createMilestone({ skillId, title });
    setSuggestions((prev) => prev.filter((t) => t !== title));
    toast('Milestone added', 'success');
  };

  return (
    <View className="gap-2">
      <Button label="Suggest with AI" variant="ghost" onPress={run} loading={loading} />
      {suggestions.length > 0 ? (
        <View className="gap-2">
          {suggestions.map((s) => (
            <Pressable
              key={s}
              onPress={() => add(s)}
              className="flex-row items-center gap-2 rounded-xl border border-dashed border-border bg-surface-muted px-3 py-2.5 active:opacity-70">
              <Ionicons name="add-circle-outline" size={18} color={theme.brand} />
              <Text className="flex-1 text-sm text-foreground">{s}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
