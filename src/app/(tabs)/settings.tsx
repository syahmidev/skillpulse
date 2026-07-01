import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useThemeStore, type ThemePreference } from '@/stores/useThemeStore';
import { useTheme } from '@/theme/useTheme';

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-5 p-5">
      <View className="gap-2">
        <Text className="px-1 text-sm font-medium text-muted">Appearance</Text>
        <View className="flex-row gap-1 rounded-2xl border border-border bg-card p-1">
          {THEME_OPTIONS.map((opt) => {
            const active = preference === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setPreference(opt.value)}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-xl py-2.5 ${
                  active ? 'bg-brand' : ''
                }`}>
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={active ? '#ffffff' : theme.muted}
                />
                <Text
                  className={`text-sm font-medium ${active ? 'text-white' : 'text-muted'}`}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={() => router.push('/ai-plan')}
        className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4 active:bg-surface-muted">
        <Ionicons name="sparkles-outline" size={22} color={theme.brand} />
        <View className="flex-1">
          <Text className="text-base font-medium text-foreground">AI Learning Plan</Text>
          <Text className="text-sm text-muted">Generate milestones with Gemini</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.muted} />
      </Pressable>

      <View className="rounded-2xl border border-border bg-card">
        <View className="flex-row items-center gap-3 p-4">
          <Ionicons name="information-circle-outline" size={22} color={theme.brand} />
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">About</Text>
            <Text className="text-sm text-muted">
              SkillPulse — offline-first learning tracker
            </Text>
          </View>
        </View>
        <View className="h-px bg-border" />
        <View className="flex-row items-center gap-3 p-4">
          <Ionicons name="pricetag-outline" size={22} color={theme.brand} />
          <View className="flex-1">
            <Text className="text-base font-medium text-foreground">Version</Text>
            <Text className="text-sm text-muted">{version}</Text>
          </View>
        </View>
      </View>

      <Text className="text-center text-xs text-muted">
        Data export and reset are coming in a later phase.
      </Text>
    </ScrollView>
  );
}
