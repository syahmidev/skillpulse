import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { createMilestones } from '@/db/queries/milestones';
import { useSkillsLive } from '@/features/skills/useSkills';
import { generateLearningPlan } from '@/lib/ai';

export default function AiPlanScreen() {
  const router = useRouter();
  const { data: skills } = useSkillsLive();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [steps, setSteps] = useState<string[] | null>(null);
  const [skillId, setSkillId] = useState<string>();
  const [saving, setSaving] = useState(false);

  const skillOptions = skills.map((s) => ({ value: s.id, label: s.name }));

  const generate = async () => {
    if (prompt.trim().length < 3) {
      setError('Describe what you want to learn.');
      return;
    }
    setError(undefined);
    setSteps(null);
    setLoading(true);
    try {
      const result = await generateLearningPlan(prompt.trim());
      if (result.length === 0) {
        setError('The AI returned an empty plan. Try rephrasing your goal.');
      } else {
        setSteps(result);
        setSkillId((current) => current ?? skills[0]?.id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!steps || !skillId) return;
    setSaving(true);
    await createMilestones(skillId, steps);
    setSaving(false);
    const skillName = skills.find((s) => s.id === skillId)?.name ?? 'skill';
    Alert.alert('Saved', `${steps.length} milestones added to ${skillName}.`, [
      { text: 'OK', onPress: () => router.replace(`/skills/${skillId}`) },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'AI Learning Plan' }} />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-5 p-5 pb-10">
        <View className="flex-row items-center gap-3 rounded-2xl bg-brand p-4">
          <Ionicons name="sparkles" size={22} color="#ffffff" />
          <Text className="flex-1 text-sm text-indigo-50">
            Describe a goal and Gemini drafts a milestone plan you can save to a skill.
          </Text>
        </View>

        <TextField
          label="What do you want to learn?"
          placeholder="e.g. Learn React Native in 30 days"
          value={prompt}
          onChangeText={(t) => {
            setPrompt(t);
            if (error) setError(undefined);
          }}
          multiline
        />

        <Button label="Generate plan" onPress={generate} loading={loading} />

        {error ? (
          <View className="rounded-xl border border-danger bg-card p-3">
            <Text className="text-sm text-danger">{error}</Text>
          </View>
        ) : null}

        {steps ? (
          <View className="gap-4">
            <View className="gap-2 rounded-2xl border border-border bg-card p-5">
              <Text className="text-base font-semibold text-foreground">Suggested milestones</Text>
              {steps.map((step, i) => (
                <View key={i} className="flex-row gap-2">
                  <Text className="text-sm font-semibold text-brand">{i + 1}.</Text>
                  <Text className="flex-1 text-sm text-foreground">{step}</Text>
                </View>
              ))}
            </View>

            {skills.length === 0 ? (
              <View className="rounded-2xl border border-border bg-card p-4">
                <Text className="text-sm text-muted">
                  Create a skill first to save these as milestones.
                </Text>
              </View>
            ) : (
              <>
                <SelectField
                  label="Save to skill"
                  options={skillOptions}
                  value={skillId}
                  onChange={setSkillId}
                />
                <Button
                  label={`Save ${steps.length} milestones`}
                  onPress={save}
                  loading={saving}
                  disabled={!skillId}
                />
              </>
            )}
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}
