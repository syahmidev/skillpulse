import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';

import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  SKILL_STATUSES,
  STATUS_LABELS,
} from '@/constants/options';
import { skillSchema, type SkillFormValues } from '@/lib/validations';

const categoryOptions = SKILL_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));
const levelOptions = SKILL_LEVELS.map((value) => ({ value, label: LEVEL_LABELS[value] }));
const statusOptions = SKILL_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }));

type SkillFormProps = {
  defaultValues?: Partial<SkillFormValues>;
  submitLabel: string;
  onSubmit: (values: SkillFormValues) => Promise<void> | void;
};

export function SkillForm({ defaultValues, submitLabel, onSubmit }: SkillFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'frontend',
      currentLevel: 'beginner',
      targetLevel: 'intermediate',
      status: 'active',
      goal: '',
      ...defaultValues,
    },
  });

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="gap-5 p-5 pb-10"
      keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            label="Skill name"
            placeholder="e.g. React Native"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="category"
        render={({ field }) => (
          <SelectField
            label="Category"
            options={categoryOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.category?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="currentLevel"
        render={({ field }) => (
          <SelectField
            label="Current level"
            options={levelOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.currentLevel?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="targetLevel"
        render={({ field }) => (
          <SelectField
            label="Target level"
            options={levelOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.targetLevel?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <SelectField
            label="Status"
            options={statusOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.status?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="goal"
        render={({ field }) => (
          <TextField
            label="Goal (optional)"
            placeholder="e.g. Build and publish one mobile app"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            multiline
            error={errors.goal?.message}
          />
        )}
      />

      <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
    </ScrollView>
  );
}
