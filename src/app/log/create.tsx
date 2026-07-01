import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { createLog } from '@/db/queries/logs';
import { LogForm } from '@/features/logs/LogForm';
import { useSkillsLive } from '@/features/skills/useSkills';

export default function CreateLogScreen() {
  const router = useRouter();
  const toast = useToast();
  const { skillId } = useLocalSearchParams<{ skillId?: string }>();
  const { data: skills } = useSkillsLive();

  return (
    <>
      <Stack.Screen options={{ title: 'New Log' }} />
      {skills.length === 0 ? (
        <View className="flex-1 bg-background">
          <EmptyState
            icon="library-outline"
            title="No skills yet"
            message="Create a skill before logging learning time."
            actionLabel="Add skill"
            onAction={() => router.push('/skills/create')}
          />
        </View>
      ) : (
        <LogForm
          skills={skills}
          defaultSkillId={skillId}
          submitLabel="Save log"
          onSubmit={async (values) => {
            await createLog(values);
            toast('Log saved', 'success');
            router.back();
          }}
        />
      )}
    </>
  );
}
