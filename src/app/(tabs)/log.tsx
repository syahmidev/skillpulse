import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { LearningLogCard } from '@/components/LearningLogCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { deleteLog } from '@/db/queries/logs';
import { useLogsLive } from '@/features/logs/useLogs';
import { useSkillsLive } from '@/features/skills/useSkills';
import { formatHours } from '@/lib/format';

export default function LogScreen() {
  const router = useRouter();
  const { data: logs } = useLogsLive();
  const { data: skills } = useSkillsLive();
  const [skillFilter, setSkillFilter] = useState<string>('all');

  const totalMinutes = useMemo(
    () => logs.reduce((sum, l) => sum + l.durationMinutes, 0),
    [logs]
  );
  const visible = skillFilter === 'all' ? logs : logs.filter((l) => l.skillId === skillFilter);

  const confirmDelete = (id: string, title: string) => {
    Alert.alert('Delete log', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteLog(id) },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <View className="mx-5 mt-5 rounded-2xl bg-brand p-5">
        <Text className="text-xs font-medium text-indigo-100">Total learning time</Text>
        <Text className="text-3xl font-bold text-white">{formatHours(totalMinutes)}</Text>
        <Text className="text-xs text-indigo-100">
          {logs.length} log{logs.length === 1 ? '' : 's'}
        </Text>
      </View>

      {skills.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="grow-0"
          contentContainerClassName="gap-2 px-5 py-3">
          {[{ id: 'all', name: 'All' }, ...skills].map((s) => {
            const selected = s.id === skillFilter;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSkillFilter(s.id)}
                className={`rounded-full border px-3.5 py-2 ${
                  selected ? 'border-brand bg-brand' : 'border-border bg-card'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    selected ? 'text-white' : 'text-muted'
                  }`}>
                  {s.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View className="h-3" />
      )}

      {visible.length === 0 ? (
        logs.length === 0 ? (
          <EmptyState
            icon="create-outline"
            title="No logs yet"
            message="Add today's learning progress to start tracking your hours."
            actionLabel="Add log"
            onAction={() => router.push('/log/create')}
          />
        ) : (
          <EmptyState
            icon="filter-outline"
            title="Nothing here"
            message="No logs for this skill yet."
          />
        )
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 px-5 pb-28"
          renderItem={({ item }) => (
            <LearningLogCard
              title={item.title}
              skillName={item.skillName}
              durationMinutes={item.durationMinutes}
              difficulty={item.difficulty}
              mood={item.mood}
              logDate={item.logDate}
              notes={item.notes}
              onDelete={() => confirmDelete(item.id, item.title)}
            />
          )}
        />
      )}

      <Pressable
        onPress={() => router.push('/log/create')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg active:bg-brand-dark">
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}
