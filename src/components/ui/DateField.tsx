import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { formatDisplayDate, toISODate } from '@/lib/date';

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

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') setShow(false);
    if (event.type === 'set' && selected) onChange(toISODate(selected));
  };

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>
      <Pressable
        onPress={() => setShow((s) => !s)}
        className={`flex-row items-center justify-between rounded-xl border bg-white px-3.5 py-3 ${
          error ? 'border-rose-400' : 'border-slate-200'
        }`}>
        <Text className="text-base text-slate-900">{formatDisplayDate(value)}</Text>
        <Ionicons name="calendar-outline" size={18} color="#64748b" />
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
      {error ? <Text className="text-xs text-rose-600">{error}</Text> : null}
    </View>
  );
}
