import { Text, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  action?: React.ReactNode;
};

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-semibold text-slate-900">{title}</Text>
      {action}
    </View>
  );
}
