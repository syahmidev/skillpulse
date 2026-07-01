import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SelectField } from '@/components/ui/SelectField';
import { createLog } from '@/db/queries/logs';
import { useSkillsLive } from '@/features/skills/useSkills';
import { todayISODate } from '@/lib/date';

type Status = 'idle' | 'running' | 'paused' | 'done';

const DURATIONS = [15, 25, 50];
const KEEP_AWAKE_TAG = 'skillpulse-focus';

const format = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function FocusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ skillId?: string }>();
  const { data: skills } = useSkillsLive();

  const [skillId, setSkillId] = useState<string | undefined>(params.skillId);
  const [durationMin, setDurationMin] = useState(25);
  const [status, setStatus] = useState<Status>('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [savedMinutes, setSavedMinutes] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(0);
  const baseRef = useRef(0);

  const activeSkillId = skillId ?? skills[0]?.id;
  const skillName = skills.find((s) => s.id === activeSkillId)?.name ?? 'skill';
  const totalSec = durationMin * 60;
  const remaining = Math.max(0, totalSec - elapsedSec);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    deactivateKeepAwake(KEEP_AWAKE_TAG);
  };

  useEffect(() => () => clear(), []);

  const saveLog = async (seconds: number) => {
    const minutes = Math.max(1, Math.round(seconds / 60));
    if (activeSkillId) {
      await createLog({
        skillId: activeSkillId,
        title: 'Focus session',
        durationMinutes: minutes,
        logDate: todayISODate(),
      });
    }
    setSavedMinutes(minutes);
    setStatus('done');
  };

  const tick = () => {
    const seconds = baseRef.current + (Date.now() - startRef.current) / 1000;
    setElapsedSec(seconds);
    if (seconds >= totalSec) {
      clear();
      void saveLog(totalSec);
    }
  };

  const start = () => {
    if (!activeSkillId) return;
    baseRef.current = 0;
    startRef.current = Date.now();
    setElapsedSec(0);
    setStatus('running');
    void activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    intervalRef.current = setInterval(tick, 250);
  };

  const pause = () => {
    baseRef.current += (Date.now() - startRef.current) / 1000;
    clear();
    setStatus('paused');
  };

  const resume = () => {
    startRef.current = Date.now();
    setStatus('running');
    void activateKeepAwakeAsync(KEEP_AWAKE_TAG);
    intervalRef.current = setInterval(tick, 250);
  };

  const finishEarly = () => {
    clear();
    void saveLog(elapsedSec);
  };

  const cancel = () => {
    clear();
    setElapsedSec(0);
    setStatus('idle');
  };

  const reset = () => {
    setElapsedSec(0);
    setSavedMinutes(0);
    setStatus('idle');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Focus' }} />
      {skills.length === 0 ? (
        <View className="flex-1 bg-background">
          <EmptyState
            icon="timer-outline"
            title="No skills yet"
            message="Create a skill before starting a focus session."
            actionLabel="Add skill"
            onAction={() => router.push('/skills/create')}
          />
        </View>
      ) : (
        <View className="flex-1 gap-6 bg-background p-5">
          {status === 'done' ? (
            <View className="flex-1 items-center justify-center gap-4">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-brand">
                <Ionicons name="checkmark" size={40} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold text-foreground">Session complete</Text>
              <Text className="text-center text-muted">
                Logged {savedMinutes} min to {skillName}.
              </Text>
              <View className="mt-4 w-full max-w-xs gap-3">
                <Button label="Start another" onPress={reset} />
                <Button label="Done" variant="secondary" onPress={() => router.back()} />
              </View>
            </View>
          ) : (
            <>
              {status === 'idle' ? (
                <View className="gap-5">
                  <SelectField
                    label="Skill"
                    options={skills.map((s) => ({ value: s.id, label: s.name }))}
                    value={activeSkillId}
                    onChange={setSkillId}
                  />
                  <View className="gap-1.5">
                    <Text className="text-sm font-medium text-muted">Duration</Text>
                    <View className="flex-row gap-2">
                      {DURATIONS.map((d) => {
                        const selected = d === durationMin;
                        return (
                          <Button
                            key={d}
                            label={`${d} min`}
                            variant={selected ? 'primary' : 'secondary'}
                            onPress={() => setDurationMin(d)}
                          />
                        );
                      })}
                    </View>
                  </View>
                </View>
              ) : (
                <View className="items-center gap-1">
                  <Text className="text-sm text-muted">{skillName}</Text>
                  <Text className="text-sm text-muted">{durationMin} min session</Text>
                </View>
              )}

              <View className="flex-1 items-center justify-center gap-6">
                <Text className="text-7xl font-bold tabular-nums text-foreground">
                  {format(remaining)}
                </Text>
                <View className="w-full px-4">
                  <ProgressBar progress={totalSec ? elapsedSec / totalSec : 0} />
                </View>
              </View>

              <View className="gap-3">
                {status === 'idle' ? (
                  <Button label="Start focus" onPress={start} />
                ) : null}
                {status === 'running' ? (
                  <Button label="Pause" variant="secondary" onPress={pause} />
                ) : null}
                {status === 'paused' ? (
                  <Button label="Resume" onPress={resume} />
                ) : null}
                {status === 'running' || status === 'paused' ? (
                  <>
                    <Button label="Finish & log" variant="secondary" onPress={finishEarly} />
                    <Button label="Cancel" variant="ghost" onPress={cancel} />
                  </>
                ) : null}
              </View>
            </>
          )}
        </View>
      )}
    </>
  );
}
