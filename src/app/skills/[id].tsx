import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CATEGORY_LABELS,
  CATEGORY_TONES,
  LEVEL_LABELS,
  STATUS_LABELS,
  STATUS_TONES,
} from '@/constants/options';
import { deleteSkill } from '@/db/queries/skills';
import { useSkillLive } from '@/features/skills/useSkills';

export default function SkillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useSkillLive(id);
  const skill = data[0];

  if (!skill) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500">Skill not found.</Text>
      </View>
    );
  }

  const confirmDelete = () => {
    Alert.alert(
      'Delete skill',
      `Delete "${skill.name}"? This also removes its logs and milestones.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteSkill(skill.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: skill.name }} />
      <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-5 p-5">
        <View className="gap-3 rounded-2xl border border-slate-100 bg-white p-5">
          <Text className="text-xl font-bold text-slate-900">{skill.name}</Text>

          <View className="flex-row flex-wrap gap-2">
            <Badge label={CATEGORY_LABELS[skill.category]} tone={CATEGORY_TONES[skill.category]} />
            <Badge label={STATUS_LABELS[skill.status]} tone={STATUS_TONES[skill.status]} />
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-slate-500">Level</Text>
            <Text className="text-sm font-medium text-slate-700">
              {LEVEL_LABELS[skill.currentLevel]}
            </Text>
            <Ionicons name="arrow-forward" size={14} color="#94a3b8" />
            <Text className="text-sm font-medium text-slate-700">
              {LEVEL_LABELS[skill.targetLevel]}
            </Text>
          </View>

          {skill.goal ? (
            <View className="gap-1">
              <Text className="text-sm text-slate-500">Goal</Text>
              <Text className="text-sm text-slate-800">{skill.goal}</Text>
            </View>
          ) : null}
        </View>

        <View className="rounded-2xl border border-slate-100 bg-white p-5">
          <Text className="text-sm text-slate-500">
            Learning logs and milestones for this skill will appear here in the next phases.
          </Text>
        </View>

        <View className="gap-3">
          <Button
            label="Edit skill"
            variant="secondary"
            onPress={() => router.push(`/skills/${skill.id}/edit`)}
          />
          <Button label="Delete skill" variant="danger" onPress={confirmDelete} />
        </View>
      </ScrollView>
    </>
  );
}
