import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';

import { Button } from '@/components/ui/Button';
import { ToastProvider } from '@/components/ui/Toast';
import { db } from '@/db/client';
import migrations from '@/db/migrations/migrations';
import { reportError } from '@/lib/reportError';
// Instantiate persisted stores early so they rehydrate on launch (theme is
// applied, the daily reminder is re-armed).
import { useReminderStore } from '@/stores/useReminderStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useScheme, useTheme } from '@/theme/useTheme';

// Expo Router renders this for any uncaught render error in the tree.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => reportError(error, 'ErrorBoundary'), [error]);
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
      <Text className="text-center text-lg font-semibold text-foreground">
        Something went wrong
      </Text>
      <Text className="text-center text-sm text-muted">{error.message}</Text>
      <View className="w-full max-w-xs">
        <Button label="Try again" onPress={retry} />
      </View>
    </View>
  );
}

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const theme = useTheme();
  const scheme = useScheme();
  useThemeStore((s) => s.preference);
  useReminderStore((s) => s.enabled);

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
      <ToastProvider>
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
      </ToastProvider>
    </SafeAreaProvider>
  );
}
