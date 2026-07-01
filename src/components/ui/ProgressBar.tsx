import { View } from 'react-native';

type ProgressBarProps = {
  /** 0..1 */
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
      <View className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
    </View>
  );
}
