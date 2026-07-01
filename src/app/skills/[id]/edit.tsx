import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { updateSkill } from '@/db/queries/skills';
import { SkillForm } from '@/features/skills/SkillForm';
import { useSkillLive } from '@/features/skills/useSkills';
import { useTheme } from '@/theme/useTheme';

export default function EditSkillScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { data } = useSkillLive(id);
  const skill = data[0];

  if (!skill) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={theme.brand} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit Skill' }} />
      <SkillForm
        submitLabel="Save changes"
        defaultValues={{
          name: skill.name,
          category: skill.category,
          currentLevel: skill.currentLevel,
          targetLevel: skill.targetLevel,
          status: skill.status,
          goal: skill.goal ?? '',
        }}
        onSubmit={async (values) => {
          await updateSkill(skill.id, values);
          router.back();
        }}
      />
    </>
  );
}
