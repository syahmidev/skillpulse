import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/theme/useTheme';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  const theme = useTheme();
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-medium text-muted">{label}</Text> : null}
      <TextInput
        placeholderTextColor={theme.placeholder}
        className={`rounded-xl border bg-card px-3.5 py-3 text-base text-foreground ${
          error ? 'border-danger' : 'border-border'
        }`}
        {...inputProps}
      />
      {error ? <Text className="text-xs text-danger">{error}</Text> : null}
    </View>
  );
}
