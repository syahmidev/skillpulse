import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { createMilestone } from '@/db/queries/milestones';
import { milestoneSchema } from '@/lib/validations';

export function AddMilestone({ skillId }: { skillId: string }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);

  const add = async () => {
    const result = milestoneSchema.safeParse({ skillId, title: title.trim() });
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return;
    }
    setSaving(true);
    await createMilestone(result.data);
    setSaving(false);
    setTitle('');
    setError(undefined);
  };

  return (
    <View className="gap-2">
      <TextField
        placeholder="Add a milestone…"
        value={title}
        onChangeText={(t) => {
          setTitle(t);
          if (error) setError(undefined);
        }}
        error={error}
      />
      <Button label="Add milestone" variant="secondary" onPress={add} loading={saving} />
    </View>
  );
}
