import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── All valid Indian district + major city coordinates ──
const INDIA_LOCATION_MAP: [string, string, string, number, number][] = [
  ['nandgaon', 'Nandgaon, Amravati', 'Amravati', 20.8100, 77.6800],
  ['amravati', 'Amravati', 'Amravati', 20.9374, 77.7796],
  ['nagpur', 'Nagpur', 'Nagpur', 21.1458, 79.0882],
  ['pune', 'Pune', 'Pune', 18.5204, 73.8567],
  ['mumbai', 'Mumbai', 'Mumbai', 19.0760, 72.8777],
  ['nashik', 'Nashik', 'Nashik', 19.9975, 73.7898],
  ['aurangabad', 'Aurangabad', 'Aurangabad', 19.8762, 75.3433],
  ['kolhapur', 'Kolhapur', 'Kolhapur', 16.7050, 74.2433],
  ['solapur', 'Solapur', 'Solapur', 17.6599, 75.9064],
  ['latur', 'Latur', 'Latur', 18.4088, 76.5604],
  ['nanded', 'Nanded', 'Nanded', 19.1383, 77.3210],
  ['parbhani', 'Parbhani', 'Parbhani', 19.2610, 76.7747],
  ['washim', 'Washim', 'Washim', 20.1029, 77.1471],
  ['yavatmal', 'Yavatmal', 'Yavatmal', 20.3899, 78.1307],
  ['akola', 'Akola', 'Akola', 20.7002, 77.0082],
  ['buldhana', 'Buldhana', 'Buldhana', 20.5297, 76.1846],
  ['hingoli', 'Hingoli', 'Hingoli', 19.7150, 77.1499],
  ['chandrapur', 'Chandrapur', 'Chandrapur', 19.9615, 79.2961],
  ['osmanabad', 'Osmanabad', 'Osmanabad', 18.1860, 76.0407],
  ['jalna', 'Jalna', 'Jalna', 19.8410, 75.8864],
  ['beed', 'Beed', 'Beed', 18.9891, 75.7601],
  ['wardha', 'Wardha', 'Wardha', 20.7453, 78.6022],
  ['gadchiroli', 'Gadchiroli', 'Gadchiroli', 20.1756, 80.0062],
  ['sangli', 'Sangli', 'Sangli', 16.8524, 74.5815],
  ['satara', 'Satara', 'Satara', 17.6805, 74.0183],
  ['ratnagiri', 'Ratnagiri', 'Ratnagiri', 16.9902, 73.3120],
  ['chennai', 'Chennai', 'Chennai', 13.0827, 80.2707],
  ['delhi', 'New Delhi', 'Delhi', 28.6139, 77.2090],
  ['kolkata', 'Kolkata', 'Kolkata', 22.5726, 88.3639],
  ['bangalore', 'Bengaluru', 'Bengaluru', 12.9716, 77.5946],
  ['bengaluru', 'Bengaluru', 'Bengaluru', 12.9716, 77.5946],
  ['hyderabad', 'Hyderabad', 'Hyderabad', 17.3850, 78.4867],
  ['ahmedabad', 'Ahmedabad', 'Ahmedabad', 23.0225, 72.5714],
  ['jaipur', 'Jaipur', 'Jaipur', 26.9124, 75.7873],
  ['lucknow', 'Lucknow', 'Lucknow', 26.8467, 80.9462],
  ['bhopal', 'Bhopal', 'Bhopal', 23.2599, 77.4126],
  ['patna', 'Patna', 'Patna', 25.6093, 85.1376],
  ['guwahati', 'Guwahati', 'Guwahati', 26.1445, 91.7362],
  ['thiruvananthapuram', 'Thiruvananthapuram', 'Thiruvananthapuram', 8.5241, 76.9366],
  ['bhubaneswar', 'Bhubaneswar', 'Bhubaneswar', 20.2961, 85.8245],
  ['srinagar', 'Srinagar', 'Srinagar', 34.0837, 74.7973],
  ['jammu', 'Jammu', 'Jammu', 32.7357, 74.8691],
  ['shimla', 'Shimla', 'Himachal Pradesh', 31.1048, 77.1734],
  ['dehradun', 'Dehradun', 'Uttarakhand', 30.3165, 78.0322],
  ['ranchi', 'Ranchi', 'Jharkhand', 23.3441, 85.3096],
  ['raipur', 'Raipur', 'Chhattisgarh', 21.2514, 81.6296],
  ['indore', 'Indore', 'Madhya Pradesh', 22.7196, 75.8577],
  ['surat', 'Surat', 'Gujarat', 21.1702, 72.8311],
  ['varanasi', 'Varanasi', 'Uttar Pradesh', 25.3176, 82.9739],
  ['agra', 'Agra', 'Uttar Pradesh', 27.1767, 78.0081],
  ['visakhapatnam', 'Visakhapatnam', 'Andhra Pradesh', 17.6868, 83.2185],
  ['vijayawada', 'Vijayawada', 'Andhra Pradesh', 16.5062, 80.6480],
  ['coimbatore', 'Coimbatore', 'Tamil Nadu', 11.0168, 76.9558],
  ['madurai', 'Madurai', 'Tamil Nadu', 9.9252, 78.1198],
];

