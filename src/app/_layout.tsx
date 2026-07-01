import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';

import { db } from '@/db/client';
import migrations from '@/db/migrations/migrations';
// Instantiate the theme store early so the persisted preference rehydrates on launch.
import { useThemeStore } from '@/stores/useThemeStore';
import { useScheme, useTheme } from '@/theme/useTheme';

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const theme = useTheme();
  const scheme = useScheme();
  useThemeStore((s) => s.preference);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-center text-danger">
          Database migration failed: {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={theme.brand} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.foreground, fontWeight: '700' },
          headerTintColor: theme.brand,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: theme.background },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
