import { geminiText } from '@/lib/gemini';

type SummaryStats = {
  currentStreak: number;
  totalHours: number;
  weekHours: number;
  activeSkills: number;
  completedMilestones: number;
  mostPracticedSkill?: string;
};

const summaryPrompt = (s: SummaryStats) =>
  [
    'You are a supportive learning coach. Using the stats below, write a short,',
    'encouraging summary of the past week (2-3 sentences) followed by one concrete,',
    'specific suggestion for what to focus on next. Warm and motivating, plain text,',
    'no markdown, no lists.',
    '',
    `Current streak: ${s.currentStreak} days`,
    `Total learning time (all-time): ${s.totalHours} hours`,
    `This week: ${s.weekHours} hours`,
    `Active skills: ${s.activeSkills}`,
    `Completed milestones: ${s.completedMilestones}`,
    `Most practiced skill: ${s.mostPracticedSkill ?? 'none yet'}`,
  ].join('\n');

// POST /api/summary — AI weekly coaching summary.
export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Server is missing GEMINI_API_KEY.' }, { status: 500 });
  }

  let stats: SummaryStats;
  try {
    stats = (await request.json()) as SummaryStats;
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const summary = await geminiText(summaryPrompt(stats), apiKey);
    return Response.json({ summary });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to generate a summary.';
    return Response.json({ error: message }, { status: 502 });
  }
}
