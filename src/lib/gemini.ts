// Server-side Gemini "Interactions API" calls. Used by the Expo Router API
// routes (app/api/*) so the API key stays off the client.

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';
const MODEL = 'gemini-3.5-flash';

type Content = { type?: string; text?: string };
type Step = { type?: string; content?: Content[] };
type InteractionResponse = { output_text?: string; steps?: Step[] };

async function request(apiKey: string, body: Record<string, unknown>): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, ...body }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Gemini request failed (${res.status}). ${detail.slice(0, 200)}`.trim());
  }

  const data = (await res.json()) as InteractionResponse;
  const text = extractText(data);
  if (!text) throw new Error('Gemini returned no content.');
  return text;
}

/** Free-text completion. */
export async function geminiText(input: string, apiKey: string): Promise<string> {
  return (await request(apiKey, { input })).trim();
}

/** Structured completion returning an array of short strings. */
export async function geminiList(
  input: string,
  apiKey: string,
  max = 12
): Promise<string[]> {
  const text = await request(apiKey, {
    input,
    response_format: {
      type: 'text',
      mime_type: 'application/json',
      schema: { type: 'array', items: { type: 'string' } },
    },
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Could not parse the AI response.');
  }
  if (!Array.isArray(parsed)) throw new Error('Unexpected AI response format.');

  return parsed
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0)
    .slice(0, max);
}

/**
 * The Interactions API nests output at `steps[].content[].text` (in the
 * `model_output` step). Prefer that step, fall back to any text content, then
 * to a flat `output_text` for forward-compatibility.
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

  return collect(true) || collect(false) || data.output_text?.trim() || undefined;
}
