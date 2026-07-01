import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { SkillCard } from '@/components/SkillCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { CATEGORY_LABELS, SKILL_CATEGORIES, type SkillCategory } from '@/constants/options';
import { useSkillsLive } from '@/features/skills/useSkills';
import { useAppStore } from '@/stores/useAppStore';

type Filter = SkillCategory | 'all';
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...SKILL_CATEGORIES.map((value) => ({ value, label: CATEGORY_LABELS[value] })),
];

export default function SkillsScreen() {
  const router = useRouter();
  const { data: skills } = useSkillsLive();
  const filter = useAppStore((s) => s.skillCategoryFilter);
  const setFilter = useAppStore((s) => s.setSkillCategoryFilter);

  const visible = filter === 'all' ? skills : skills.filter((s) => s.category === filter);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="grow-0"
        contentContainerClassName="gap-2 px-5 py-3">
        {FILTERS.map((f) => {
          const selected = f.value === filter;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`rounded-full border px-3.5 py-2 ${
                selected ? 'border-brand bg-brand' : 'border-border bg-card'
              }`}>
              <Text
                className={`text-sm font-medium ${selected ? 'text-white' : 'text-muted'}`}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {visible.length === 0 ? (
        skills.length === 0 ? (
          <EmptyState
            icon="library-outline"
            title="No skills yet"
            message="Create your first skill to start tracking your learning."
            actionLabel="Add skill"
            onAction={() => router.push('/skills/create')}
          />
        ) : (
          <EmptyState
            icon="filter-outline"
            title="Nothing here"
            message="No skills in this category. Try a different filter."
          />
        )
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 px-5 pb-28"
          renderItem={({ item }) => (
            <SkillCard skill={item} onPress={() => router.push(`/skills/${item.id}`)} />
          )}
        />
      )}

      <Pressable
        onPress={() => router.push('/skills/create')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-brand shadow-lg active:bg-brand-dark">
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}
