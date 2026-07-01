import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_TONES,
  MOOD_LABELS,
  MOOD_TONES,
  type LearningMood,
  type LogDifficulty,
} from '@/constants/options';
import { formatDisplayDate } from '@/lib/date';
import { formatDuration } from '@/lib/format';
import { useTheme } from '@/theme/useTheme';

type LearningLogCardProps = {
  title: string;
  durationMinutes: number;
  logDate: string;
  skillName?: string;
  difficulty?: LogDifficulty | null;
  mood?: LearningMood | null;
  notes?: string | null;
  onDelete?: () => void;
};

export function LearningLogCard({
  title,
  durationMinutes,
  logDate,
  skillName,
  difficulty,
  mood,
  notes,
  onDelete,
}: LearningLogCardProps) {
  const theme = useTheme();
  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-semibold text-foreground">{title}</Text>
          {skillName ? <Text className="text-xs text-muted">{skillName}</Text> : null}
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color={theme.muted} />
            <Text className="text-sm font-medium text-foreground">
              {formatDuration(durationMinutes)}
            </Text>
          </View>
          {onDelete ? (
            <Pressable onPress={onDelete} hitSlop={8} className="active:opacity-60">
              <Ionicons name="trash-outline" size={18} color={theme.danger} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {notes ? (
        <Text numberOfLines={2} className="mt-2 text-sm text-muted">
          {notes}
        </Text>
      ) : null}

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <Text className="text-xs text-muted">{formatDisplayDate(logDate)}</Text>
        {difficulty ? (
          <Badge label={DIFFICULTY_LABELS[difficulty]} tone={DIFFICULTY_TONES[difficulty]} />
        ) : null}
        {mood ? <Badge label={MOOD_LABELS[mood]} tone={MOOD_TONES[mood]} /> : null}
      </View>
    </View>
  );
}
