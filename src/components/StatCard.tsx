import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View className="flex-1 gap-2 rounded-2xl border border-slate-100 bg-white p-4">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
        <Ionicons name={icon} size={18} color="#6366f1" />
      </View>
      <Text className="text-2xl font-bold text-slate-900">{value}</Text>
      <Text className="text-xs text-slate-500">{label}</Text>
    </View>
  );
}
