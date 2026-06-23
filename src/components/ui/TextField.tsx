import { Text, TextInput, View, type TextInputProps } from 'react-native';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-medium text-slate-700">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`rounded-xl border bg-white px-3.5 py-3 text-base text-slate-900 ${
          error ? 'border-rose-400' : 'border-slate-200'
        }`}
        {...inputProps}
      />
      {error ? <Text className="text-xs text-rose-600">{error}</Text> : null}
    </View>
  );
}
