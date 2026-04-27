import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── All valid Indian district + major city coordinates ──
const INDIA_LOCATION_MAP: [string, string, string, number, number][] = [
  // ── Maharashtra ──
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
  ['thane', 'Thane', 'Thane', 19.2183, 72.9781],
  ['navi mumbai', 'Navi Mumbai', 'Thane', 19.0330, 73.0297],
  // ── Gujarat ──
  ['surat', 'Surat', 'Surat', 21.1702, 72.8311],
  ['ahmedabad', 'Ahmedabad', 'Ahmedabad', 23.0225, 72.5714],
  ['vadodara', 'Vadodara', 'Vadodara', 22.3072, 73.1812],
  ['rajkot', 'Rajkot', 'Rajkot', 22.3039, 70.8022],
  ['gandhinagar', 'Gandhinagar', 'Gandhinagar', 23.2156, 72.6369],
  ['junagadh', 'Junagadh', 'Junagadh', 21.5222, 70.4579],
  ['bhavnagar', 'Bhavnagar', 'Bhavnagar', 21.7645, 72.1519],
  ['jamnagar', 'Jamnagar', 'Jamnagar', 22.4707, 70.0577],
  ['anand', 'Anand', 'Anand', 22.5645, 72.9289],
  ['bharuch', 'Bharuch', 'Bharuch', 21.7051, 72.9959],
  ['mehsana', 'Mehsana', 'Mehsana', 23.5880, 72.3693],
  ['gidc', 'GIDC, Surat', 'Surat', 21.1702, 72.8311],
  // ── Tamil Nadu ──
  ['chennai', 'Chennai', 'Chennai', 13.0827, 80.2707],
  ['coimbatore', 'Coimbatore', 'Coimbatore', 11.0168, 76.9558],
  ['madurai', 'Madurai', 'Madurai', 9.9252, 78.1198],
  ['trichy', 'Tiruchirappalli', 'Tiruchirappalli', 10.7905, 78.7047],
  ['tiruchirappalli', 'Tiruchirappalli', 'Tiruchirappalli', 10.7905, 78.7047],
  ['salem', 'Salem', 'Salem', 11.6643, 78.1460],
  ['tirunelveli', 'Tirunelveli', 'Tirunelveli', 8.7139, 77.7567],
  ['vellore', 'Vellore', 'Vellore', 12.9165, 79.1325],
  // ── Karnataka ──
  ['bangalore', 'Bengaluru', 'Bengaluru', 12.9716, 77.5946],
  ['bengaluru', 'Bengaluru', 'Bengaluru', 12.9716, 77.5946],
  ['mysuru', 'Mysuru', 'Mysuru', 12.2958, 76.6394],
  ['mysore', 'Mysuru', 'Mysuru', 12.2958, 76.6394],
  ['hubli', 'Hubballi', 'Dharwad', 15.3647, 75.1240],
  ['mangaluru', 'Mangaluru', 'Dakshina Kannada', 12.9141, 74.8560],
  ['mangalore', 'Mangaluru', 'Dakshina Kannada', 12.9141, 74.8560],
  ['belagavi', 'Belagavi', 'Belagavi', 15.8497, 74.4977],
  // ── Andhra Pradesh & Telangana ──
  ['hyderabad', 'Hyderabad', 'Hyderabad', 17.3850, 78.4867],
  ['visakhapatnam', 'Visakhapatnam', 'Visakhapatnam', 17.6868, 83.2185],
  ['vijayawada', 'Vijayawada', 'Krishna', 16.5062, 80.6480],
  ['tirupati', 'Tirupati', 'Chittoor', 13.6288, 79.4192],
  ['guntur', 'Guntur', 'Guntur', 16.2960, 80.4365],
  ['warangal', 'Warangal', 'Warangal', 17.9784, 79.5941],
  // ── Delhi & NCR ──
  ['delhi', 'New Delhi', 'Delhi', 28.6139, 77.2090],
  ['new delhi', 'New Delhi', 'Delhi', 28.6139, 77.2090],
  ['noida', 'Noida', 'Gautam Buddha Nagar', 28.5355, 77.3910],
  ['gurgaon', 'Gurugram', 'Gurugram', 28.4595, 77.0266],
  ['gurugram', 'Gurugram', 'Gurugram', 28.4595, 77.0266],
  ['faridabad', 'Faridabad', 'Faridabad', 28.4089, 77.3178],
  // ── Uttar Pradesh ──
  ['lucknow', 'Lucknow', 'Lucknow', 26.8467, 80.9462],
  ['kanpur', 'Kanpur', 'Kanpur', 26.4499, 80.3319],
  ['agra', 'Agra', 'Agra', 27.1767, 78.0081],
  ['varanasi', 'Varanasi', 'Varanasi', 25.3176, 82.9739],
  ['prayagraj', 'Prayagraj', 'Prayagraj', 25.4358, 81.8463],
  ['allahabad', 'Prayagraj', 'Prayagraj', 25.4358, 81.8463],
  ['meerut', 'Meerut', 'Meerut', 28.9845, 77.7064],
  ['ghaziabad', 'Ghaziabad', 'Ghaziabad', 28.6692, 77.4538],
  // ── Rajasthan ──
  ['jaipur', 'Jaipur', 'Jaipur', 26.9124, 75.7873],
  ['jodhpur', 'Jodhpur', 'Jodhpur', 26.2389, 73.0243],
  ['udaipur', 'Udaipur', 'Udaipur', 24.5854, 73.7125],
  ['kota', 'Kota', 'Kota', 25.2138, 75.8648],
  ['ajmer', 'Ajmer', 'Ajmer', 26.4499, 74.6399],
  ['bikaner', 'Bikaner', 'Bikaner', 28.0229, 73.3119],
  // ── Madhya Pradesh ──
  ['bhopal', 'Bhopal', 'Bhopal', 23.2599, 77.4126],
  ['indore', 'Indore', 'Indore', 22.7196, 75.8577],
  ['gwalior', 'Gwalior', 'Gwalior', 26.2183, 78.1828],
  ['jabalpur', 'Jabalpur', 'Jabalpur', 23.1815, 79.9864],
  // ── West Bengal ──
  ['kolkata', 'Kolkata', 'Kolkata', 22.5726, 88.3639],
  ['howrah', 'Howrah', 'Howrah', 22.5958, 88.2636],
  ['durgapur', 'Durgapur', 'Paschim Bardhaman', 23.5204, 87.3119],
  ['siliguri', 'Siliguri', 'Darjeeling', 26.7271, 88.3953],
  // ── Bihar ──
  ['patna', 'Patna', 'Patna', 25.6093, 85.1376],
  ['gaya', 'Gaya', 'Gaya', 24.7955, 85.0002],
  ['muzaffarpur', 'Muzaffarpur', 'Muzaffarpur', 26.1197, 85.3910],
  // ── Other major states ──
  ['bhubaneswar', 'Bhubaneswar', 'Khordha', 20.2961, 85.8245],
  ['cuttack', 'Cuttack', 'Cuttack', 20.4625, 85.8828],
  ['puri', 'Puri', 'Puri', 19.8135, 85.8312],
  ['guwahati', 'Guwahati', 'Kamrup', 26.1445, 91.7362],
  ['dibrugarh', 'Dibrugarh', 'Dibrugarh', 27.4728, 94.9120],
  ['ranchi', 'Ranchi', 'Ranchi', 23.3441, 85.3096],
  ['jamshedpur', 'Jamshedpur', 'East Singhbhum', 22.8046, 86.2029],
  ['raipur', 'Raipur', 'Raipur', 21.2514, 81.6296],
  ['thiruvananthapuram', 'Thiruvananthapuram', 'Thiruvananthapuram', 8.5241, 76.9366],
  ['kochi', 'Kochi', 'Ernakulam', 9.9312, 76.2673],
  ['kozhikode', 'Kozhikode', 'Kozhikode', 11.2588, 75.7804],
  ['srinagar', 'Srinagar', 'Srinagar', 34.0837, 74.7973],
  ['jammu', 'Jammu', 'Jammu', 32.7357, 74.8691],
  ['shimla', 'Shimla', 'Shimla', 31.1048, 77.1734],
  ['dehradun', 'Dehradun', 'Dehradun', 30.3165, 78.0322],
  ['haridwar', 'Haridwar', 'Haridwar', 29.9457, 78.1642],
  ['amritsar', 'Amritsar', 'Amritsar', 31.6340, 74.8723],
  ['ludhiana', 'Ludhiana', 'Ludhiana', 30.9010, 75.8573],
  ['chandigarh', 'Chandigarh', 'Chandigarh', 30.7333, 76.7794],
  ['panaji', 'Panaji', 'North Goa', 15.4909, 73.8278],
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

// State capital fallback coords — used when city not in INDIA_LOCATION_MAP
const STATE_CAPITALS: Record<string, [string, string, number, number]> = {
  'Gujarat':           ['Gandhinagar', 'Gandhinagar', 23.2156, 72.6369],
  'Maharashtra':       ['Mumbai', 'Mumbai', 19.0760, 72.8777],
  'Tamil Nadu':        ['Chennai', 'Chennai', 13.0827, 80.2707],
  'Karnataka':         ['Bengaluru', 'Bengaluru', 12.9716, 77.5946],
  'Andhra Pradesh':    ['Amaravati', 'Guntur', 16.5138, 80.5153],
  'Telangana':         ['Hyderabad', 'Hyderabad', 17.3850, 78.4867],
  'Rajasthan':         ['Jaipur', 'Jaipur', 26.9124, 75.7873],
  'Madhya Pradesh':    ['Bhopal', 'Bhopal', 23.2599, 77.4126],
  'Uttar Pradesh':     ['Lucknow', 'Lucknow', 26.8467, 80.9462],
  'Bihar':             ['Patna', 'Patna', 25.6093, 85.1376],
  'West Bengal':       ['Kolkata', 'Kolkata', 22.5726, 88.3639],
  'Odisha':            ['Bhubaneswar', 'Khordha', 20.2961, 85.8245],
  'Assam':             ['Guwahati', 'Kamrup', 26.1445, 91.7362],
  'Jharkhand':         ['Ranchi', 'Ranchi', 23.3441, 85.3096],
  'Chhattisgarh':      ['Raipur', 'Raipur', 21.2514, 81.6296],
  'Himachal Pradesh':  ['Shimla', 'Shimla', 31.1048, 77.1734],
  'Uttarakhand':       ['Dehradun', 'Dehradun', 30.3165, 78.0322],
  'Punjab':            ['Chandigarh', 'Chandigarh', 30.7333, 76.7794],
  'Haryana':           ['Chandigarh', 'Chandigarh', 30.7333, 76.7794],
  'Kerala':            ['Thiruvananthapuram', 'Thiruvananthapuram', 8.5241, 76.9366],
  'Goa':               ['Panaji', 'North Goa', 15.4909, 73.8278],
  'Jammu & Kashmir':   ['Srinagar', 'Srinagar', 34.0837, 74.7973],
  'Delhi':             ['New Delhi', 'Delhi', 28.6139, 77.2090],
  'Manipur':           ['Imphal', 'Imphal West', 24.8170, 93.9368],
  'Meghalaya':         ['Shillong', 'East Khasi Hills', 25.5788, 91.8933],
  'Tripura':           ['Agartala', 'West Tripura', 23.8315, 91.2868],
  'Arunachal Pradesh': ['Itanagar', 'Papum Pare', 27.0844, 93.6053],
  'Sikkim':            ['Gangtok', 'East Sikkim', 27.3314, 88.6138],
  'Nagaland':          ['Kohima', 'Kohima', 25.6701, 94.1077],
  'Mizoram':           ['Aizawl', 'Aizawl', 23.1645, 92.9376],
};

// Helper: match keyword as a whole word (not substring of another word)
function wordMatch(text: string, keyword: string): boolean {
  // Escape special regex chars, allow spaces to match hyphens too
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '[\\s\\-]');
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i').test(text);
}

