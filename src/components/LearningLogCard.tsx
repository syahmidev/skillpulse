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
  return (
    <View className="rounded-2xl border border-slate-100 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-semibold text-slate-900">{title}</Text>
          {skillName ? <Text className="text-xs text-slate-500">{skillName}</Text> : null}
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color="#64748b" />
            <Text className="text-sm font-medium text-slate-700">
              {formatDuration(durationMinutes)}
            </Text>
          </View>
          {onDelete ? (
            <Pressable onPress={onDelete} hitSlop={8} className="active:opacity-60">
              <Ionicons name="trash-outline" size={18} color="#f43f5e" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {notes ? (
        <Text numberOfLines={2} className="mt-2 text-sm text-slate-600">
          {notes}
        </Text>
      ) : null}

      <View className="mt-3 flex-row flex-wrap items-center gap-2">
        <Text className="text-xs text-slate-400">{formatDisplayDate(logDate)}</Text>
        {difficulty ? (
          <Badge label={DIFFICULTY_LABELS[difficulty]} tone={DIFFICULTY_TONES[difficulty]} />
        ) : null}
        {mood ? <Badge label={MOOD_LABELS[mood]} tone={MOOD_TONES[mood]} /> : null}
      </View>
    </View>
  );
}
