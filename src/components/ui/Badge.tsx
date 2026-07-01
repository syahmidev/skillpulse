import { Text, View } from 'react-native';

import type { BadgeTone } from '@/constants/options';

const TONE_CLASSES: Record<BadgeTone, { bg: string; text: string }> = {
  slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-950',
    text: 'text-indigo-700 dark:text-indigo-300',
  },
  green: {
    bg: 'bg-emerald-100 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: { bg: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-950', text: 'text-rose-700 dark:text-rose-300' },
  sky: { bg: 'bg-sky-100 dark:bg-sky-950', text: 'text-sky-700 dark:text-sky-300' },
};

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = 'slate' }: BadgeProps) {
  const classes = TONE_CLASSES[tone];
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${classes.bg}`}>
      <Text className={`text-xs font-semibold ${classes.text}`}>{label}</Text>
    </View>
  );
}