const PARSE_SYSTEM_PROMPT = `You are a disaster relief field report parser for India. Given a raw field report (WhatsApp message, SMS, email, voice transcript, or any informal text), extract structured information.

Return ONLY valid JSON (no markdown, no code blocks) with these exact fields:
{
  "need_type": string (one of: "Water Supply", "Medical Aid", "Food Distribution", "Shelter", "Search & Rescue", "Clothing", "Sanitation", "Power Restoration", "Road Clearance", "Communication", "Earthquake Relief", "Cyclone Response", "Flood Rescue", "Heatwave Relief", "Chemical Spill", "Epidemic Control", "Landslide Clearance", "Tsunami Response", "Fire Response", "Child Protection", "Mental Health", "Animal Rescue", "Infrastructure Repair", "Food Scarcity"),
  "title": string (short descriptive title, max 60 chars),
  "location_text": string (human readable location, e.g. "Nandgaon village, Amravati"),
  "district": string (Indian district name),
  "state": string (Indian state name),
  "lat": number (latitude of location in India, between 8.0 and 37.0),
  "lng": number (longitude of location in India, between 68.0 and 97.5),
  "urgency_score_ai": number (1-10 integer, where 10 is most urgent),
  "skills_required": string[] (from: "First Aid", "Driving", "Medical", "Logistics", "Communication", "Cooking", "Construction", "Counseling", "Water Purification", "Rescue Operations", "Data Entry", "Translation", "Engineering", "Swimming", "Hazmat Handling", "Firefighting", "Crowd Management", "Nursing", "Child Care", "Veterinary"),
  "family_count": number (the exact number of families, households, or groups of people mentioned in the report. If a specific number like '5 families' is mentioned, you MUST return 5. If no number is explicitly mentioned, default to 1. Do NOT estimate or invent large numbers if they are not in the text),
  "description": string (cleaned-up 1-2 sentence description),
  "contact": string (contact person/number if mentioned, otherwise "Not provided"),
  "notes": string (any additional details like road access, special conditions, etc.)
}

Rules:
- urgency_score_ai: 9-10 = life-threatening/immediate danger, 7-8 = urgent within hours, 5-6 = serious but stable, 1-4 = low priority
- If location is a village, identify the nearest district
- Default coordinates to Amravati, Maharashtra (20.9374, 77.7796) if location is unclear
- Always return valid JSON only — no explanatory text, no markdown`;

const MATCH_SYSTEM_PROMPT = `You are a volunteer-need matching engine for disaster relief in India.

Given a disaster need and a list of available volunteers, rank the top 3 volunteers by match suitability.

Return ONLY valid JSON array (no markdown):
[
  {
    "volunteer_id": string,
    "match_score": number (0-100),
    "match_reason": string (one concise sentence explaining why this volunteer is ideal)
  }
]

Ranking factors:
1. Skill overlap with need requirements (most important)
2. Geographic proximity to the need location
3. Volunteer availability percentage
4. Current deployment status (available > deployed)`;

// ── Scoring formula per spec ──
function computeFinalScore(aiScore: number, familyCount: number, submittedAt: Date): number {
  const hoursAgo = (Date.now() - submittedAt.getTime()) / 3_600_000;
  const recencyWeight = Math.max(0, 1.0 - hoursAgo * 0.05);
  const familyWeight = Math.min(familyCount / 50, 1.0) * 10;
  // spec: (ai_score × 0.5) + (recency_weight × 0.3) + (family_count_weight × 0.2)
  const raw = (aiScore * 0.5) + (recencyWeight * 0.3 * 10) + (familyWeight * 0.2);
  return Math.round(Math.min(raw * 10, 100)); // scale to 0-100
}

function mapAiScoreToUrgency(aiScore: number): 'critical' | 'high' | 'medium' {
  if (aiScore >= 8) return 'critical';
  if (aiScore >= 5) return 'high';
  return 'medium';
}

function resolveLocationFallback(text: string): { location: string; district: string; lat: number; lng: number } {
  const lower = text.toLowerCase();
  for (const [keyword, location, district, lat, lng] of INDIA_LOCATION_MAP) {
    if (lower.includes(keyword)) {
      return { location, district, lat, lng };
    }
  }
  // Default: Maharashtra center
  return { location: 'Maharashtra', district: 'Amravati', lat: 20.9374, lng: 77.7796 };
}

