export const PLACEHOLDER_IMAGES = {
  pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
  streetlight: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
  garbage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80",
  waterLeak: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80",
  trafficSignal: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=800&auto=format&fit=crop&q=80",
  repairedRoad: "https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80",
  defaultIssue: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80"
};

export const ISSUE_CATEGORIES = [
  { id: 'pothole', label: 'Road Damage & Pothole', department: 'Public Works (PWD)', icon: 'AlertTriangle', color: 'text-amber-400' },
  { id: 'water_leak', label: 'Water Leakage / Pipe Burst', department: 'Water Board (Jal Nigam)', icon: 'Droplets', color: 'text-cyan-400' },
  { id: 'streetlight', label: 'Streetlight Outage', department: 'Electrical Department', icon: 'Lightbulb', color: 'text-yellow-400' },
  { id: 'garbage', label: 'Garbage & Waste Overflow', department: 'Sanitation Department', icon: 'Trash2', color: 'text-emerald-400' },
  { id: 'traffic_signal', label: 'Traffic Signal Failure', department: 'Traffic Police', icon: 'Radio', color: 'text-rose-400' },
  { id: 'drainage', label: 'Drainage / Sewage Blockage', department: 'Sanitation & Water', icon: 'Waves', color: 'text-blue-400' },
  { id: 'illegal_dumping', label: 'Illegal Debris Dumping', department: 'Municipal Corporation', icon: 'Truck', color: 'text-purple-400' },
  { id: 'other', label: 'Other Civic Concern', department: 'City Control Room', icon: 'HelpCircle', color: 'text-slate-400' }
];

export const DEPARTMENTS = [
  { id: 'pwd', name: 'Public Works Department (PWD)', head: 'Er. Rajesh Sharma', activeIssues: 42, resolvedIssues: 380, slaRating: '94%' },
  { id: 'water', name: 'Water Supply & Sewage Board', head: 'Er. Priya Nair', activeIssues: 28, resolvedIssues: 290, slaRating: '91%' },
  { id: 'electrical', name: 'Municipal Electrical Dept', head: 'Er. Amit Verma', activeIssues: 19, resolvedIssues: 410, slaRating: '97%' },
  { id: 'sanitation', name: 'Solid Waste & Sanitation', head: 'Sunita Rao', activeIssues: 35, resolvedIssues: 520, slaRating: '89%' },
  { id: 'traffic', name: 'Traffic Management Bureau', head: 'Inspector K. Rathore', activeIssues: 12, resolvedIssues: 175, slaRating: '96%' }
];

