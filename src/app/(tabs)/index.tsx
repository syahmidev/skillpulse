import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerClassName="gap-5 p-5">
      <View className="gap-1">
        <Text className="text-2xl font-bold text-slate-900">Welcome back 👋</Text>
        <Text className="text-sm text-slate-500">
          Track what you learn and keep your streak alive.
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/skills/create')}
        className="flex-row items-center gap-3 rounded-2xl bg-brand p-4 active:bg-brand-dark">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <Ionicons name="add" size={22} color="#ffffff" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-white">Add a skill</Text>
          <Text className="text-xs text-indigo-100">Start tracking something new</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ffffff" />
      </Pressable>

      <View className="rounded-2xl border border-slate-100 bg-white p-5">
        <Text className="text-sm text-slate-500">
          Your dashboard stats and streak will appear here once insights are built.
        </Text>
      </View>
    </ScrollView>
  );
}
