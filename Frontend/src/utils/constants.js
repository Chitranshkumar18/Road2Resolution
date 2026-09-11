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
  ASSIGNED: { label: 'Assigned to Org', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-600', step: 3 },
  IN_PROGRESS: { label: 'Work In Progress', color: 'bg-amber-500/20 text-amber-300 border-amber-600', step: 4 },
  PENDING_VERIFICATION: { label: 'Proof Submitted (QA)', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-600', step: 5 },
  RESOLVED: { label: 'Verified & Certified', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-600', step: 6 },
  CLOSED: { label: 'Verified & Closed', color: 'bg-teal-500/20 text-teal-300 border-teal-600', step: 7 },
  REJECTED: { label: 'Rejected / Duplicate', color: 'bg-rose-500/20 text-rose-300 border-rose-600', step: 0 }
};

export const SEVERITY_LEVELS = {
  CRITICAL: { label: 'Critical / Hazard', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40', badge: 'bg-rose-600 text-white', weight: 4 },
  HIGH: { label: 'High Priority', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40', badge: 'bg-amber-600 text-white', weight: 3 },
  MEDIUM: { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', badge: 'bg-yellow-600 text-white', weight: 2 },
  LOW: { label: 'Low Severity', color: 'bg-slate-500/20 text-slate-300 border-slate-500/40', badge: 'bg-slate-600 text-white', weight: 1 }
};

export const INDIAN_STATES_AND_CITIES = [
  {
    state: "Andaman and Nicobar Islands",
    cities: ["Port Blair", "Diglipur", "Garacharma", "Bambooflat"],
    defaultCoords: { lat: 11.6234, lng: 92.7265 }
  },
  {
    state: "Andhra Pradesh",
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Amaravati"],
    defaultCoords: { lat: 15.9129, lng: 79.7400 }
  },
  {
    state: "Arunachal Pradesh",
    cities: ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
    defaultCoords: { lat: 27.0844, lng: 93.6053 }
  },
  {
    state: "Assam",
    cities: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur"],
    defaultCoords: { lat: 26.1445, lng: 91.7362 }
  },
  {
    state: "Bihar",
    cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga"],
    defaultCoords: { lat: 25.5941, lng: 85.1376 }
  },
  {
    state: "Chandigarh",
    cities: ["Chandigarh", "Sector 17", "Sector 35", "Manimajra"],
    defaultCoords: { lat: 30.7333, lng: 76.7794 }
  },
  {
    state: "Chhattisgarh",
    cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
    defaultCoords: { lat: 21.2514, lng: 81.6296 }
  },
  {
    state: "Dadra and Nagar Haveli and Daman and Diu",
    cities: ["Daman", "Diu", "Silvassa", "Vapi"],
    defaultCoords: { lat: 20.4283, lng: 72.8397 }
  },
  {
    state: "Delhi",
    cities: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi"],
    defaultCoords: { lat: 28.6139, lng: 77.2090 }
  },
  {
    state: "Goa",
    cities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    defaultCoords: { lat: 15.4909, lng: 73.8278 }
  },
  {
    state: "Gujarat",
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar"],
    defaultCoords: { lat: 23.0225, lng: 72.5714 }
  },
  {
    state: "Haryana",
    cities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Panchkula", "Rohtak", "Hisar"],
    defaultCoords: { lat: 28.4595, lng: 77.0266 }
  },
  {
    state: "Himachal Pradesh",
    cities: ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu", "Manali"],
    defaultCoords: { lat: 31.1048, lng: 77.1734 }
  },
  {
    state: "Jammu and Kashmir",
    cities: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
    defaultCoords: { lat: 34.0837, lng: 74.7973 }
  },
  {
    state: "Jharkhand",
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Hazaribagh"],
    defaultCoords: { lat: 23.3441, lng: 85.3096 }
  },
  {
    state: "Karnataka",
    cities: ["Bengaluru", "Mysuru", "Hubli-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi", "Ballari"],
    defaultCoords: { lat: 12.9716, lng: 77.5946 }
  },
  {
    state: "Kerala",
    cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"],
    defaultCoords: { lat: 8.5241, lng: 76.9366 }
  },
  {
    state: "Ladakh",
    cities: ["Leh", "Kargil", "Diskit", "Nubra"],
    defaultCoords: { lat: 34.1526, lng: 77.5771 }
  },
  {
    state: "Lakshadweep",
    cities: ["Kavaratti", "Agatti", "Andrott", "Minicoy"],
    defaultCoords: { lat: 10.5667, lng: 72.6417 }
  },
  {
    state: "Madhya Pradesh",
    cities: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa"],
    defaultCoords: { lat: 23.2599, lng: 77.4126 }
  },
  {
    state: "Maharashtra",
    cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Navi Mumbai"],
    defaultCoords: { lat: 19.0760, lng: 72.8777 }
  },
  {
    state: "Manipur",
    cities: ["Imphal", "Churachandpur", "Thoubal", "Kakching"],
    defaultCoords: { lat: 24.8170, lng: 93.9368 }
  },
  {
    state: "Meghalaya",
    cities: ["Shillong", "Tura", "Jowai", "Nongpoh"],
    defaultCoords: { lat: 25.5788, lng: 91.8933 }
  },
  {
    state: "Mizoram",
    cities: ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
    defaultCoords: { lat: 23.7271, lng: 92.7176 }
  },
  {
    state: "Nagaland",
    cities: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
    defaultCoords: { lat: 25.6751, lng: 94.1086 }
  },
  {
    state: "Odisha",
    cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri"],
    defaultCoords: { lat: 20.2961, lng: 85.8245 }
  },
  {
    state: "Puducherry",
    cities: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
    defaultCoords: { lat: 11.9416, lng: 79.8083 }
  },
  {
    state: "Punjab",
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali (SAS Nagar)", "Bathinda", "Pathankot"],
    defaultCoords: { lat: 30.9010, lng: 75.8573 }
  },
  {
    state: "Rajasthan",
    cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur", "Ajmer", "Bhilwara", "Alwar"],
    defaultCoords: { lat: 26.9124, lng: 75.7873 }
  },
  {
    state: "Sikkim",
    cities: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
    defaultCoords: { lat: 27.3389, lng: 88.6065 }
  },
  {
    state: "Tamil Nadu",
    cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore"],
    defaultCoords: { lat: 13.0827, lng: 80.2707 }
  },
  {
    state: "Telangana",
    cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam"],
    defaultCoords: { lat: 17.3850, lng: 78.4867 }
  },
  {
    state: "Tripura",
    cities: ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar"],
    defaultCoords: { lat: 23.8315, lng: 91.2868 }
  },
  {
    state: "Uttar Pradesh",
    cities: ["Lucknow", "Noida", "Ghaziabad", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Bareilly", "Aligarh"],
    defaultCoords: { lat: 26.8467, lng: 80.9462 }
  },
  {
    state: "Uttarakhand",
    cities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee", "Nainital"],
    defaultCoords: { lat: 30.3165, lng: 78.0322 }
  },
  {
    state: "West Bengal",
    cities: ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol", "Bardhaman", "Kharagpur"],
    defaultCoords: { lat: 22.5726, lng: 88.3639 }
  }
];

export const INITIAL_ORGANIZATIONS = [
  // --- DELHI ORGANIZATIONS ---
  {
    id: "org_del_pwd_01",
    name: "Delhi PWD Metropolitan Road Infrastructure Division",
    categoryIds: ["pothole", "drainage", "other"],
    categoryLabels: ["Road Damage & Pothole", "Drainage / Sewage Blockage"],
    state: "Delhi",
    city: "New Delhi",
    district: "North Delhi",
    serviceArea: "North & Central Delhi Ring Road Arterials",
    jurisdictionRadiusKm: 30,
    centerCoords: { lat: 28.6139, lng: 77.2090 },
    activeWorkers: 48,
    slaRating: "96%",
    phone: "+91 11 2336 1234",
    email: "pwd.delhi.north@civicvision.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Er. Rajesh Sharma (Superintending Engineer)"
  },
  {
    id: "org_del_ndmc_02",
    name: "New Delhi Municipal Council (NDMC) Civil Works",
    categoryIds: ["pothole", "streetlight", "garbage"],
    categoryLabels: ["Road Damage & Pothole", "Streetlight Outage", "Garbage Overflow"],
    state: "Delhi",
    city: "New Delhi",
    district: "Central Delhi",
    serviceArea: "Lutyens Delhi & Central Business District",
    jurisdictionRadiusKm: 20,
    centerCoords: { lat: 28.6250, lng: 77.2180 },
    activeWorkers: 35,
    slaRating: "98%",
    phone: "+91 11 2334 5678",
    email: "ndmc.civil@civicvision.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Er. Amit Saxena (Chief Engineer)"
  },
  {
    id: "org_del_djb_03",
    name: "Delhi Jal Board (DJB) Emergency Pipeline & Sewerage",
    categoryIds: ["water_leak", "drainage"],
    categoryLabels: ["Water Leakage / Pipe Burst", "Drainage / Sewage Blockage"],
    state: "Delhi",
    city: "New Delhi",
    district: "All Delhi Districts",
    serviceArea: "All Delhi NCR Metropolitan Sluice Network",
    jurisdictionRadiusKm: 40,
    centerCoords: { lat: 28.6200, lng: 77.2100 },
    activeWorkers: 42,
    slaRating: "92%",
    phone: "+91 11 2352 9000",
    email: "djb.emergency@civicvision.gov.in",
    type: "STATE_AGENCY",
    headOfOrg: "Er. Priya Nair (Executive Director)"
  },
  {
    id: "org_del_bses_04",
    name: "BSES Yamuna Electrical Grid & Streetlight Corps",
    categoryIds: ["streetlight", "traffic_signal"],
    categoryLabels: ["Streetlight Outage", "Traffic Signal Failure"],
    state: "Delhi",
    city: "East Delhi",
    district: "East & South Delhi",
    serviceArea: "Trans-Yamuna & South Delhi Feeder Pillars",
    jurisdictionRadiusKm: 25,
    centerCoords: { lat: 28.6010, lng: 77.2020 },
    activeWorkers: 29,
    slaRating: "97%",
    phone: "+91 11 3999 9707",
    email: "bses.streetlight@civicvision.gov.in",
    type: "PRIVATE_CONTRACTOR",
    headOfOrg: "Er. Amit Verma (Grid Superintendent)"
  },
  {
    id: "org_del_mcd_05",
    name: "MCD Solid Waste Management & Sanitation Wing",
    categoryIds: ["garbage", "illegal_dumping"],
    categoryLabels: ["Garbage & Waste Overflow", "Illegal Debris Dumping"],
    state: "Delhi",
    city: "New Delhi",
    district: "East Delhi",
    serviceArea: "East & North Delhi Municipal Zones",
    jurisdictionRadiusKm: 35,
    centerCoords: { lat: 28.6090, lng: 77.2270 },
    activeWorkers: 65,
    slaRating: "91%",
    phone: "+91 11 2322 8000",
    email: "mcd.sanitation@civicvision.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Sunita Rao (Sanitation Director)"
  },

  // --- PUNJAB ORGANIZATIONS ---
  {
    id: "org_pun_pwd_01",
    name: "Punjab PWD & Infrastructure Development Board (Ludhiana)",
    categoryIds: ["pothole", "drainage", "other"],
    categoryLabels: ["Road Damage & Pothole", "Drainage / Sewage Blockage"],
    state: "Punjab",
    city: "Ludhiana",
    district: "Ludhiana",
    serviceArea: "Ludhiana Metropolitan Urban & GT Road Fringe",
    jurisdictionRadiusKm: 35,
    centerCoords: { lat: 30.9010, lng: 75.8573 },
    activeWorkers: 38,
    slaRating: "93%",
    phone: "+91 161 240 1234",
    email: "pwd.ludhiana@punjab.gov.in",
    type: "STATE_AGENCY",
    headOfOrg: "Er. Gurpreet Singh (Chief Engineer)"
  },
  {
    id: "org_pun_mc_02",
    name: "Municipal Corporation Ludhiana (MCL) Civil & Sanitation",
    categoryIds: ["pothole", "garbage", "drainage", "streetlight"],
    categoryLabels: ["Road Damage & Pothole", "Garbage Overflow", "Streetlight Outage"],
    state: "Punjab",
    city: "Ludhiana",
    district: "Ludhiana",
    serviceArea: "Zones A, B, C & D Ludhiana City",
    jurisdictionRadiusKm: 25,
    centerCoords: { lat: 30.9100, lng: 75.8500 },
    activeWorkers: 54,
    slaRating: "90%",
    phone: "+91 161 240 5678",
    email: "mcl.works@punjab.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Sardar Manjit Singh (Commissioner)"
  },
  {
    id: "org_pun_amr_03",
    name: "Amritsar Municipal Development Authority (Roads & Lights)",
    categoryIds: ["pothole", "streetlight", "traffic_signal"],
    categoryLabels: ["Road Damage & Pothole", "Streetlight Outage", "Traffic Signal"],
    state: "Punjab",
    city: "Amritsar",
    district: "Amritsar",
    serviceArea: "Heritage Corridor & Greater Amritsar",
    jurisdictionRadiusKm: 30,
    centerCoords: { lat: 31.6340, lng: 74.8723 },
    activeWorkers: 32,
    slaRating: "94%",
    phone: "+91 183 250 8900",
    email: "amritsar.civic@punjab.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Er. Harpreet Kaur (Joint Director)"
  },

  // --- MAHARASHTRA ORGANIZATIONS ---
  {
    id: "org_mh_bmc_01",
    name: "Brihanmumbai Municipal Corporation (BMC) Roads & Pavement",
    categoryIds: ["pothole", "drainage", "other"],
    categoryLabels: ["Road Damage & Pothole", "Drainage / Sewage Blockage"],
    state: "Maharashtra",
    city: "Mumbai",
    district: "Mumbai Suburbs",
    serviceArea: "Western & Eastern Express Highways & Suburbs",
    jurisdictionRadiusKm: 40,
    centerCoords: { lat: 19.0760, lng: 72.8777 },
    activeWorkers: 72,
    slaRating: "95%",
    phone: "+91 22 2262 0251",
    email: "bmc.roads@mcgm.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Er. Sunil Joshi (Chief Engineer Roads)"
  },
  {
    id: "org_mh_pmc_02",
    name: "Pune Municipal Corporation (PMC) Road Maintenance Cell",
    categoryIds: ["pothole", "water_leak", "streetlight"],
    categoryLabels: ["Road Damage & Pothole", "Water Leakage", "Streetlight Outage"],
    state: "Maharashtra",
    city: "Pune",
    district: "Pune",
    serviceArea: "PMC & Kothrud / Hadapsar / Baner Sectors",
    jurisdictionRadiusKm: 30,
    centerCoords: { lat: 18.5204, lng: 73.8567 },
    activeWorkers: 40,
    slaRating: "92%",
    phone: "+91 20 2550 1000",
    email: "pmc.roadcell@punecorporation.org",
    type: "MUNICIPAL",
    headOfOrg: "Er. Sanjay Kulkarni (Executive Engineer)"
  },

  // --- KARNATAKA ORGANIZATIONS ---
  {
    id: "org_ka_bbmp_01",
    name: "Bruhat Bengaluru Mahanagara Palike (BBMP) Infrastructure Division",
    categoryIds: ["pothole", "drainage", "water_leak"],
    categoryLabels: ["Road Damage & Pothole", "Drainage / Sewage", "Water Leakage"],
    state: "Karnataka",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    serviceArea: "ORR, Whitefield, Koramangala & Central Bengaluru",
    jurisdictionRadiusKm: 35,
    centerCoords: { lat: 12.9716, lng: 77.5946 },
    activeWorkers: 60,
    slaRating: "93%",
    phone: "+91 80 2266 0000",
    email: "bbmp.infra@bbmp.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Er. Ramesh Babu (Chief Engineer)"
  },

  // --- UTTAR PRADESH ORGANIZATIONS ---
  {
    id: "org_up_pwd_01",
    name: "UP PWD & Smart City Lucknow Road Management",
    categoryIds: ["pothole", "drainage", "streetlight"],
    categoryLabels: ["Road Damage & Pothole", "Drainage", "Streetlight Outage"],
    state: "Uttar Pradesh",
    city: "Lucknow",
    district: "Lucknow",
    serviceArea: "Gomti Nagar, Hazratganj & Greater Lucknow",
    jurisdictionRadiusKm: 30,
    centerCoords: { lat: 26.8467, lng: 80.9462 },
    activeWorkers: 44,
    slaRating: "91%",
    phone: "+91 522 223 9000",
    email: "uppwd.lucknow@up.gov.in",
    type: "STATE_AGENCY",
    headOfOrg: "Er. Alok Pandey (Chief Engineer)"
  },
  {
    id: "org_up_noida_02",
    name: "Noida & Greater Noida Development Authority (Civil)",
    categoryIds: ["pothole", "traffic_signal", "streetlight", "garbage"],
    categoryLabels: ["Road Damage", "Traffic Signal", "Streetlight", "Garbage"],
    state: "Uttar Pradesh",
    city: "Noida",
    district: "Gautam Buddha Nagar",
    serviceArea: "Noida Expressway & Sectors 1-150",
    jurisdictionRadiusKm: 25,
    centerCoords: { lat: 28.5355, lng: 77.3910 },
    activeWorkers: 50,
    slaRating: "97%",
    phone: "+91 120 242 5025",
    email: "noida.civil@noidaauthorityonline.com",
    type: "MUNICIPAL",
    headOfOrg: "Er. Rajiv Tyagi (General Manager)"
  },

  // --- TAMIL NADU ORGANIZATIONS ---
  {
    id: "org_tn_gcc_01",
    name: "Greater Chennai Corporation (GCC) Bridges & Road Department",
    categoryIds: ["pothole", "drainage", "streetlight"],
    categoryLabels: ["Road Damage & Pothole", "Drainage", "Streetlight Outage"],
    state: "Tamil Nadu",
    city: "Chennai",
    district: "Chennai",
    serviceArea: "North, Central & South Chennai Zones",
    jurisdictionRadiusKm: 35,
    centerCoords: { lat: 13.0827, lng: 80.2707 },
    activeWorkers: 55,
    slaRating: "94%",
    phone: "+91 44 2538 4520",
    email: "gcc.roads@chennaicorporation.gov.in",
    type: "MUNICIPAL",
    headOfOrg: "Er. S. Radhakrishnan (Chief Engineer)"
  }
];

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
    assignedOrgId: 'org_del_pwd_01',
    assignedOrgName: 'Delhi PWD Metropolitan Road Infrastructure Division',
    responsibleType: 'ORGANIZATION',
    responsibleName: 'Ramesh Verma (Field Tech #4)',
    responsibleOrgName: 'Delhi PWD Metropolitan Road Infrastructure Division',
    location: {
      address: 'Outer Ring Road, Near Junction 14, Sector 5',
      state: 'Delhi',
      city: 'New Delhi',
      district: 'North Delhi',
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
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 18).toISOString(), note: 'Submitted with GPS coordinates and photo in Delhi.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 17).toISOString(), note: 'AI classified as Critical Pothole (96.8% confidence, 94 Priority Score).' },
      { status: 'Assigned to Org', time: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'Admin assigned to Delhi PWD Metropolitan Road Infrastructure Division based on Delhi location jurisdiction.' },
      { status: 'Work In Progress', time: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Organization field unit commenced cold bitumen patch operations on site.' }
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
    assignedOrgId: 'org_del_djb_03',
    assignedOrgName: 'Delhi Jal Board (DJB) Emergency Pipeline & Sewerage',
    responsibleType: 'ORGANIZATION',
    responsibleName: 'DJB Valve Emergency Squad',
    responsibleOrgName: 'Delhi Jal Board (DJB) Emergency Pipeline & Sewerage',
    location: {
      address: 'Main Market Road, Opp. Metro Pillar 112',
      state: 'Delhi',
      city: 'New Delhi',
      district: 'Central Delhi',
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
      { status: 'Assigned to Org', time: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'Assigned to Delhi Jal Board (DJB) Emergency Pipeline & Sewerage.' }
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
    assignedOfficer: null,
    assignedOrgId: null,
    assignedOrgName: null,
    responsibleType: null,
    responsibleName: null,
    responsibleOrgName: null,
    location: {
      address: 'School Lane, Block B, Green Park',
      state: 'Delhi',
      city: 'South Delhi',
      district: 'South Delhi',
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
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 24).toISOString(), note: 'Community flagged dark corridor hazard in South Delhi.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 23).toISOString(), note: 'AI validated LED luminaire fuse burnout & zone vulnerability. Open for Org Assignment or Public Volunteer.' }
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
    assignedOrgId: 'org_del_mcd_05',
    assignedOrgName: 'MCD Solid Waste Management & Sanitation Wing',
    responsibleType: 'ORGANIZATION',
    responsibleName: 'Sunil Paswan (Field Lead)',
    responsibleOrgName: 'MCD Solid Waste Management & Sanitation Wing',
    location: {
      address: 'Near Community Center, Pocket 3, Mayur Vihar',
      state: 'Delhi',
      city: 'East Delhi',
      district: 'East Delhi',
      lat: 28.6090,
      lng: 77.2270,
      zone: 'East Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
    workerSubmission: {
      submittedBy: 'ORGANIZATION',
      workerName: 'Sunil Paswan (Field Contractor)',
      workerEmail: 'worker@civicvision.ai',
      organizationName: 'MCD Solid Waste Management & Sanitation Wing',
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
      verificationNotes: 'Admin certified: Area sanitized, waste container emptied, and roadway restored cleanly by MCD Sanitation Wing.',
      verifiedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      verifiedBy: 'Er. Rajesh Sharma (Municipal Admin)',
      completedByEntity: {
        type: 'ORGANIZATION',
        name: 'Sunil Paswan',
        organizationName: 'MCD Solid Waste Management & Sanitation Wing'
      }
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Priya Mukherjee (Local Resident)',
        rating: 5,
        comment: 'Outstanding prompt action by MCD Solid Waste! The area was cleared within hours of reporting and fully disinfected. Thank you to the field workers!',
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
      { status: 'Assigned to Org', time: new Date(Date.now() - 3600000 * 30).toISOString(), note: 'Assigned to MCD Solid Waste Management & Sanitation Wing.' },
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
    assignedOrgId: 'org_del_bses_04',
    assignedOrgName: 'BSES Yamuna Electrical Grid & Streetlight Corps',
    responsibleType: 'ORGANIZATION',
    responsibleName: 'BSES Rapid Signal Tech',
    responsibleOrgName: 'BSES Yamuna Electrical Grid & Streetlight Corps',
    location: {
      address: 'Kalyan Marg & Gandhi Road Intersection',
      state: 'Delhi',
      city: 'Central Delhi',
      district: 'Central Delhi',
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
      { status: 'Assigned to Org', time: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Assigned to BSES Yamuna Electrical Grid & Streetlight Corps.' }
    ],
    aiDetection: {
      detectedObjects: ['Signal Controller Unit', 'All-Red Flashing Sequence', 'High Vehicle Density'],
      safetyHazardIndex: 9.8,
      trafficImpactFactor: 'Severe Gridlock (Estimated 1,400 vehicles/hr)',
      suggestedAction: 'Manual traffic control override and signal logic reboot.'
    }
  },
  {
    id: 'CIV-2026-8946',
    userId: 'usr_citizen_gurpreet',
    title: 'Broken Paver Blocks and Sunken Road Section near Ludhiana Clock Tower',
    description: 'Heavy commercial freight caused interlock paving blocks to cave in creating a severe depression near the heritage clock tower square in Ludhiana.',
    category: 'pothole',
    severity: 'HIGH',
    status: 'RESOLVED',
    priorityScore: 89,
    aiConfidence: 96.5,
    department: 'Public Works (PWD)',
    assignedOfficer: 'Er. Gurpreet Singh',
    assignedOrgId: 'org_pun_pwd_01',
    assignedOrgName: 'Punjab PWD & Infrastructure Development Board (Ludhiana)',
    responsibleType: 'PUBLIC_INDIVIDUAL',
    responsibleName: 'Harpreet Singh (Civic Volunteer Squad)',
    responsibleOrgName: null,
    location: {
      address: 'Clock Tower Chowk, GT Road, Ludhiana',
      state: 'Punjab',
      city: 'Ludhiana',
      district: 'Ludhiana',
      lat: 30.9010,
      lng: 75.8573,
      zone: 'Central Market Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
    workerSubmission: {
      submittedBy: 'PUBLIC_INDIVIDUAL',
      workerName: 'Harpreet Singh (Public Citizen Volunteer)',
      workerEmail: 'harpreet.volunteer@example.com',
      organizationName: null,
      isVolunteer: true,
      afterImageUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
      materialsUsed: 'High-strength concrete paver interlocking blocks, sand compaction & edge kerb alignment',
      repairNotes: 'Local community youth volunteer group leveled the sand sub-base, relaid 80mm heavy-duty paver blocks, and sealed the joints. Traffic restored smoothly!',
      gpsVerification: {
        verified: true,
        distanceMeters: 45,
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      submittedAt: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    repairAudit: {
      verified: true,
      confidenceScore: 98.1,
      verificationNotes: 'Admin QA Certified: Excellent citizen volunteer initiative! Paver blocks accurately aligned, compacted, and leveled conforming to Ludhiana PWD standards.',
      verifiedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      verifiedBy: 'Er. Gurpreet Singh (Municipal Admin)',
      completedByEntity: {
        type: 'PUBLIC_INDIVIDUAL',
        name: 'Harpreet Singh (Civic Volunteer Squad)',
        organizationName: null
      }
    },
    reviews: [
      {
        id: 'rev-3',
        author: 'Jaswant Singh (Ludhiana Merchant Association)',
        rating: 5,
        comment: 'Incredible initiative by Harpreet Singh and the local volunteers! They fixed this hazard overnight without waiting for municipal delays. Hats off to active public citizenship!',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        role: 'Local Business Owner'
      }
    ],
    reporter: {
      id: 'usr_citizen_gurpreet',
      _id: 'usr_citizen_gurpreet',
      name: 'Gurpreet Kaur',
      email: 'gurpreet.k@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      reputation: 430
    },
    upvotes: 52,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 36).toISOString(), note: 'Reported hazard in Ludhiana, Punjab.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 35).toISOString(), note: 'AI classified as High Severity Paver Road Defect.' },
      { status: 'Work Accepted by Volunteer', time: new Date(Date.now() - 3600000 * 20).toISOString(), note: 'Public Citizen Harpreet Singh volunteered to take responsibility for completing the fix.' },
      { status: 'Volunteer Submitted Proof', time: new Date(Date.now() - 3600000 * 8).toISOString(), note: 'Harpreet Singh completed paver relaying on-site and submitted photo proof with 45m GPS verification.' },
      { status: 'Repair Certified & Published', time: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'Admin officially certified volunteer work and published resolution to Public Portal.' }
    ],
    aiDetection: {
      detectedObjects: ['Sunken Paver Section', 'Pavement Depression (15cm)', 'Pedestrian Hazard'],
      safetyHazardIndex: 8.6,
      trafficImpactFactor: 'High (Commercial Hub)',
      suggestedAction: 'Re-lay interlocking pavers with stone dust compaction.'
    }
  },
  {
    id: 'CIV-2026-8947',
    userId: 'usr_citizen_sneha',
    title: 'Extensive Monsoon Pothole Stretch on Western Express Highway',
    description: 'Multiple deep potholes formed on the south-bound flyover ramp near Andheri, slowing peak-hour traffic and posing severe skid hazards for two-wheelers.',
    category: 'pothole',
    severity: 'CRITICAL',
    status: 'ASSIGNED',
    priorityScore: 92,
    aiConfidence: 97.4,
    department: 'Public Works (PWD)',
    assignedOfficer: 'Er. Sunil Joshi',
    assignedOrgId: 'org_mh_bmc_01',
    assignedOrgName: 'Brihanmumbai Municipal Corporation (BMC) Roads & Pavement',
    responsibleType: 'ORGANIZATION',
    responsibleName: 'BMC Rapid Pothole Squad #3',
    responsibleOrgName: 'Brihanmumbai Municipal Corporation (BMC) Roads & Pavement',
    location: {
      address: 'Western Express Highway, Andheri East Flyover Ramp',
      state: 'Maharashtra',
      city: 'Mumbai',
      district: 'Mumbai Suburbs',
      lat: 19.1136,
      lng: 72.8697,
      zone: 'Western Suburbs Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: null,
    reporter: {
      id: 'usr_citizen_sneha',
      _id: 'usr_citizen_sneha',
      name: 'Sneha Kulkarni',
      email: 'sneha.k@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      reputation: 310
    },
    upvotes: 74,
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 14).toISOString(), note: 'Reported hazard in Mumbai, Maharashtra.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 13).toISOString(), note: 'AI validated multi-crater road degradation on highway arterial.' },
      { status: 'Assigned to Org', time: new Date(Date.now() - 3600000 * 3).toISOString(), note: 'Admin assigned to Brihanmumbai Municipal Corporation (BMC) Roads & Pavement.' }
    ],
    aiDetection: {
      detectedObjects: ['Highway Pothole Cluster', 'Asphalt Delamination', 'High Speed Transit Zone'],
      safetyHazardIndex: 9.3,
      trafficImpactFactor: 'Severe (1,600 vehicles/hr)',
      suggestedAction: 'Deploy hot-mix mastic asphalt repair crew and warning signs.'
    }
  },
  {
    id: 'CIV-2026-8948',
    userId: 'usr_citizen_kiran',
    title: 'Severe Drainage Clog and Waterlogging on Outer Ring Road',
    description: 'Underground stormwater drain choked with construction silt causing 1.5 ft waterlogging across 3 lanes near Bellandur tech corridor.',
    category: 'drainage',
    severity: 'HIGH',
    status: 'IN_PROGRESS',
    priorityScore: 89,
    aiConfidence: 95.7,
    department: 'Sanitation & Water',
    assignedOfficer: 'Er. Ramesh Babu',
    assignedOrgId: 'org_ka_bbmp_01',
    assignedOrgName: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Infrastructure Division',
    responsibleType: 'ORGANIZATION',
    responsibleName: 'BBMP Stormwater Silt Desilting Crew',
    responsibleOrgName: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Infrastructure Division',
    location: {
      address: 'Outer Ring Road, Near Bellandur Flyover Junction',
      state: 'Karnataka',
      city: 'Bengaluru',
      district: 'Bengaluru Urban',
      lat: 12.9352,
      lng: 77.6844,
      zone: 'Mahadevapura Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: null,
    reporter: {
      id: 'usr_citizen_kiran',
      _id: 'usr_citizen_kiran',
      name: 'Kiran Rao',
      email: 'kiran.rao@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      reputation: 280
    },
    upvotes: 56,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 20).toISOString(), note: 'Reported waterlogging in Bengaluru, Karnataka.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 19).toISOString(), note: 'AI classified as Heavy Drainage Obstruction.' },
      { status: 'Assigned to Org', time: new Date(Date.now() - 3600000 * 10).toISOString(), note: 'Assigned to BBMP Infrastructure Division.' },
      { status: 'Work In Progress', time: new Date(Date.now() - 3600000 * 5).toISOString(), note: 'Suction and super-sucker de-silting machines operating on-site.' }
    ],
    aiDetection: {
      detectedObjects: ['Choked Stormwater Inlet', 'Standing Water Pool (Depth: 45cm)', 'Traffic Congestion'],
      safetyHazardIndex: 8.7,
      trafficImpactFactor: 'High Gridlock',
      suggestedAction: 'Super-sucker desilting jetting machine and stormwater culvert unclogging.'
    }
  },
  {
    id: 'CIV-2026-8949',
    userId: 'usr_citizen_aditya',
    title: 'Broken Divider Kerb and Exposed Steel Rebar in Hazratganj',
    description: 'Damaged median divider with sharp exposed metal rebar protruding into the right lane near Hazratganj crossing.',
    category: 'pothole',
    severity: 'HIGH',
    status: 'ASSIGNED',
    priorityScore: 85,
    aiConfidence: 94.8,
    department: 'Public Works (PWD)',
    assignedOfficer: 'Er. Alok Pandey',
    assignedOrgId: 'org_up_pwd_01',
    assignedOrgName: 'UP PWD & Smart City Lucknow Road Management',
    responsibleType: 'ORGANIZATION',
    responsibleName: 'Lucknow PWD Rapid Road Squad',
    responsibleOrgName: 'UP PWD & Smart City Lucknow Road Management',
    location: {
      address: 'Hazratganj Main Corridor, Near GPO Roundabout',
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      district: 'Lucknow',
      lat: 26.8500,
      lng: 80.9400,
      zone: 'Hazratganj Heritage Zone'
    },
    imageUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?w=800&auto=format&fit=crop&q=80',
    repairVerificationUrl: null,
    reporter: {
      id: 'usr_citizen_aditya',
      _id: 'usr_citizen_aditya',
      name: 'Aditya Srivastava',
      email: 'aditya.s@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      reputation: 350
    },
    upvotes: 42,
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    timeline: [
      { status: 'Reported', time: new Date(Date.now() - 3600000 * 16).toISOString(), note: 'Reported median hazard in Lucknow, Uttar Pradesh.' },
      { status: 'AI Verified', time: new Date(Date.now() - 3600000 * 15).toISOString(), note: 'Vision AI flagged exposed steel rebar and broken concrete barrier.' },
      { status: 'Assigned to Org', time: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'Assigned to UP PWD & Smart City Lucknow Road Management.' }
    ],
    aiDetection: {
      detectedObjects: ['Broken Concrete Median', 'Exposed Steel Rebar', 'Right Turning Lane Risk'],
      safetyHazardIndex: 8.4,
      trafficImpactFactor: 'Medium',
      suggestedAction: 'Cut exposed rebar flush, cast precast concrete kerb unit, and paint retroreflective hazard stripes.'
    }
  }
];
