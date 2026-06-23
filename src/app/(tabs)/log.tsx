import { View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';

export default function LogScreen() {
  return (
    <View className="flex-1 bg-slate-50">
      <EmptyState
        icon="create-outline"
        title="Learning logs coming soon"
        message="Daily learning logs arrive in Phase 3."
      />
    </View>
  );
}
