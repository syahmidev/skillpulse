import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, Text, View } from 'react-native';

import { LearningLogCard } from '@/components/LearningLogCard';
import { MilestoneItem } from '@/components/MilestoneItem';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  CATEGORY_LABELS,
  CATEGORY_TONES,
  LEVEL_LABELS,
  STATUS_LABELS,
  STATUS_TONES,
} from '@/constants/options';
import { deleteLog } from '@/db/queries/logs';
import { deleteMilestone, setMilestoneCompleted } from '@/db/queries/milestones';
import { deleteSkill } from '@/db/queries/skills';
import { AddMilestone } from '@/features/milestones/AddMilestone';
import { SuggestMilestones } from '@/features/milestones/SuggestMilestones';
import { useMilestonesBySkillLive } from '@/features/milestones/useMilestones';
import { useLogsBySkillLive } from '@/features/logs/useLogs';
import { useSkillLive } from '@/features/skills/useSkills';
import { formatHours } from '@/lib/format';
import { useTheme } from '@/theme/useTheme';

export default function SkillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { data } = useSkillLive(id);
  const { data: logs } = useLogsBySkillLive(id);
  const { data: milestones } = useMilestonesBySkillLive(id);
  const skill = data[0];

  const totalMinutes = logs.reduce((sum, l) => sum + l.durationMinutes, 0);
  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const progress = milestones.length ? completedCount / milestones.length : 0;

  const confirmDeleteLog = (logId: string, title: string) => {
    Alert.alert('Delete log', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteLog(logId) },
    ]);
  };

  if (!skill) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted">Skill not found.</Text>
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
      <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-5 p-5">
        <View className="gap-3 rounded-2xl border border-border bg-card p-5">
          <Text className="text-xl font-bold text-foreground">{skill.name}</Text>

          <View className="flex-row flex-wrap gap-2">
            <Badge label={CATEGORY_LABELS[skill.category]} tone={CATEGORY_TONES[skill.category]} />
            <Badge label={STATUS_LABELS[skill.status]} tone={STATUS_TONES[skill.status]} />
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-muted">Level</Text>
            <Text className="text-sm font-medium text-foreground">
              {LEVEL_LABELS[skill.currentLevel]}
            </Text>
            <Ionicons name="arrow-forward" size={14} color={theme.muted} />
            <Text className="text-sm font-medium text-foreground">
              {LEVEL_LABELS[skill.targetLevel]}
            </Text>
          </View>

          {skill.goal ? (
            <View className="gap-1">
              <Text className="text-sm text-muted">Goal</Text>
              <Text className="text-sm text-foreground">{skill.goal}</Text>
            </View>
          ) : null}
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-border bg-card p-4">
            <Text className="text-2xl font-bold text-foreground">{formatHours(totalMinutes)}</Text>
            <Text className="text-xs text-muted">Total time</Text>
          </View>
          <View className="flex-1 rounded-2xl border border-border bg-card p-4">
            <Text className="text-2xl font-bold text-foreground">{logs.length}</Text>
            <Text className="text-xs text-muted">
              Log{logs.length === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        <Button
          label="Start focus session"
          onPress={() =>
            router.push({ pathname: '/focus', params: { skillId: skill.id } })
          }
        />

        <View className="gap-3 rounded-2xl border border-border bg-card p-5">
          <SectionHeader title="Milestones" />
          {milestones.length > 0 ? (
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-muted">
                  {completedCount}/{milestones.length} completed
                </Text>
                <Text className="text-xs font-semibold text-brand">
                  {Math.round(progress * 100)}%
                </Text>
              </View>
              <ProgressBar progress={progress} />
            </View>
          ) : null}

          {milestones.length === 0 ? (
            <Text className="text-sm text-muted">
              No milestones yet — break your goal into small steps.
            </Text>
          ) : (
            <View className="gap-2">
              {milestones.map((m) => (
                <MilestoneItem
                  key={m.id}
                  title={m.title}
                  isCompleted={m.isCompleted}
                  onToggle={() => setMilestoneCompleted(m.id, !m.isCompleted)}
                  onDelete={() => deleteMilestone(m.id)}
                />
              ))}
            </View>
          )}

          <AddMilestone skillId={skill.id} />
          <SuggestMilestones
            skillId={skill.id}
            skillName={skill.name}
            goal={skill.goal ?? undefined}
            existing={milestones.map((m) => m.title)}
          />
        </View>

        <View className="gap-3">
          <SectionHeader
            title="Recent logs"
            action={
              <Button
                label="Add log"
                variant="ghost"
                onPress={() =>
                  router.push({ pathname: '/log/create', params: { skillId: skill.id } })
                }
              />
            }
          />
          {logs.length === 0 ? (
            <View className="rounded-2xl border border-border bg-card p-5">
              <Text className="text-sm text-muted">
                No logs yet — add your first learning session for this skill.
              </Text>
            </View>
          ) : (
            logs.map((log) => (
              <LearningLogCard
                key={log.id}
                title={log.title}
                durationMinutes={log.durationMinutes}
                difficulty={log.difficulty}
                mood={log.mood}
                logDate={log.logDate}
                notes={log.notes}
                onDelete={() => confirmDeleteLog(log.id, log.title)}
              />
            ))
          )}
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
