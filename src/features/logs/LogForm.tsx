import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';

import { Button } from '@/components/ui/Button';
import { DateField } from '@/components/ui/DateField';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import {
  DIFFICULTY_LABELS,
  LEARNING_MOODS,
  LOG_DIFFICULTIES,
  MOOD_LABELS,
} from '@/constants/options';
import type { Skill } from '@/db/schema';
import { todayISODate } from '@/lib/date';
import { learningLogSchema, type LearningLogFormValues } from '@/lib/validations';

const difficultyOptions = LOG_DIFFICULTIES.map((value) => ({
  value,
  label: DIFFICULTY_LABELS[value],
}));
const moodOptions = LEARNING_MOODS.map((value) => ({ value, label: MOOD_LABELS[value] }));

type LogFormProps = {
  skills: Pick<Skill, 'id' | 'name'>[];
  defaultSkillId?: string;
  submitLabel: string;
  onSubmit: (values: LearningLogFormValues) => Promise<void> | void;
};

export function LogForm({ skills, defaultSkillId, submitLabel, onSubmit }: LogFormProps) {
  const skillOptions = skills.map((s) => ({ value: s.id, label: s.name }));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LearningLogFormValues>({
    resolver: zodResolver(learningLogSchema),
    defaultValues: {
      skillId: defaultSkillId ?? skills[0]?.id ?? '',
      title: '',
      notes: '',
      durationMinutes: 0,
      difficulty: undefined,
      mood: undefined,
      logDate: todayISODate(),
    },
  });

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="gap-5 p-5 pb-10"
      keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="skillId"
        render={({ field }) => (
          <SelectField
            label="Skill"
            options={skillOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.skillId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <TextField
            label="Title"
            placeholder="e.g. Learned Expo Router"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="durationMinutes"
        render={({ field }) => (
          <TextField
            label="Duration (minutes)"
            placeholder="e.g. 60"
            keyboardType="number-pad"
            value={field.value ? String(field.value) : ''}
            onChangeText={(text) => field.onChange(Number(text.replace(/[^0-9]/g, '')) || 0)}
            onBlur={field.onBlur}
            error={errors.durationMinutes?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="logDate"
        render={({ field }) => (
          <DateField
            label="Date"
            value={field.value}
            onChange={field.onChange}
            error={errors.logDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="difficulty"
        render={({ field }) => (
          <SelectField
            label="Difficulty (optional)"
            options={difficultyOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.difficulty?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="mood"
        render={({ field }) => (
          <SelectField
            label="Mood (optional)"
            options={moodOptions}
            value={field.value}
            onChange={field.onChange}
            error={errors.mood?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field }) => (
          <TextField
            label="Notes (optional)"
            placeholder="What did you learn?"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            multiline
            error={errors.notes?.message}
          />
        )}
      />

      <Button label={submitLabel} onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
    </ScrollView>
  );
}
