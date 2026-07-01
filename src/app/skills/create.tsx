import { Stack, useRouter } from 'expo-router';

import { useToast } from '@/components/ui/Toast';
import { createSkill } from '@/db/queries/skills';
import { SkillForm } from '@/features/skills/SkillForm';

export default function CreateSkillScreen() {
  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <Stack.Screen options={{ title: 'New Skill' }} />
      <SkillForm
        submitLabel="Create skill"
        onSubmit={async (values) => {
          await createSkill(values);
          toast('Skill created', 'success');
          router.back();
        }}
      />
    </>
  );
}
