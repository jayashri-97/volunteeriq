import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { mockVolunteers } from '@/lib/mock-data';

const SYSTEM_PROMPT = `You are an AI Volunteer Dispatch Coordinator.
Your job is to match the best available volunteers to a disaster relief need.

You will receive:
1. The details of the Need (location, urgency, skills required).
2. A list of available Volunteers (location, skills, availability).

Task:
Select the top 3 best volunteers for this need.
For each selected volunteer, provide a match score (0-100) and a short 1-sentence reason why they are a good fit.

Return ONLY valid JSON in this exact format:
{
  "matches": [
    {
      "volunteerId": "v-123",
      "score": 95,
      "reason": "Has Medical skills and is located in the same district."
    }
  ]
}
No markdown, no backticks, just JSON.`;

export async function POST(request: NextRequest) {
  let need = null;
  let availableVolunteers: any[] = [];
  try {
    const body = await request.json();
    need = body.need;

    if (!need) {
      return NextResponse.json({ error: 'Need object is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Filter to available volunteers
    availableVolunteers = mockVolunteers.filter(v => v.status === 'available');

    // If no API key, do a basic algorithmic match
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(fallbackMatcher(need, availableVolunteers));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const promptData = `
NEED DETAILS:
${JSON.stringify(need, null, 2)}

AVAILABLE VOLUNTEERS:
${JSON.stringify(availableVolunteers.map(v => ({
  id: v.id,
  name: v.name,
  location: v.location,
  skills: v.skills,
  availability: v.availability
})), null, 2)}
`;

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: promptData },
    ]);

    const responseText = result.response.text();
    let jsonStr = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Matching error:', error);
    if (need && availableVolunteers.length > 0) {
      return NextResponse.json(fallbackMatcher(need, availableVolunteers));
    }
    return NextResponse.json({ error: 'Failed to match volunteers' }, { status: 500 });
  }
}

function fallbackMatcher(need: any, volunteers: any[]) {
  // Simple scoring based on location match and skills
  const scored = volunteers.map((v: any) => {
    let score = 50;
    // Check if volunteer location matches need location/district
    if (need.location && v.location && v.location.toLowerCase().includes(need.district?.toLowerCase() || '')) score += 30;
    const skillOverlap = need.skills_required?.some((s: string) => v.skills?.includes(s)) ? 1 : 0;
    score += skillOverlap * 15;
    score += Math.round((v.availability || 50) / 20); // up to 5 pts
    return {
      volunteerId: v.id,
      score: Math.min(score, 99),
      reason: skillOverlap ? `Has relevant skills and matches location.` : `Available nearby with good availability.`,
    };
  });

  scored.sort((a: any, b: any) => b.score - a.score);
  return { matches: scored.slice(0, 3) };
}
