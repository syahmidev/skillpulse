import { randomUUID } from 'expo-crypto';

/** Generate a TEXT primary key for a new record. */
export const newId = (): string => randomUUID();
