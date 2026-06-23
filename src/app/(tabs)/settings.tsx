import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { ScrollView, Text, View } from 'react-native';

export default function SettingsScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerClassName="gap-5 p-5">
      <View className="rounded-2xl border border-slate-100 bg-white">
        <View className="flex-row items-center gap-3 p-4">
          <Ionicons name="information-circle-outline" size={22} color="#6366f1" />
          <View className="flex-1">
            <Text className="text-base font-medium text-slate-900">About</Text>
            <Text className="text-sm text-slate-500">
              SkillPulse — offline-first learning tracker
            </Text>
          </View>
        </View>
        <View className="h-px bg-slate-100" />
        <View className="flex-row items-center gap-3 p-4">
          <Ionicons name="pricetag-outline" size={22} color="#6366f1" />
          <View className="flex-1">
            <Text className="text-base font-medium text-slate-900">Version</Text>
            <Text className="text-sm text-slate-500">{version}</Text>
          </View>
        </View>
      </View>

      <Text className="text-center text-xs text-slate-400">
        More settings (theme, export, reset) coming in a later phase.
      </Text>
    </ScrollView>
  );
}
