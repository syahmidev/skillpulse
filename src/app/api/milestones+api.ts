import { geminiList } from '@/lib/gemini';

type MilestoneRequest = { skillName?: unknown; goal?: unknown; existing?: unknown };

const suggestPrompt = (skillName: string, goal: string, existing: string[]) =>
  [
    `You are a learning coach. Suggest 3 concise next milestone titles`,
    `(about 8 words or fewer each) for someone learning "${skillName}"${
      goal ? ` with the goal "${goal}"` : ''
    }.`,
    existing.length
      ? `They already have these milestones, so avoid duplicates: ${existing.join('; ')}.`
      : '',
    'Return only the milestone titles, ordered by what to do next.',
  ]
    .filter(Boolean)
    .join('\n');

// POST /api/milestones — AI suggestions for the next milestones on a skill.
export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Server is missing GEMINI_API_KEY.' }, { status: 500 });
  }

  let body: MilestoneRequest;
  try {
    body = (await request.json()) as MilestoneRequest;
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const skillName = typeof body.skillName === 'string' ? body.skillName.trim() : '';
  if (!skillName) {
    return Response.json({ error: 'Missing skill.' }, { status: 400 });
  }
  const goal = typeof body.goal === 'string' ? body.goal.trim() : '';
  const existing = Array.isArray(body.existing)
    ? body.existing.filter((t): t is string => typeof t === 'string')
    : [];

  try {
    const suggestions = await geminiList(suggestPrompt(skillName, goal, existing), apiKey, 3);
    return Response.json({ suggestions });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to suggest milestones.';
    return Response.json({ error: message }, { status: 502 });
  }
}
