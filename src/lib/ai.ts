// Gemini "Interactions API" client for generating a learning plan as a list
// of milestone titles. The key is read from EXPO_PUBLIC_GEMINI_API_KEY, which
// is bundled into the client — fine for a local portfolio demo, not production.

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const MODEL = 'gemini-3.5-flash';
const MAX_STEPS = 12;

export class MissingApiKeyError extends Error {
  constructor() {
    super(
      'Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to your .env file and restart the dev server.'
    );
    this.name = 'MissingApiKeyError';
  }
}

export async function generateLearningPlan(userPrompt: string): Promise<string[]> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new MissingApiKeyError();

  const input = [
    'You are a learning coach. Create a concise, ordered learning plan for the goal below.',
    'Return 6 to 12 short, actionable milestone titles (about 8 words or fewer each),',
    'in the order they should be completed. No numbering, week labels, or commentary —',
    'just the milestone titles.',
    '',
    `Goal: ${userPrompt}`,
  ].join('\n');

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        input,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: { type: 'array', items: { type: 'string' } },
        },
      }),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (res.status === 429) {
    throw new Error('Rate limit reached. Please wait a moment and try again.');
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini request failed (${res.status}). ${detail.slice(0, 200)}`.trim());
  }

  const data = (await res.json()) as InteractionResponse;
  const text = extractText(data);
  if (!text) {
    throw new Error(
      `Gemini returned no content. Response: ${JSON.stringify(data).slice(0, 300)}`
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Could not parse the AI response: ${text.slice(0, 200)}`);
  }
  if (!Array.isArray(parsed)) throw new Error('Unexpected AI response format.');

  return parsed
    .map((step) => String(step).trim())
    .filter((step) => step.length > 0)
    .slice(0, MAX_STEPS);
}

type Content = { type?: string; text?: string };
type Step = { type?: string; content?: Content[] };
type InteractionResponse = { output_text?: string; steps?: Step[] };

/**
 * The Interactions API nests output at `steps[].content[].text` (in the
 * `model_output` step). We prefer that step, fall back to any text content,
 * and finally to a flat `output_text` for forward-compatibility.
 */
function extractText(data: InteractionResponse): string | undefined {
  const steps = data.steps ?? [];

  const collect = (filterModelOutput: boolean): string =>
    steps
      .filter((s) => (filterModelOutput ? s.type === 'model_output' : true))
      .flatMap((s) => s.content ?? [])
      .map((c) => c.text ?? '')
      .join('')
      .trim();

  const fromModelOutput = collect(true);
  if (fromModelOutput) return fromModelOutput;

  const fromAnyStep = collect(false);
  if (fromAnyStep) return fromAnyStep;

  return data.output_text?.trim() || undefined;
}
