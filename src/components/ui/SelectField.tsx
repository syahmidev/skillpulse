import { Pressable, Text, View } from 'react-native';

export type SelectOption<T extends string> = { value: T; label: string };

type SelectFieldProps<T extends string> = {
  label: string;
  options: readonly SelectOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string;
};

export function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps<T>) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              className={`rounded-full border px-3.5 py-2 ${
                selected ? 'border-brand bg-brand' : 'border-slate-200 bg-white'
              }`}>
              <Text
                className={`text-sm font-medium ${
                  selected ? 'text-white' : 'text-slate-600'
                }`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text className="text-xs text-rose-600">{error}</Text> : null}
    </View>
  );
}
