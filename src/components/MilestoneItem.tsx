import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

type MilestoneItemProps = {
  title: string;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export function MilestoneItem({ title, isCompleted, onToggle, onDelete }: MilestoneItemProps) {
  const theme = useTheme();
  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card px-3 py-3">
      <Pressable onPress={onToggle} hitSlop={8} className="active:opacity-60">
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isCompleted ? theme.success : theme.placeholder}
        />
      </Pressable>
      <Text
        className={`flex-1 text-sm ${
          isCompleted ? 'text-muted line-through' : 'text-foreground'
        }`}>
        {title}
      </Text>
      <Pressable onPress={onDelete} hitSlop={8} className="active:opacity-60">
        <Ionicons name="trash-outline" size={18} color={theme.danger} />
      </Pressable>
    </View>
  );
}