function detectNeedType(text: string): string {
  const lower = text.toLowerCase();
  // Order matters: disaster-specific types first to prevent false matches
  // (e.g. "clean water" in flood report shouldn't match "Water Supply")
  const typeMap: [string[], string][] = [
    [['flood', 'waterlog', 'submerge', 'overflow', 'inundated', 'floods'], 'Flood Rescue'],
    [['earthquake', 'tremor', 'seismic', 'collapse', 'quake'], 'Earthquake Relief'],
    [['cyclone', 'storm', 'hurricane', 'typhoon'], 'Cyclone Response'],
    [['landslide', 'mudslide', 'debris'], 'Landslide Clearance'],
    [['fire', 'burn', 'blaze', 'flame', 'wildfire'], 'Fire Response'],
    [['epidemic', 'virus', 'disease', 'infection', 'outbreak', 'cholera', 'dengue', 'malaria'], 'Epidemic Control'],
    [['rescue', 'missing', 'trapped', 'stranded', 'stuck'], 'Search & Rescue'],
    [['medical', 'doctor', 'hospital', 'injury', 'medicine', 'health', 'nurse'], 'Medical Aid'],
    [['food', 'hunger', 'ration', 'malnourish', 'starving', 'meal', 'eat'], 'Food Distribution'],
    [['water', 'drinking', 'bore well', 'tanker', 'pipeline', 'dehydrat'], 'Water Supply'],
    [['shelter', 'house', 'tent', 'roof', 'displaced', 'homeless'], 'Shelter'],
    [['cloth', 'blanket', 'sweater', 'warm', 'winter'], 'Clothing'],
    [['toilet', 'sewage', 'sanitation', 'drainage', 'waste'], 'Sanitation'],
    [['power', 'electricity', 'blackout', 'generator'], 'Power Restoration'],
    [['road', 'bridge', 'highway', 'blocked', 'tree fallen'], 'Road Clearance'],
    [['child', 'orphan', 'minor', 'kid', 'baby', 'infant'], 'Child Protection'],
  ];
  for (const [keywords, type] of typeMap) {
    if (keywords.some(k => lower.includes(k))) return type;
  }
  return 'Water Supply';
}

// ── Mock volunteer matching (no AI key needed) ──
function mockVolunteerMatch(needDistrict: string, skillsRequired: string[]) {
  // Import-free: return generic placeholders since we can't import mock-data in edge route
  return [
    {
      volunteer_id: `v-auto-${Date.now()}-1`,
      match_score: 87,
      match_reason: `High skill overlap with ${skillsRequired[0] || 'required skills'} and proximity to ${needDistrict}`,
    },
    {
      volunteer_id: `v-auto-${Date.now()}-2`,
      match_score: 74,
      match_reason: `Available immediately, trained in ${skillsRequired[1] || 'logistics'} operations`,
    },
    {
      volunteer_id: `v-auto-${Date.now()}-3`,
      match_score: 61,
      match_reason: `Nearest available volunteer with relevant disaster relief experience`,
    },
  ];
}

