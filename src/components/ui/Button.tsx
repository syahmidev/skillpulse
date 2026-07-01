import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
};

const CONTAINER: Record<ButtonVariant, string> = {
  primary: 'bg-brand active:bg-brand-dark',
  secondary: 'bg-surface-muted active:bg-border',
  danger: 'border border-danger bg-transparent active:bg-surface-muted',
  ghost: 'bg-transparent active:bg-surface-muted',
};

const LABEL: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-foreground',
  danger: 'text-danger',
  ghost: 'text-muted',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-12 flex-row items-center justify-center rounded-xl px-4 ${CONTAINER[variant]} ${
        isDisabled ? 'opacity-50' : ''
      }`}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#ffffff' : '#6366f1'} />
      ) : (
        <Text className={`text-base font-semibold ${LABEL[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
