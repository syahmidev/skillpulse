import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type MilestoneItemProps = {
  title: string;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export function MilestoneItem({ title, isCompleted, onToggle, onDelete }: MilestoneItemProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-3">
      <Pressable onPress={onToggle} hitSlop={8} className="active:opacity-60">
        <Ionicons
          name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isCompleted ? '#10b981' : '#cbd5e1'}
        />
      </Pressable>
      <Text
        className={`flex-1 text-sm ${
          isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
        }`}>
        {title}
      </Text>
      <Pressable onPress={onDelete} hitSlop={8} className="active:opacity-60">
        <Ionicons name="trash-outline" size={18} color="#f43f5e" />
      </Pressable>
    </View>
  );
}
