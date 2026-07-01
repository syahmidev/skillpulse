import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { formatDisplayDate, toISODate } from '@/lib/date';
import { useTheme } from '@/theme/useTheme';

type DateFieldProps = {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  error?: string;
};

function parseISODate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function DateField({ label, value, onChange, error }: DateFieldProps) {
  const [show, setShow] = useState(false);
  const theme = useTheme();

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') setShow(false);
    if (event.type === 'set' && selected) onChange(toISODate(selected));
  };

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-muted">{label}</Text>
      <Pressable
        onPress={() => setShow((s) => !s)}
        className={`flex-row items-center justify-between rounded-xl border bg-card px-3.5 py-3 ${
          error ? 'border-danger' : 'border-border'
        }`}>
        <Text className="text-base text-foreground">{formatDisplayDate(value)}</Text>
        <Ionicons name="calendar-outline" size={18} color={theme.muted} />
      </Pressable>
      {show ? (
        <DateTimePicker
          value={parseISODate(value)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      ) : null}
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