export const ISSUE_STATUSES = {
  PENDING: { label: 'Pending AI Scan', color: 'bg-slate-500/20 text-slate-300 border-slate-600', step: 1 },
  VERIFIED: { label: 'AI Verified', color: 'bg-blue-500/20 text-blue-300 border-blue-600', step: 2 },
  ASSIGNED: { label: 'Assigned to Dept', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-600', step: 3 },
  IN_PROGRESS: { label: 'Work In Progress', color: 'bg-amber-500/20 text-amber-300 border-amber-600', step: 4 },
  RESOLVED: { label: 'Resolved (Pending Audit)', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-600', step: 5 },
  CLOSED: { label: 'Verified & Closed', color: 'bg-teal-500/20 text-teal-300 border-teal-600', step: 6 },
  REJECTED: { label: 'Rejected / Duplicate', color: 'bg-rose-500/20 text-rose-300 border-rose-600', step: 0 }
};

export const SEVERITY_LEVELS = {
  CRITICAL: { label: 'Critical / Hazard', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40', badge: 'bg-rose-600 text-white', weight: 4 },
  HIGH: { label: 'High Priority', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', badge: 'bg-amber-600 text-white', weight: 3 },
  MEDIUM: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', badge: 'bg-yellow-600 text-white', weight: 2 },
  LOW: { label: 'Low Severity', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40', badge: 'bg-slate-600 text-white', weight: 1 }
};

export const INITIAL_MOCK_ISSUES = [
  {
    id: 'CIV-2026-8941',
    userId: 'usr_citizen_001',
    title: 'Severe Deep Crater Pothole on Ring Road Flyover',
    description: 'A 2-foot wide dangerous crater formed in the middle lane causing vehicles to brake abruptly. High accident risk during night hours.',
    category: 'pothole',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priorityScore: 94,
    aiConfidence: 96.8,
    department: 'Public Works (PWD)',
    assignedOfficer: 'Er. Rajesh Sharma',
    location: {
      address: 'Outer Ring Road, Near Junction 14, Sector 5',
      lat: 28.6139,
      lng: 77.2090,
      zone: 'North Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: null,
    reporter: {
      id: 'usr_citizen_001',
      _id: 'usr_citizen_001',
      name: 'Aarav Mehta',
      email: 'citizen@civicvision.ai',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      reputation: 340
    },
    upvotes: 47,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 18).toISOString(), note: 'Submitted with GPS coordinates and photo.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 17).toISOString(), note: 'AI classified as Critical Pothole (96.8% confidence, 94 Priority Score).' },
      { status: 'Assigned', time: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'Dispatched to PWD Fast-Response Road Maintenance Unit 3.' },
      { status: 'In Progress', time: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Asphalt cold patch crew deployed to site.' }
    ],
    aiDetection: {
      detectedObjects: ['Pothole Deep (Width: 62cm)', 'Asphalt Crack Pattern', 'Vehicular Traffic Lane'],
      safetyHazardIndex: 9.4,
      trafficImpactFactor: 'High (850 vehicles/hr)',
      suggestedAction: 'Immediate cold-mix asphalt overlay & warning barricade.'
    }
  },
  {
    id: 'CIV-2026-8942',
    userId: 'usr_citizen_riya',
    title: 'Major 12-inch Water Main Leak Flooding Pedestrian Walkway',
    description: 'Pressurized clean water leaking continuously since morning, submersing the footpath and eroding the road foundation.',
    category: 'water_leak',
    severity: 'HIGH',
    status: 'ASSIGNED',
    priorityScore: 88,
    aiConfidence: 94.2,
    department: 'Water Board (Jal Nigam)',
    assignedOfficer: 'Er. Priya Nair',
    location: {
      address: 'Main Market Road, Opp. Metro Pillar 112',
      lat: 28.6250,
      lng: 77.2180,
      zone: 'Central Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: null,
    reporter: {
      id: 'usr_citizen_riya',
      _id: 'usr_citizen_riya',
      name: 'Riya Sen',
      email: 'riya.sen@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      reputation: 190
    },
    upvotes: 31,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 10).toISOString(), note: 'Citizen photo submitted.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 9).toISOString(), note: 'Vision AI detected pressurized pipe fissure & water accumulation.' },
      { status: 'Assigned', time: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'Forwarded to Central Water Emergency Valve Unit.' }
    ],
    aiDetection: {
      detectedObjects: ['Pressurized Water Plume', 'Eroded Soil Base', 'Pedestrian Walkway Blockage'],
      safetyHazardIndex: 7.9,
      trafficImpactFactor: 'Medium (Sidewalk blocked)',
      suggestedAction: 'Isolate Sector 5 sluice valve and replace pipe coupling.'
    }
  },
  {
    id: 'CIV-2026-8943',
    userId: 'usr_citizen_sunil',
    title: 'Cluster of 4 Streetlights Non-Operational on School Road',
    description: 'Complete blackout for a 200m stretch adjacent to Government Girls Senior Secondary School. Creates safety concerns after sunset.',
    category: 'streetlight',
    severity: 'HIGH',
    status: 'VERIFIED',
    priorityScore: 82,
    aiConfidence: 98.1,
    department: 'Municipal Electrical Dept',
    assignedOfficer: 'Er. Amit Verma',
    location: {
      address: 'School Lane, Block B, Green Park',
      lat: 28.6010,
      lng: 77.2020,
      zone: 'South Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: null,
    reporter: {
      id: 'usr_citizen_sunil',
      _id: 'usr_citizen_sunil',
      name: 'Sunil Kapoor',
      email: 'sunil.k@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      reputation: 510
    },
    upvotes: 63,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 24).toISOString(), note: 'Community flagged dark corridor hazard.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 23).toISOString(), note: 'AI validated LED luminaire fuse burnout & zone vulnerability.' }
    ],
    aiDetection: {
      detectedObjects: ['Light Pole Unlit (x4)', 'Dark Corridor Zone', 'Educational Perimeter'],
      safetyHazardIndex: 8.5,
      trafficImpactFactor: 'Pedestrian Safety Critical',
      suggestedAction: 'Replace 70W LED driver units and check feeder pillar.'
    }
  },
  {
    id: 'CIV-2026-8944',
    userId: 'usr_citizen_pooja',
    title: 'Solid Waste Bin Overflow & Secondary Dump Spill',
    description: 'Community dumpster has not been cleared for 4 days. Waste spilling onto service lane attracting stray animals.',
    category: 'garbage',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    priorityScore: 68,
    aiConfidence: 95.0,
    department: 'Solid Waste & Sanitation',
    assignedOfficer: 'Sunita Rao',
    location: {
      address: 'Near Community Center, Pocket 3, Mayur Vihar',
      lat: 28.6090,
      lng: 77.2270,
      zone: 'East Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
    workerSubmission: {
      workerName: 'Sunil Paswan (Field Contractor)',
      workerEmail: 'worker@civicvision.ai',
      contractorUnit: 'Sanitation Rapid Response Unit #2',
      afterImageUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
      materialsUsed: 'Hydraulic Compactor, Disinfectant Spray & Concrete Floor Wash',
      repairNotes: 'Waste completely cleared, container disinfected with lime bleach powder, and service lane thoroughly washed.',
      gpsVerification: {
        verified: true,
        distanceMeters: 38,
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      submittedAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    repairAudit: {
      verified: true,
      confidenceScore: 98.4,
      verificationNotes: 'Admin certified: Area is sanitized, waste container emptied, and roadway restored cleanly.',
      verifiedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      verifiedBy: 'Er. Rajesh Sharma (Municipal Admin)'
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Priya Mukherjee (Local Resident)',
        rating: 5,
        comment: 'Outstanding prompt action! The area was cleared within hours of reporting and fully disinfected. Thank you to the field workers!',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        role: 'Verified Resident'
      },
      {
        id: 'rev-2',
        author: 'Arjun Das (Shopkeeper)',
        rating: 5,
        comment: 'Great work! Odor is gone and customers can walk freely along the pavement again.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        role: 'Community Member'
      }
    ],
    reporter: {
      id: 'usr_citizen_pooja',
      _id: 'usr_citizen_pooja',
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      reputation: 220
    },
    upvotes: 19,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 48).toISOString(), note: 'Photo submitted.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 47).toISOString(), note: 'Sanitation overflow verified.' },
      { status: 'Assigned', time: new Date(Date.now() - 3600000 * 30).toISOString(), note: 'Assigned to Sanitation Compactor Crew.' },
      { status: 'Repair Certified & Published', time: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'Waste cleared, bin sanitized and before/after audit verified.' }
    ],
    aiDetection: {
      detectedObjects: ['Overflowing Dumpster', 'Organic Waste Scatter', 'Odor Risk Radius: 40m'],
      safetyHazardIndex: 6.2,
      trafficImpactFactor: 'Low',
      suggestedAction: 'Heavy hydraulic compactor truck clearance & lime bleaching.'
    }
  },
  {
    id: 'CIV-2026-8945',
    userId: 'usr_citizen_mohit',
    title: 'Traffic Junction Signal Blinking Red on All Approaches',
    description: 'Signal controller malfunction at busy 4-way intersection causing gridlock and near-miss vehicle collisions.',
    category: 'traffic_signal',
    severity: 'CRITICAL',
    status: 'IN_PROGRESS',
    priorityScore: 97,
    aiConfidence: 99.2,
    department: 'Traffic Management Bureau',
    assignedOfficer: 'Inspector K. Rathore',
    location: {
      address: 'Kalyan Marg & Gandhi Road Intersection',
      lat: 28.6320,
      lng: 77.2150,
      zone: 'Central Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: null,
    reporter: {
      id: 'usr_citizen_mohit',
      _id: 'usr_citizen_mohit',
      name: 'Mohit Chawla',
      email: 'mohit.c@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      reputation: 680
    },
    upvotes: 88,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Emergency signal failure alert.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Critical traffic disruption detected.' },
      { status: 'Assigned', time: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Traffic police field marshals & signal engineer dispatched.' }
    ],
    aiDetection: {
      detectedObjects: ['Signal Controller Unit', 'All-Red Flashing Sequence', 'High Vehicle Density'],
      safetyHazardIndex: 9.8,
      trafficImpactFactor: 'Severe Gridlock (Estimated 1,400 vehicles/hr)',
      suggestedAction: 'Manual traffic control override and signal logic reboot.'
    }
  }
];
