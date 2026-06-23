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

type SkillCardProps = {
  skill: Skill;
  onPress: () => void;
};

export function SkillCard({ skill, onPress }: SkillCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-slate-100 bg-white p-4 active:bg-slate-50">
      <View className="flex-row items-start justify-between gap-3">
        <Text className="flex-1 text-base font-semibold text-slate-900">{skill.name}</Text>
        <Badge label={STATUS_LABELS[skill.status]} tone={STATUS_TONES[skill.status]} />
      </View>

      {skill.goal ? (
        <Text numberOfLines={1} className="mt-1 text-sm text-slate-500">
          {skill.goal}
        </Text>
      ) : null}

      <View className="mt-3 flex-row items-center gap-3">
        <Badge label={CATEGORY_LABELS[skill.category]} tone={CATEGORY_TONES[skill.category]} />
        <View className="flex-row items-center gap-1">
          <Text className="text-xs text-slate-500">{LEVEL_LABELS[skill.currentLevel]}</Text>
          <Ionicons name="arrow-forward" size={12} color="#94a3b8" />
          <Text className="text-xs font-medium text-slate-700">
            {LEVEL_LABELS[skill.targetLevel]}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