function resolveLocationFallback(text: string): { location: string; district: string; lat: number; lng: number } {
  // Step 1: Try exact whole-word match against city/district table
  for (const [keyword, location, district, lat, lng] of INDIA_LOCATION_MAP) {
    if (wordMatch(text, keyword)) {
      return { location, district, lat, lng };
    }
  }
  // Step 2: Detect state and use its capital
  const state = detectState(text);
  const capital = STATE_CAPITALS[state];
  if (capital) {
    return { location: capital[0], district: capital[1], lat: capital[2], lng: capital[3] };
  }
  // Step 3: Absolute fallback — geographic centre of India (not Maharashtra)
  return { location: 'India', district: 'Unknown', lat: 20.5937, lng: 78.9629 };
}

function detectNeedType(text: string): string {
  const lower = text.toLowerCase();
  const typeMap: [string[], string][] = [
    // Chemical/Industrial MUST be first — keywords like 'explosion','toxic','chlorine' are very specific
    [['chemical', 'toxic gas', 'toxic cloud', 'hazmat', 'chlorine', 'ammonia', 'chemical plant', 'chemical factory', 'gidc', 'industrial accident', 'gas cloud', 'chemical spill', 'gas leak', 'noxious fumes', 'explosion at', 'factory explosion', 'plant explosion'], 'Chemical Spill'],
    [['flood', 'waterlog', 'submerge', 'overflow', 'inundated', 'floods'], 'Flood Rescue'],
    // 'collapse' removed — too generic (chemical plants, buildings collapse too)
    [['earthquake', 'tremor', 'seismic', 'quake'], 'Earthquake Relief'],
    [['cyclone', 'storm', 'hurricane', 'typhoon'], 'Cyclone Response'],
    [['landslide', 'mudslide', 'debris flow'], 'Landslide Clearance'],
    [['tsunami', 'tidal wave'], 'Tsunami Response'],
    [['heatwave', 'heat wave', 'heat stroke', 'sunstroke', 'extreme heat'], 'Heatwave Relief'],
    [['explosion', 'blast', 'blaze', 'wildfire', 'burn', 'fire', 'flame'], 'Fire Response'],
    [['epidemic', 'virus', 'disease', 'infection', 'outbreak', 'cholera', 'dengue', 'malaria'], 'Epidemic Control'],
    [['rescue', 'missing', 'trapped', 'stranded', 'stuck', 'collapse', 'building fell'], 'Search & Rescue'],
    [['medical', 'doctor', 'hospital', 'injury', 'medicine', 'health', 'nurse', 'burns', 'hospitalised', 'hospitalized'], 'Medical Aid'],
    [['food', 'hunger', 'ration', 'malnourish', 'starving', 'meal', 'eat', 'food scarcity'], 'Food Distribution'],
    [['water', 'drinking', 'bore well', 'tanker', 'pipeline', 'dehydrat'], 'Water Supply'],
    [['shelter', 'tent', 'roof', 'displaced', 'homeless', 'evacuat'], 'Shelter'],
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

function detectSkillsRequired(needType: string, text: string): string[] {
  const lower = text.toLowerCase();
  const typeSkills: Record<string, string[]> = {
    'Chemical Spill':      ['Hazmat Handling', 'Rescue Operations', 'Medical', 'Communication'],
    'Flood Rescue':        ['Rescue Operations', 'Swimming', 'Logistics', 'First Aid'],
    'Earthquake Relief':   ['Rescue Operations', 'Construction', 'Medical', 'First Aid'],
    'Cyclone Response':    ['Rescue Operations', 'Construction', 'Logistics', 'First Aid'],
    'Landslide Clearance': ['Rescue Operations', 'Construction', 'Engineering', 'First Aid'],
    'Tsunami Response':    ['Rescue Operations', 'Swimming', 'Medical', 'Logistics'],
    'Heatwave Relief':     ['Medical', 'Nursing', 'Logistics', 'Communication'],
    'Fire Response':       ['Firefighting', 'Rescue Operations', 'First Aid', 'Medical'],
    'Epidemic Control':    ['Medical', 'Nursing', 'Communication', 'Logistics'],
    'Search & Rescue':     ['Rescue Operations', 'First Aid', 'Communication', 'Driving'],
    'Medical Aid':         ['Medical', 'Nursing', 'First Aid', 'Logistics'],
    'Food Distribution':   ['Logistics', 'Cooking', 'Driving', 'Communication'],
    'Water Supply':        ['Water Purification', 'Logistics', 'Engineering', 'Driving'],
    'Shelter':             ['Construction', 'Logistics', 'Engineering', 'Driving'],
    'Sanitation':          ['Logistics', 'Engineering', 'Water Purification'],
    'Road Clearance':      ['Construction', 'Engineering', 'Driving', 'Logistics'],
  };
  const skills: string[] = [...(typeSkills[needType] || ['First Aid', 'Logistics', 'Communication'])];
  if (lower.includes('hindi') || lower.includes('language') || lower.includes('migrant') || lower.includes('translation')) skills.push('Translation');
  if (lower.includes('evacuat') || lower.includes('crowd')) skills.push('Crowd Management');
  if (lower.includes('child') || lower.includes('kid') || lower.includes('baby') || lower.includes('infant')) skills.push('Child Care');
  if (lower.includes('counsel') || lower.includes('mental') || lower.includes('trauma')) skills.push('Counseling');
  if (lower.includes('animal') || lower.includes('veterina') || lower.includes('livestock')) skills.push('Veterinary');
  return [...new Set(skills)].slice(0, 6);
}

function detectState(text: string): string {
  const lower = text.toLowerCase();
  const stateMap: [string[], string][] = [
    [['gujarat', 'surat', 'ahmedabad', 'vadodara', 'rajkot', 'gandhinagar', 'gidc', 'junagadh', 'bhavnagar', 'jamnagar', 'anand', 'mehsana', 'bharuch'], 'Gujarat'],
    [['maharashtra', 'mumbai', 'pune', 'nagpur', 'nashik', 'amravati', 'aurangabad', 'solapur', 'nanded', 'kolhapur', 'nandgaon', 'washim', 'yavatmal', 'akola', 'latur', 'chandrapur'], 'Maharashtra'],
    [['tamil nadu', 'tamilnadu', 'chennai', 'coimbatore', 'madurai', 'trichy', 'tiruchirappalli', 'salem', 'tirunelveli'], 'Tamil Nadu'],
    [['kerala', 'thiruvananthapuram', 'kochi', 'kozhikode', 'thrissur', 'palakkad', 'alappuzha'], 'Kerala'],
    [['karnataka', 'bangalore', 'bengaluru', 'mysuru', 'mysore', 'hubli', 'mangalore', 'mangaluru', 'belagavi', 'davangere'], 'Karnataka'],
    [['andhra pradesh', 'andhra', 'visakhapatnam', 'vijayawada', 'tirupati', 'guntur', 'nellore', 'kurnool'], 'Andhra Pradesh'],
    [['telangana', 'hyderabad', 'warangal', 'nizamabad', 'karimnagar', 'khammam'], 'Telangana'],
    [['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'kota', 'ajmer', 'bikaner', 'alwar', 'bharatpur'], 'Rajasthan'],
    [['madhya pradesh', ' mp ', 'bhopal', 'indore', 'gwalior', 'jabalpur', 'ujjain', 'sagar'], 'Madhya Pradesh'],
    [['uttar pradesh', ' up ', 'lucknow', 'kanpur', 'agra', 'varanasi', 'allahabad', 'prayagraj', 'meerut', 'ghaziabad', 'noida'], 'Uttar Pradesh'],
    [['bihar', 'patna', 'gaya', 'bhagalpur', 'muzaffarpur', 'darbhanga', 'purnia'], 'Bihar'],
    [['west bengal', 'kolkata', 'howrah', 'durgapur', 'siliguri', 'asansol', 'darjeeling'], 'West Bengal'],
    [['odisha', 'orissa', 'bhubaneswar', 'cuttack', 'puri', 'rourkela', 'sambalpur'], 'Odisha'],
    [['assam', 'guwahati', 'dibrugarh', 'silchar', 'jorhat', 'tezpur'], 'Assam'],
    [['jharkhand', 'ranchi', 'jamshedpur', 'dhanbad', 'bokaro'], 'Jharkhand'],
    [['chhattisgarh', 'raipur', 'bhilai', 'bilaspur', 'durg', 'korba'], 'Chhattisgarh'],
    [['himachal pradesh', 'shimla', 'dharamsala', 'mandi', 'solan', 'kullu', 'manali'], 'Himachal Pradesh'],
    [['uttarakhand', 'uttaranchal', 'dehradun', 'haridwar', 'rishikesh', 'nainital', 'almora', 'roorkee'], 'Uttarakhand'],
    [['punjab', 'amritsar', 'ludhiana', 'jalandhar', 'patiala', 'bathinda', 'mohali'], 'Punjab'],
    [['haryana', 'gurugram', 'gurgaon', 'faridabad', 'panipat', 'rohtak', 'ambala', 'hisar'], 'Haryana'],
    [['goa', 'panaji', 'vasco', 'margao', 'mapusa'], 'Goa'],
    [['jammu', 'kashmir', 'srinagar', 'leh', 'ladakh', 'pulwama', 'anantnag'], 'Jammu & Kashmir'],
    [['delhi', 'new delhi'], 'Delhi'],
    [['manipur', 'imphal'], 'Manipur'],
    [['meghalaya', 'shillong'], 'Meghalaya'],
    [['tripura', 'agartala'], 'Tripura'],
    [['assam', 'arunachal', 'itanagar'], 'Arunachal Pradesh'],
    [['sikkim', 'gangtok'], 'Sikkim'],
  ];
  for (const [keywords, state] of stateMap) {
    // Use word-boundary matching so 'goa' doesn’t match inside 'goalpokhar' etc.
    if (keywords.some(k => wordMatch(lower, k))) return state;
  }
  return 'India';
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

    // ── No valid API key → intelligent mock ──
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || !apiKey.startsWith('AIza')) {
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
  const state = detectState(rawText);
  const skillsRequired = detectSkillsRequired(needType, rawText);

  let aiScore = 6;
  if (/urgent|asap|emergency|critical|dying|dead|collapse|trapped|missing|life|stranded|devastat|evacuat|drowning|explosion|toxic|not evacuated|overwhelmed/.test(text)) aiScore = 9;
  else if (/serious|severe|major|overwhelm|running out|depleting|malnourish|hospitalised|hospitalized|injured/.test(text)) aiScore = 7;
  else if (/need|required|shortage|help|support/.test(text)) aiScore = 5;

  // Family count — try multiple patterns
  const familyMatch =
    text.match(/(\d[\d,]*)\s*(families|family|households|household|homes|houses)/) ||
    text.match(/(\d[\d,]*)\s*(people|persons|residents|individuals|workers|victims)\s*(affected|impacted|displaced|at risk|in)/) ||
    text.match(/affect(?:ed|ing)\s*(\d[\d,]*)/) ||
    text.match(/(\d[\d,]*)\s*(?:families|people)\s*in\s+(?:downwind|affected|danger)/);
  const familyCount = familyMatch
    ? Math.max(1, parseInt((familyMatch[1] || familyMatch[2] || '1').replace(/,/g, '')))
    : 1;

  // Contact — also capture phone with dashes/spaces
  const contactMatch = rawText.match(/(\d{10}|\d{3,5}[-\s]\d{5,8}|[+]\d{2}\s?\d{10}|0\d{2,4}[-\s]\d{6,8})/);
  const contact = contactMatch ? contactMatch[0] : 'Not provided';

  // Build a meaningful description
  const sentences = rawText.split(/[.!\n]+/).map(s => s.trim()).filter(s => s.length > 10);
  const description = sentences.slice(0, 2).join('. ').slice(0, 300);

  // Build notes from remaining text
  const notes = sentences.slice(2, 4).join('. ').slice(0, 200);

  const finalScore = computeFinalScore(aiScore, familyCount, submittedAt);
  const urgency = mapAiScoreToUrgency(aiScore);
  const needId = `n-${Date.now()}`;

  return {
    id: needId,
    type: needType,
    title: `${needType} — ${location}`.slice(0, 60),
    location,
    district,
    state,
    lat,
    lng,
    urgency,
    score: finalScore,
    ai_score: aiScore,
    status: 'unassigned',
    families: familyCount,
    description: description || rawText.slice(0, 300).trim(),
    rawReport: rawText,
    reportedAt: submittedAt.toISOString(),
    assignedVolunteerIds: [],
    skills_required: skillsRequired,
    contact,
    notes,
    ai_matched_volunteers: mockVolunteerMatch(district, skillsRequired),
  };
}