export async function POST(request: NextRequest) {
  let raw_text = '';
  try {
    const body = await request.json();
    raw_text = body.raw_text?.trim() ?? '';

    // ── Validation ──
    if (!raw_text) {
      return NextResponse.json({ error: 'Please paste or type a field report first.' }, { status: 400 });
    }
    if (raw_text.length < 20) {
      return NextResponse.json({ error: 'Report is too short. Add more detail about the need.' }, { status: 400 });
    }
    if (raw_text.length > 5000) {
      return NextResponse.json({ error: 'Report exceeds 5,000 characters. Please shorten it.' }, { status: 400 });
    }

    const submittedAt = new Date();
    const apiKey = process.env.GEMINI_API_KEY;

    // ── No API key → intelligent mock ──
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(buildMockNeed(raw_text, submittedAt));
    }

    // ── Call Gemini 1.5 Flash ──
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    });

    // Step 1: Parse field report
    let parsed: Record<string, unknown>;
    try {
      const parseResult = await model.generateContent([
        { text: PARSE_SYSTEM_PROMPT },
        { text: `Parse this field report:\n\n${raw_text}` },
      ]);
      let responseText = parseResult.response.text().trim();

      // Strip markdown code fences if present
      const fence = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fence) responseText = fence[1].trim();

      parsed = JSON.parse(responseText);
    } catch (err) {
      console.error('[parse-need] Gemini generation failed:', err);
      // Gemini failed — fall back to intelligent mock
      return NextResponse.json(buildMockNeed(raw_text, submittedAt));
    }

    // ── Validate / sanitize parsed coords to India bounding box ──
    let lat = Number(parsed.lat) || 0;
    let lng = Number(parsed.lng) || 0;
    if (lat < 8 || lat > 37 || lng < 68 || lng > 97.5) {
      const fallback = resolveLocationFallback(raw_text);
      lat = fallback.lat;
      lng = fallback.lng;
    }

    const aiScore = Math.max(1, Math.min(10, Number(parsed.urgency_score_ai) || 5));
    const familyCount = Math.max(1, Number(parsed.family_count) || 1);
    const finalScore = computeFinalScore(aiScore, familyCount, submittedAt);
    const urgency = mapAiScoreToUrgency(aiScore);
    const skillsRequired = Array.isArray(parsed.skills_required) ? parsed.skills_required as string[] : [];

    const needId = `n-${Date.now()}`;

    // Step 2: Auto volunteer matching (non-blocking, best-effort)
    let aiMatchedVolunteers: Array<{ volunteer_id: string; match_score: number; match_reason: string }> = [];
    try {
      const matchResult = await model.generateContent([
        { text: MATCH_SYSTEM_PROMPT },
        {
          text: JSON.stringify({
            need: {
              id: needId,
              type: parsed.need_type,
              location: parsed.location_text,
              district: parsed.district,
              urgency_score: aiScore,
              skills_required: skillsRequired,
              family_count: familyCount,
            },
            instruction: 'Rank the top 3 volunteer types that would be most suitable for this need based on the skill requirements and location. Use placeholder IDs like v-match-1, v-match-2, v-match-3.',
          }),
        },
      ]);

      let matchText = matchResult.response.text().trim();
      const matchFence = matchText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (matchFence) matchText = matchFence[1].trim();
      aiMatchedVolunteers = JSON.parse(matchText);
    } catch {
      aiMatchedVolunteers = mockVolunteerMatch(String(parsed.district || 'Unknown'), skillsRequired);
    }

    const need = {
      id: needId,
      type: (parsed.need_type as string) || 'Water Supply',
      title: ((parsed.title as string) || `${parsed.need_type} — ${parsed.location_text}`).slice(0, 60),
      location: (parsed.location_text as string) || 'Unknown Location',
      district: (parsed.district as string) || 'Unknown',
      state: (parsed.state as string) || 'Maharashtra',
      lat,
      lng,
      urgency,
      score: finalScore,
      ai_score: aiScore,
      status: 'unassigned',
      families: familyCount,
      description: (parsed.description as string) || raw_text.slice(0, 200),
      rawReport: raw_text,
      reportedAt: submittedAt.toISOString(),
      assignedVolunteerIds: [],
      skills_required: skillsRequired,
      contact: (parsed.contact as string) || 'Not provided',
      notes: (parsed.notes as string) || '',
      ai_matched_volunteers: aiMatchedVolunteers,
    };

    return NextResponse.json(need);
  } catch (error) {
    console.error('[parse-need] Unhandled error:', error);
    if (raw_text) {
      return NextResponse.json(buildMockNeed(raw_text, new Date()));
    }
    return NextResponse.json({ error: 'Failed to parse report. Please try again.' }, { status: 500 });
  }
}

// ── Intelligent mock parser (no API key) ──
function buildMockNeed(rawText: string, submittedAt: Date) {
  const text = rawText.toLowerCase();
  const needType = detectNeedType(rawText);
  const { location, district, lat, lng } = resolveLocationFallback(rawText);

  let aiScore = 6;
  if (/urgent|asap|emergency|critical|dying|dead|collapse|trapped|missing|life|stranded|devastat|evacuat|drowning/.test(text)) aiScore = 9;
  else if (/serious|severe|major|overwhelm|running out|depleting|malnourish/.test(text)) aiScore = 7;
  else if (/need|required|shortage|help|support/.test(text)) aiScore = 5;

  const familyMatch = text.match(/(\d+)\s*(families|family|houses|household|homes|people|persons|affected)/);
  const familyCount = familyMatch ? Math.max(1, parseInt(familyMatch[1])) : 1;

  const contactMatch = rawText.match(/(\d{10}|\d{5}\s?\d{5}|[+]\d{2}\s?\d{10})/);
  const contact = contactMatch ? contactMatch[0] : 'Not provided';

  const finalScore = computeFinalScore(aiScore, familyCount, submittedAt);
  const urgency = mapAiScoreToUrgency(aiScore);
  const needId = `n-${Date.now()}`;

  return {
    id: needId,
    type: needType,
    title: `${needType} — ${location}`.slice(0, 60),
    location,
    district,
    state: 'Maharashtra',
    lat,
    lng,
    urgency,
    score: finalScore,
    ai_score: aiScore,
    status: 'unassigned',
    families: familyCount,
    description: rawText.slice(0, 200).trim() + (rawText.length > 200 ? '…' : ''),
    rawReport: rawText,
    reportedAt: submittedAt.toISOString(),
    assignedVolunteerIds: [],
    skills_required: [],
    contact,
    notes: '',
    ai_matched_volunteers: mockVolunteerMatch(district, []),
  };
}
