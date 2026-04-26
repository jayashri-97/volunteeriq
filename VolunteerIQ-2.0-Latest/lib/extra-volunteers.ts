import type { Volunteer, ActivityLog } from './mock-data';

export const extraVolunteers: Volunteer[] = [
  // ═══ Gujarat — Earthquake Zone ═══
  { id:'v-020', name:'Capt. Rajesh Patel', phone:'+91 94260 10001', skills:['Rescue Operations','Construction','Driving'], status:'deployed', availability:10, location:'Bhuj', lat:23.2500, lng:69.6700, eta:'On site' },
  { id:'v-021', name:'Dr. Falguni Shah', phone:'+91 94260 10002', skills:['Medical','First Aid','Counseling'], status:'deployed', availability:5, location:'Bhuj', lat:23.2400, lng:69.6600, eta:'On site' },
  { id:'v-022', name:'Hardik Solanki', phone:'+91 94260 10003', skills:['Rescue Operations','Swimming','Engineering'], status:'deployed', availability:15, location:'Gandhidham', lat:23.0800, lng:70.1300, eta:'5 min' },

  // ═══ Odisha — Cyclone Zone ═══
  { id:'v-025', name:'Biswajit Mohanty', phone:'+91 94370 20001', skills:['Logistics','Driving','Crowd Management'], status:'deployed', availability:20, location:'Puri', lat:19.8100, lng:85.8300, eta:'On site' },
  { id:'v-026', name:'Smt. Laxmi Pradhan', phone:'+91 94370 20002', skills:['Cooking','Communication','First Aid'], status:'deployed', availability:25, location:'Puri', lat:19.8200, lng:85.8400, eta:'10 min' },
  { id:'v-027', name:'Subhash Nayak', phone:'+91 94370 20003', skills:['Construction','Logistics','Engineering'], status:'deployed', availability:15, location:'Konark', lat:19.8900, lng:86.0900, eta:'20 min' },
  { id:'v-028', name:'Dr. Priyanka Das', phone:'+91 94370 20004', skills:['Medical','Nursing','First Aid'], status:'deployed', availability:30, location:'Bhubaneswar', lat:20.2900, lng:85.8200, eta:'15 min' },

  // ═══ Assam/Northeast — Flood Zone ═══
  { id:'v-030', name:'Anjan Bora', phone:'+91 94350 30001', skills:['Swimming','Rescue Operations','Driving'], status:'deployed', availability:10, location:'Jorhat', lat:26.7509, lng:94.2037, eta:'30 min' },
  { id:'v-031', name:'Dr. Ritu Hazarika', phone:'+91 94350 30002', skills:['Veterinary','First Aid','Communication'], status:'deployed', availability:35, location:'Golaghat', lat:26.5200, lng:93.9600, eta:'On site' },

  // ═══ North India — Heatwave/Disaster ═══
  { id:'v-033', name:'Dr. Sanjay Tiwari', phone:'+91 94150 40001', skills:['Medical','First Aid','Nursing'], status:'deployed', availability:20, location:'Varanasi', lat:25.3200, lng:83.0100, eta:'On site' },
  { id:'v-035', name:'Col. Vikram Singh (Retd)', phone:'+91 98100 50001', skills:['Hazmat Handling','Rescue Operations','Crowd Management'], status:'deployed', availability:10, location:'Visakhapatnam', lat:17.7400, lng:83.3400, eta:'On site' },
  { id:'v-036', name:'Sunita Reddy', phone:'+91 98490 50002', skills:['Nursing','Medical','First Aid'], status:'deployed', availability:15, location:'Visakhapatnam', lat:17.7600, lng:83.3600, eta:'5 min' },

  // ═══ Kerala/South India ═══
  { id:'v-037', name:'Dr. Thomas Kurian', phone:'+91 94470 60001', skills:['Medical','Counseling','Communication'], status:'deployed', availability:25, location:'Kozhikode', lat:11.2600, lng:75.7800, eta:'On site' },

  // ═══ Uttarakhand/Himachal ═══
  { id:'v-038', name:'Subedar Ratan Singh', phone:'+91 94120 70001', skills:['Rescue Operations','Construction','Driving'], status:'deployed', availability:15, location:'Joshimath', lat:30.5600, lng:79.5600, eta:'On site' },
  { id:'v-039', name:'Geeta Rawat', phone:'+91 94120 70002', skills:['First Aid','Communication','Cooking'], status:'deployed', availability:40, location:'Chamoli', lat:30.4000, lng:79.3300, eta:'45 min' },
  { id:'v-040', name:'Eng. Manoj Negi', phone:'+91 94180 70003', skills:['Engineering','Construction','Driving'], status:'deployed', availability:20, location:'Solan', lat:30.9100, lng:77.0800, eta:'On site' },

  // ═══ Tamil Nadu/South ═══
  { id:'v-041', name:'Karthik Subramanian', phone:'+91 94430 80001', skills:['Logistics','Crowd Management','Driving'], status:'deployed', availability:30, location:'Nagapattinam', lat:10.7700, lng:79.8500, eta:'On site' },
  { id:'v-042', name:'Lakshmi Narayanan', phone:'+91 94430 80002', skills:['Communication','Translation','Data Entry'], status:'deployed', availability:50, location:'Nagapattinam', lat:10.7600, lng:79.8400, eta:'10 min' },

  // ═══ Delhi/NCR ═══
  { id:'v-043', name:'ASI Deepak Kumar', phone:'+91 98110 90001', skills:['Firefighting','Rescue Operations','First Aid'], status:'deployed', availability:5, location:'West Delhi', lat:28.6800, lng:76.9700, eta:'On site' },

  // ═══ Other Pan-India ═══
  { id:'v-044', name:'Sr. Mary Joseph', phone:'+91 94460 11001', skills:['Child Care','Counseling','Nursing'], status:'deployed', availability:35, location:'Wayanad', lat:11.6900, lng:76.1300, eta:'15 min' },
  { id:'v-045', name:'Capt. Tenzin Dorji', phone:'+91 94360 12001', skills:['Communication','Logistics','Engineering'], status:'deployed', availability:45, location:'Tawang', lat:27.5900, lng:91.8600, eta:'On site' },
  { id:'v-046', name:'Stanzin Angmo', phone:'+91 94190 13001', skills:['Driving','Logistics','Cooking'], status:'deployed', availability:30, location:'Leh', lat:34.1500, lng:77.5800, eta:'20 min' },

  // ═══ Available volunteers across India ═══
  { id:'v-050', name:'Arjun Menon', phone:'+91 98470 14001', skills:['Swimming','Rescue Operations','First Aid'], status:'available', availability:95, location:'Kochi', lat:9.9312, lng:76.2673 },
  { id:'v-051', name:'Fatima Begum', phone:'+91 98310 14002', skills:['Nursing','Medical','Child Care'], status:'available', availability:88, location:'Kolkata', lat:22.5726, lng:88.3639 },
  { id:'v-052', name:'Gurpreet Singh', phone:'+91 98150 14003', skills:['Construction','Engineering','Driving'], status:'available', availability:92, location:'Chandigarh', lat:30.7333, lng:76.7794 },
  { id:'v-053', name:'Devika Nair', phone:'+91 94440 14004', skills:['Counseling','Communication','Translation'], status:'available', availability:85, location:'Chennai', lat:13.0827, lng:80.2707 },
  { id:'v-054', name:'Imran Khan', phone:'+91 98230 14005', skills:['Logistics','Cooking','Crowd Management'], status:'available', availability:78, location:'Pune', lat:18.5204, lng:73.8567 },
  { id:'v-055', name:'Riya Dutta', phone:'+91 98310 14006', skills:['Data Entry','Communication','First Aid'], status:'available', availability:90, location:'Guwahati', lat:26.1445, lng:91.7362 },
  { id:'v-056', name:'Aravind Swamy', phone:'+91 98800 14007', skills:['Medical','Hazmat Handling','First Aid'], status:'available', availability:82, location:'Bangalore', lat:12.9716, lng:77.5946 },
  { id:'v-057', name:'Pooja Chauhan', phone:'+91 98290 14008', skills:['Firefighting','Rescue Operations','Swimming'], status:'available', availability:91, location:'Jaipur', lat:26.9124, lng:75.7873 },
  { id:'v-058', name:'Mohammad Ashraf', phone:'+91 94190 14009', skills:['Construction','Engineering','Logistics'], status:'available', availability:75, location:'Srinagar', lat:34.0837, lng:74.7973 },
  { id:'v-059', name:'Lata Mangeshwar', phone:'+91 98200 14010', skills:['Communication','Child Care','Counseling'], status:'available', availability:88, location:'Mumbai', lat:19.0760, lng:72.8777 },
];

