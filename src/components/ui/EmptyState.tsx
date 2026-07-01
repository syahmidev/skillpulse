import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { Button } from './Button';

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon = 'sparkles-outline',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
        <Ionicons name={icon} size={28} color={theme.brand} />
      </View>
      <Text className="text-center text-lg font-semibold text-foreground">{title}</Text>
      <Text className="text-center text-sm text-muted">{message}</Text>
      {actionLabel && onAction ? (
        <View className="mt-2 w-full max-w-xs">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
