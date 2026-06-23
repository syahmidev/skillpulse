import { Stack, useRouter } from 'expo-router';

import { createSkill } from '@/db/queries/skills';
import { SkillForm } from '@/features/skills/SkillForm';

export default function CreateSkillScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'New Skill' }} />
      <SkillForm
        submitLabel="Create skill"
        onSubmit={async (values) => {
          await createSkill(values);
          router.back();
        }}
      />
    </>
  );
}