export const extraMatchMap: Record<string, { volunteerId: string; score: number }[]> = {
  'n-100': [{ volunteerId:'v-020', score:96 }, { volunteerId:'v-022', score:91 }, { volunteerId:'v-052', score:72 }],
  'n-101': [{ volunteerId:'v-022', score:97 }, { volunteerId:'v-020', score:88 }, { volunteerId:'v-057', score:75 }],
  'n-102': [{ volunteerId:'v-021', score:98 }, { volunteerId:'v-056', score:85 }, { volunteerId:'v-051', score:80 }],
  'n-110': [{ volunteerId:'v-025', score:94 }, { volunteerId:'v-027', score:90 }, { volunteerId:'v-026', score:85 }],
  'n-111': [{ volunteerId:'v-028', score:92 }, { volunteerId:'v-027', score:86 }, { volunteerId:'v-052', score:70 }],
  'n-112': [{ volunteerId:'v-026', score:90 }, { volunteerId:'v-054', score:82 }, { volunteerId:'v-025', score:78 }],
  'n-120': [{ volunteerId:'v-030', score:95 }, { volunteerId:'v-050', score:88 }, { volunteerId:'v-055', score:65 }],
  'n-121': [{ volunteerId:'v-055', score:82 }, { volunteerId:'v-050', score:75 }, { volunteerId:'v-056', score:70 }],
  'n-122': [{ volunteerId:'v-031', score:96 }, { volunteerId:'v-050', score:60 }, { volunteerId:'v-055', score:55 }],
  'n-130': [{ volunteerId:'v-057', score:85 }, { volunteerId:'v-033', score:80 }, { volunteerId:'v-056', score:72 }],
  'n-131': [{ volunteerId:'v-033', score:94 }, { volunteerId:'v-056', score:86 }, { volunteerId:'v-051', score:78 }],
  'n-140': [{ volunteerId:'v-035', score:98 }, { volunteerId:'v-036', score:92 }, { volunteerId:'v-056', score:75 }],
  'n-150': [{ volunteerId:'v-037', score:96 }, { volunteerId:'v-051', score:84 }, { volunteerId:'v-053', score:68 }],
  'n-160': [{ volunteerId:'v-038', score:94 }, { volunteerId:'v-040', score:90 }, { volunteerId:'v-039', score:78 }],
  'n-161': [{ volunteerId:'v-040', score:92 }, { volunteerId:'v-052', score:85 }, { volunteerId:'v-058', score:75 }],
  'n-170': [{ volunteerId:'v-041', score:90 }, { volunteerId:'v-042', score:86 }, { volunteerId:'v-053', score:72 }],
  'n-180': [{ volunteerId:'v-043', score:97 }, { volunteerId:'v-057', score:88 }, { volunteerId:'v-035', score:80 }],
  'n-190': [{ volunteerId:'v-044', score:95 }, { volunteerId:'v-059', score:82 }, { volunteerId:'v-053', score:78 }],
  'n-191': [{ volunteerId:'v-053', score:90 }, { volunteerId:'v-059', score:85 }, { volunteerId:'v-044', score:80 }],
  'n-200': [{ volunteerId:'v-054', score:82 }, { volunteerId:'v-055', score:70 }, { volunteerId:'v-051', score:65 }],
  'n-201': [{ volunteerId:'v-052', score:80 }, { volunteerId:'v-058', score:75 }, { volunteerId:'v-054', score:68 }],
  'n-202': [{ volunteerId:'v-045', score:92 }, { volunteerId:'v-055', score:70 }, { volunteerId:'v-042', score:65 }],
  'n-203': [{ volunteerId:'v-046', score:88 }, { volunteerId:'v-058', score:78 }, { volunteerId:'v-052', score:65 }],
  'n-204': [{ volunteerId:'v-050', score:82 }, { volunteerId:'v-056', score:75 }, { volunteerId:'v-054', score:60 }],
};

