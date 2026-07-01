/**
 * Central error-reporting seam. Today it logs in development; it's the single
 * place to wire a crash reporter (e.g. Sentry.captureException) once a DSN is
 * configured, without touching every call site.
 */
export function reportError(error: unknown, context?: string): void {
  if (__DEV__) {
    console.error(`[SkillPulse]${context ? ` ${context}` : ''}`, error);
  }
  // TODO(sentry): Sentry.captureException(error, { tags: { context } });
}
