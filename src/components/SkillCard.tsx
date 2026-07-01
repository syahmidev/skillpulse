import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import {
  CATEGORY_LABELS,
  CATEGORY_TONES,
  LEVEL_LABELS,
  STATUS_LABELS,
  STATUS_TONES,
} from '@/constants/options';
import type { Skill } from '@/db/schema';
import { useTheme } from '@/theme/useTheme';

type SkillCardProps = {
  skill: Skill;
  onPress: () => void;
};

export function SkillCard({ skill, onPress }: SkillCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-border bg-card p-4 active:bg-surface-muted">
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 text-base font-semibold text-foreground">{skill.name}</Text>
        <Badge label={STATUS_LABELS[skill.status]} tone={STATUS_TONES[skill.status]} />
      </View>

      {skill.goal ? (
        <Text numberOfLines={1} className="mt-1 text-sm text-muted">
          {skill.goal}
        </Text>
      ) : null}

      <View className="mt-3 flex-row items-center gap-3">
        <Badge label={CATEGORY_LABELS[skill.category]} tone={CATEGORY_TONES[skill.category]} />
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-muted">{LEVEL_LABELS[skill.currentLevel]}</Text>
          <Ionicons name="arrow-forward" size={12} color={theme.muted} />
          <Text className="text-xs font-medium text-foreground">
            {LEVEL_LABELS[skill.targetLevel]}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