export const extraActivityLog: ActivityLog[] = [
  { id:'a-100', needId:'n-100', action:'created', description:'**7.1 Earthquake** detected — auto-alert from seismic network', timestamp: new Date(Date.now() - 3*3600000) },
  { id:'a-101', needId:'n-100', action:'escalated', description:'Escalated to **National Disaster** — NDRF 5 battalions deployed', timestamp: new Date(Date.now() - 2.5*3600000) },
  { id:'a-102', needId:'n-100', action:'assigned', description:'**Capt. Rajesh Patel** + **Dr. Falguni Shah** deployed to Bhuj', timestamp: new Date(Date.now() - 2*3600000) },
  { id:'a-110', needId:'n-110', action:'created', description:'**Cyclone Biparjoy** Cat 4 landfall detected at Puri coast', timestamp: new Date(Date.now() - 6*3600000) },
  { id:'a-111', needId:'n-110', action:'assigned', description:'**Biswajit Mohanty** team of 3 deployed for coastal rescue', timestamp: new Date(Date.now() - 5*3600000) },
  { id:'a-120', needId:'n-120', action:'created', description:'**Brahmaputra breach** — Majuli Island flood alert from ASDMA', timestamp: new Date(Date.now() - 4*3600000) },
  { id:'a-120b', needId:'n-120', action:'escalated', description:'Escalated — **6200 families** stranded, IAF helicopter support requested', timestamp: new Date(Date.now() - 3.5*3600000) },
  { id:'a-140', needId:'n-140', action:'created', description:'**Styrene gas leak** — Vizag plant emergency alarm triggered', timestamp: new Date(Date.now() - 1.5*3600000) },
  { id:'a-140b', needId:'n-140', action:'assigned', description:'**Col. Vikram Singh** hazmat team deployed for containment', timestamp: new Date(Date.now() - 1*3600000) },
  { id:'a-150', needId:'n-150', action:'created', description:'**Nipah virus** — 3 lab-confirmed cases reported to ICMR', timestamp: new Date(Date.now() - 12*3600000) },
  { id:'a-160', needId:'n-160', action:'created', description:'**Joshimath landslide** — ITBP patrol reported massive subsidence', timestamp: new Date(Date.now() - 8*3600000) },
  { id:'a-170', needId:'n-170', action:'created', description:'**Tsunami warning** — INCOIS alert for Tamil Nadu coastline', timestamp: new Date(Date.now() - 1*3600000) },
  { id:'a-180', needId:'n-180', action:'created', description:'**Mundka warehouse fire** — Delhi Fire Service 4-alarm response', timestamp: new Date(Date.now() - 0.5*3600000) },
  { id:'a-300', needId:'n-300', action:'resolved', description:'**Sundarbans Amphan** recovery complete — 18,000 families rehoused', timestamp: new Date(Date.now() - 168*3600000) },
  { id:'a-302', needId:'n-302', action:'resolved', description:'**Dharavi COVID** cluster contained — zero cases for 28 days', timestamp: new Date(Date.now() - 672*3600000) },
];
