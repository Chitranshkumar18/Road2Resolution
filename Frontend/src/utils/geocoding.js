import { INDIAN_STATES_AND_CITIES } from './constants.js';
import { calculateDistanceKm } from './helpers.js';

// In-memory cache to prevent redundant network lookups
const geocodeCache = new Map();

/**
 * Detailed directory of Indian cities, districts, pincodes, and prominent urban corridors
 * with exact coordinate centers for high-accuracy complete address resolution.
 */
const INDIAN_CITY_CENTERS = [
  // --- UTTAR PRADESH ---
  {
    name: "Meerut",
    state: "Uttar Pradesh",
    district: "Meerut District",
    pincode: "250001",
    lat: 28.9845,
    lng: 77.7064,
    landmarks: [
      { name: "Baghpat Road", area: "Multan Nagar", road: "Baghpat Road", lat: 28.9705, lng: 77.6633, pincode: "250002" },
      { name: "Begum Bridge", area: "Sadar Bazaar", road: "Abu Lane", lat: 28.9880, lng: 77.7020, pincode: "250001" },
      { name: "Civil Lines", area: "Civil Lines", road: "Circuit House Road", lat: 28.9950, lng: 77.7120, pincode: "250001" },
      { name: "Shastri Nagar", area: "Shastri Nagar Sector 1", road: "Garh Road", lat: 28.9680, lng: 77.7340, pincode: "250004" },
      { name: "Delhi-Meerut Expressway", area: "Partapur Bypass", road: "Delhi-Meerut Expressway Corridor", lat: 28.9740, lng: 77.6400, pincode: "250103" },
      { name: "Modipuram", area: "Pallavpuram", road: "Roorkee Road NH-58", lat: 29.0600, lng: 77.7100, pincode: "250110" },
      { name: "Ganga Nagar", area: "Pocket A", road: "Mawana Road", lat: 28.9920, lng: 77.7650, pincode: "250001" },
      { name: "Transport Nagar", area: "Madhavpuram", road: "Hapur Road", lat: 28.9550, lng: 77.7200, pincode: "250002" },
      { name: "Meerut Cantt", area: "The Mall", road: "Mall Road", lat: 28.9980, lng: 77.6950, pincode: "250001" }
    ]
  },
  {
    name: "Noida",
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar District",
    pincode: "201301",
    lat: 28.5355,
    lng: 77.3910,
    landmarks: [
      { name: "Sector 62", area: "Electronic City", road: "Sector 62 Main Road", lat: 28.6270, lng: 77.3650, pincode: "201309" },
      { name: "Expressway", area: "Sector 137", road: "Noida-Greater Noida Expressway", lat: 28.5050, lng: 77.4080, pincode: "201305" },
      { name: "Sector 18", area: "Atta Market", road: "Captain Vijyant Thapar Marg", lat: 28.5700, lng: 77.3220, pincode: "201301" },
      { name: "Sector 50", area: "Sector 50 Block B", road: "Golf Course Road", lat: 28.5750, lng: 77.3650, pincode: "201307" }
    ]
  },
  {
    name: "Greater Noida",
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar District",
    pincode: "201310",
    lat: 28.4744,
    lng: 77.5040,
    landmarks: [
      { name: "Pari Chowk", area: "Alpha 1 Commercial Belt", road: "Surajpur Kasna Road", lat: 28.4650, lng: 77.5100, pincode: "201310" },
      { name: "Knowledge Park III", area: "Institutional Area", road: "Knowledge Park Road", lat: 28.4590, lng: 77.4980, pincode: "201306" }
    ]
  },
  {
    name: "Ghaziabad",
    state: "Uttar Pradesh",
    district: "Ghaziabad District",
    pincode: "201001",
    lat: 28.6692,
    lng: 77.4538,
    landmarks: [
      { name: "Indirapuram", area: "Ahinsa Khand 2", road: "Kala Patthar Road", lat: 28.6410, lng: 77.3750, pincode: "201014" },
      { name: "Vaishali", area: "Sector 4", road: "Maharaja Agrasen Marg", lat: 28.6480, lng: 77.3400, pincode: "201010" },
      { name: "Raj Nagar Extension", area: "Noor Nagar", road: "NH-58 Bypass Road", lat: 28.7050, lng: 77.4350, pincode: "201017" },
      { name: "Vasundhara", area: "Sector 11", road: "Madan Mohan Malviya Marg", lat: 28.6610, lng: 77.3720, pincode: "201012" }
    ]
  },
  {
    name: "Lucknow",
    state: "Uttar Pradesh",
    district: "Lucknow District",
    pincode: "226001",
    lat: 26.8467,
    lng: 80.9462,
    landmarks: [
      { name: "Hazratganj", area: "Mayfair Crossing", road: "Mahatma Gandhi Marg", lat: 26.8500, lng: 80.9400, pincode: "226001" },
      { name: "Gomti Nagar", area: "Vibhav Khand", road: "Shaheed Path / Lohia Path", lat: 26.8480, lng: 81.0100, pincode: "226010" },
      { name: "Alambagh", area: "Chander Nagar", road: "Kanpur Road", lat: 26.8150, lng: 80.9050, pincode: "226005" },
      { name: "Indira Nagar", area: "Sector 14", road: "Ring Road", lat: 26.8820, lng: 80.9850, pincode: "226016" }
    ]
  },
  {
    name: "Kanpur",
    state: "Uttar Pradesh",
    district: "Kanpur Nagar District",
    pincode: "208001",
    lat: 26.4499,
    lng: 80.3319,
    landmarks: [
      { name: "Civil Lines", area: "VIP Road Area", road: "Mall Road", lat: 26.4720, lng: 80.3510, pincode: "208001" },
      { name: "Swaroop Nagar", area: "Aryanagar Crossing", road: "Khalasi Line Road", lat: 26.4820, lng: 80.3150, pincode: "208002" },
      { name: "Kakadeo", area: "Coaching Hub", road: "Geeta Nagar Main Road", lat: 26.4850, lng: 80.2980, pincode: "208025" }
    ]
  },
  {
    name: "Agra",
    state: "Uttar Pradesh",
    district: "Agra District",
    pincode: "282001",
    lat: 27.1767,
    lng: 78.0081,
    landmarks: [
      { name: "Sanjay Place", area: "Commercial Centre", road: "MG Road", lat: 27.2020, lng: 77.9980, pincode: "282002" },
      { name: "Tajganj", area: "VIP Corridor", road: "Fatehabad Road", lat: 27.1680, lng: 78.0400, pincode: "282001" }
    ]
  },
  {
    name: "Varanasi",
    state: "Uttar Pradesh",
    district: "Varanasi District",
    pincode: "221001",
    lat: 25.3176,
    lng: 82.9739,
    landmarks: [
      { name: "BHU Gate", area: "Lanka", road: "University Road", lat: 25.2800, lng: 82.9980, pincode: "221005" },
      { name: "Cantonment", area: "Station Road", road: "Vidyapeeth Road", lat: 25.3300, lng: 82.9800, pincode: "221002" }
    ]
  },
  {
    name: "Prayagraj",
    state: "Uttar Pradesh",
    district: "Prayagraj District",
    pincode: "211001",
    lat: 25.4358,
    lng: 81.8463,
    landmarks: [
      { name: "Civil Lines", area: "Subhash Chauraha", road: "MG Marg", lat: 25.4520, lng: 81.8340, pincode: "211001" }
    ]
  },

  // --- DELHI NCR ---
  {
    name: "New Delhi",
    state: "Delhi",
    district: "Central Delhi District",
    pincode: "110001",
    lat: 28.6139,
    lng: 77.2090,
    landmarks: [
      { name: "Ring Road", area: "Sector 5", road: "Outer Ring Road", lat: 28.6159, lng: 77.2084, pincode: "110001" },
      { name: "Connaught Place", area: "Block A", road: "Inner Circle", lat: 28.6315, lng: 77.2167, pincode: "110001" },
      { name: "Metro Pillar 112", area: "Pahar Ganj", road: "Main Market Road", lat: 28.6250, lng: 77.2180, pincode: "110055" },
      { name: "India Gate", area: "Central Vista", road: "Kartavya Path", lat: 28.6129, lng: 77.2295, pincode: "110004" },
      { name: "Barakhamba", area: "Statesman House", road: "Barakhamba Road", lat: 28.6280, lng: 77.2250, pincode: "110001" }
    ]
  },
  {
    name: "South Delhi",
    state: "Delhi",
    district: "South Delhi District",
    pincode: "110016",
    lat: 28.5400,
    lng: 77.2000,
    landmarks: [
      { name: "Green Park", area: "Block B", road: "School Lane", lat: 28.6010, lng: 77.2020, pincode: "110016" },
      { name: "Hauz Khas", area: "Village Complex", road: "Sri Aurobindo Marg", lat: 28.5530, lng: 77.1940, pincode: "110016" },
      { name: "Saket", area: "District Centre", road: "Press Enclave Marg", lat: 28.5280, lng: 77.2180, pincode: "110017" },
      { name: "Lajpat Nagar", area: "Central Market", road: "Feroze Gandhi Road", lat: 28.5700, lng: 77.2400, pincode: "110024" }
    ]
  },
  {
    name: "East Delhi",
    state: "Delhi",
    district: "East Delhi District",
    pincode: "110091",
    lat: 28.6280,
    lng: 77.2789,
    landmarks: [
      { name: "Mayur Vihar", area: "Pocket 3, Phase 1", road: "Community Center Road", lat: 28.6090, lng: 77.2270, pincode: "110091" },
      { name: "Laxmi Nagar", area: "Main Market", road: "Vikas Marg", lat: 28.6350, lng: 77.2770, pincode: "110092" },
      { name: "Preet Vihar", area: "Commercial Complex", road: "Swasthya Vihar Road", lat: 28.6430, lng: 77.2950, pincode: "110092" }
    ]
  },
  {
    name: "North Delhi",
    state: "Delhi",
    district: "North Delhi District",
    pincode: "110085",
    lat: 28.7041,
    lng: 77.1025,
    landmarks: [
      { name: "Rohini", area: "Sector 14", road: "Bhagwan Mahavir Marg", lat: 28.7120, lng: 77.1250, pincode: "110085" },
      { name: "Model Town", area: "Phase 2", road: "Grand Trunk Road", lat: 28.7020, lng: 77.1930, pincode: "110009" },
      { name: "Pitampura", area: "Netaji Subhash Place", road: "Ring Road", lat: 28.6980, lng: 77.1400, pincode: "110034" }
    ]
  },

  // --- HARYANA ---
  {
    name: "Gurugram",
    state: "Haryana",
    district: "Gurugram District",
    pincode: "122001",
    lat: 28.4595,
    lng: 77.0266,
    landmarks: [
      { name: "Cyber Hub", area: "DLF Phase 2", road: "Cyber City Boulevard", lat: 28.4950, lng: 77.0890, pincode: "122002" },
      { name: "Golf Course Extension", area: "Sector 56", road: "Golf Course Extension Road", lat: 28.4250, lng: 77.0980, pincode: "122011" },
      { name: "Subhash Chowk", area: "Sector 48", road: "Sohna Road", lat: 28.4280, lng: 77.0420, pincode: "122018" },
      { name: "MG Road", area: "Heritage City", road: "Mehrauli-Gurgaon Road", lat: 28.4800, lng: 77.0800, pincode: "122002" }
    ]
  },
  {
    name: "Faridabad",
    state: "Haryana",
    district: "Faridabad District",
    pincode: "121001",
    lat: 28.4089,
    lng: 77.3178,
    landmarks: [
      { name: "Mathura Road", area: "Sector 20", road: "Delhi-Agra NH-44", lat: 28.4100, lng: 77.3100, pincode: "121002" },
      { name: "Sector 15", area: "Sector 15 Market", road: "Neelam Bata Road", lat: 28.4200, lng: 77.3250, pincode: "121007" }
    ]
  },

  // --- PUNJAB ---
  {
    name: "Ludhiana",
    state: "Punjab",
    district: "Ludhiana District",
    pincode: "141001",
    lat: 30.9010,
    lng: 75.8573,
    landmarks: [
      { name: "Clock Tower", area: "Old City", road: "Grand Trunk Road", lat: 30.9010, lng: 75.8573, pincode: "141008" },
      { name: "Model Town", area: "Block C", road: "Gol Market Road", lat: 30.8850, lng: 75.8340, pincode: "141002" },
      { name: "Ferozepur Road", area: "Sarabha Nagar", road: "Ferozepur Elevated Corridor", lat: 30.9050, lng: 75.8200, pincode: "141001" }
    ]
  },
  {
    name: "Amritsar",
    state: "Punjab",
    district: "Amritsar District",
    pincode: "143001",
    lat: 31.6340,
    lng: 74.8723,
    landmarks: [
      { name: "Heritage Street", area: "Town Hall Corridor", road: "Golden Temple Road", lat: 31.6210, lng: 74.8760, pincode: "143006" },
      { name: "Ranjit Avenue", area: "Block B", road: "Albert Road", lat: 31.6520, lng: 74.8580, pincode: "143001" }
    ]
  },
  {
    name: "Mohali",
    state: "Punjab",
    district: "SAS Nagar District",
    pincode: "160055",
    lat: 30.7046,
    lng: 76.7179,
    landmarks: [
      { name: "Phase 7", area: "Sector 61", road: "Kumbra Chowk Road", lat: 30.7100, lng: 76.7150, pincode: "160062" },
      { name: "Airport Road", area: "Sector 79", road: "PR7 International Airport Road", lat: 30.6800, lng: 76.7280, pincode: "160071" }
    ]
  },

  // --- CHANDIGARH ---
  {
    name: "Chandigarh",
    state: "Chandigarh",
    district: "Chandigarh District",
    pincode: "160017",
    lat: 30.7333,
    lng: 76.7794,
    landmarks: [
      { name: "Sector 17", area: "City Center Plaza", road: "Jan Marg", lat: 30.7410, lng: 76.7820, pincode: "160017" },
      { name: "Sector 35", area: "Sector 35C", road: "Himalaya Marg", lat: 30.7250, lng: 76.7640, pincode: "160022" }
    ]
  },

  // --- MAHARASHTRA ---
  {
    name: "Mumbai",
    state: "Maharashtra",
    district: "Mumbai Suburban District",
    pincode: "400001",
    lat: 19.0760,
    lng: 72.8777,
    landmarks: [
      { name: "Andheri East", area: "Chakala", road: "Western Express Highway", lat: 19.1136, lng: 72.8697, pincode: "400069" },
      { name: "BKC", area: "G Block", road: "Bandra Kurla Complex Avenue", lat: 19.0660, lng: 72.8680, pincode: "400051" },
      { name: "Bandra West", area: "Pali Hill", road: "Linking Road", lat: 19.0600, lng: 72.8350, pincode: "400050" },
      { name: "Dadar TT", area: "Dadar East", road: "Dr. Babasaheb Ambedkar Road", lat: 19.0180, lng: 72.8430, pincode: "400014" },
      { name: "Colaba", area: "Gateway Precinct", road: "Colaba Causeway", lat: 18.9150, lng: 72.8250, pincode: "400005" }
    ]
  },
  {
    name: "Pune",
    state: "Maharashtra",
    district: "Pune District",
    pincode: "411001",
    lat: 18.5204,
    lng: 73.8567,
    landmarks: [
      { name: "Deccan Gymkhana", area: "Shivajinagar", road: "Fergusson College Road", lat: 18.5230, lng: 73.8410, pincode: "411004" },
      { name: "Baner", area: "Baner Road High Street", road: "Baner Main Road", lat: 18.5580, lng: 73.7920, pincode: "411045" },
      { name: "Hinjawadi", area: "Rajiv Gandhi Infotech Park", road: "Phase 1 Main Road", lat: 18.5910, lng: 73.7380, pincode: "411057" }
    ]
  },

  // --- KARNATAKA ---
  {
    name: "Bengaluru",
    state: "Karnataka",
    district: "Bengaluru Urban District",
    pincode: "560001",
    lat: 12.9716,
    lng: 77.5946,
    landmarks: [
      { name: "Bellandur", area: "Outer Ring Road Corridor", road: "Marathahalli-Sarjapur Outer Ring Road", lat: 12.9352, lng: 77.6844, pincode: "560103" },
      { name: "Indiranagar", area: "HAL 2nd Stage", road: "100 Feet Road", lat: 12.9750, lng: 77.6410, pincode: "560038" },
      { name: "Koramangala", area: "4th Block", road: "80 Feet Road", lat: 12.9350, lng: 77.6180, pincode: "560034" },
      { name: "Whitefield", area: "EPIP Zone", road: "ITPL Main Road", lat: 12.9690, lng: 77.7490, pincode: "560066" }
    ]
  },

  // --- TAMIL NADU ---
  {
    name: "Chennai",
    state: "Tamil Nadu",
    district: "Chennai District",
    pincode: "600001",
    lat: 13.0827,
    lng: 80.2707,
    landmarks: [
      { name: "Anna Salai", area: "Thousand Lights", road: "Mount Road / Anna Salai", lat: 13.0600, lng: 80.2500, pincode: "600002" },
      { name: "OMR Expressway", area: "Taramani", road: "Rajiv Gandhi IT Expressway", lat: 12.9880, lng: 80.2450, pincode: "600113" },
      { name: "T. Nagar", area: "Panagal Park", road: "Usman Road", lat: 13.0400, lng: 80.2330, pincode: "600017" }
    ]
  },

  // --- TELANGANA ---
  {
    name: "Hyderabad",
    state: "Telangana",
    district: "Hyderabad District",
    pincode: "500001",
    lat: 17.3850,
    lng: 78.4867,
    landmarks: [
      { name: "Hitec City", area: "Madhapur", road: "Cyber Towers Boulevard", lat: 17.4500, lng: 78.3800, pincode: "500081" },
      { name: "Gachibowli", area: "Financial District", road: "ISB Road", lat: 17.4400, lng: 78.3480, pincode: "500032" },
      { name: "Banjara Hills", area: "Road No. 12", road: "Banjara Hills Main Road", lat: 17.4150, lng: 78.4380, pincode: "500034" }
    ]
  },

  // --- GUJARAT ---
  {
    name: "Ahmedabad",
    state: "Gujarat",
    district: "Ahmedabad District",
    pincode: "380001",
    lat: 23.0225,
    lng: 72.5714,
    landmarks: [
      { name: "SG Highway", area: "Bodakdev", road: "Sarkhej-Gandhinagar Highway", lat: 23.0500, lng: 72.5150, pincode: "380054" },
      { name: "Navrangpura", area: "Municipal Market", road: "C.G. Road", lat: 23.0330, lng: 72.5600, pincode: "380009" }
    ]
  },

  // --- RAJASTHAN ---
  {
    name: "Jaipur",
    state: "Rajasthan",
    district: "Jaipur District",
    pincode: "302001",
    lat: 26.9124,
    lng: 75.7873,
    landmarks: [
      { name: "MI Road", area: "Ajmeri Gate", road: "Mirza Ismail Road", lat: 26.9180, lng: 75.8150, pincode: "302001" },
      { name: "Malviya Nagar", area: "Sector 4", road: "Calgiri Marg", lat: 26.8550, lng: 75.8120, pincode: "302017" }
    ]
  },

  // --- WEST BENGAL ---
  {
    name: "Kolkata",
    state: "West Bengal",
    district: "Kolkata District",
    pincode: "700001",
    lat: 22.5726,
    lng: 88.3639,
    landmarks: [
      { name: "Park Street", area: "Mother Teresa Sarani", road: "Park Street Corridor", lat: 22.5530, lng: 88.3520, pincode: "700016" },
      { name: "Salt Lake", area: "Sector V", road: "Bidhan Nagar Tech Hub", lat: 22.5800, lng: 88.4320, pincode: "700091" }
    ]
  },

  // --- BIHAR ---
  {
    name: "Patna",
    state: "Bihar",
    district: "Patna District",
    pincode: "800001",
    lat: 25.5941,
    lng: 85.1376,
    landmarks: [
      { name: "Bailey Road", area: "Saguna More", road: "Jawaharlal Nehru Marg", lat: 25.6120, lng: 85.0600, pincode: "801503" },
      { name: "Boring Road", area: "Chauraha", road: "Boring Canal Road", lat: 25.6150, lng: 85.1180, pincode: "800001" }
    ]
  },

  // --- UTTARAKHAND ---
  {
    name: "Dehradun",
    state: "Uttarakhand",
    district: "Dehradun District",
    pincode: "248001",
    lat: 30.3165,
    lng: 78.0322,
    landmarks: [
      { name: "Clock Tower", area: "Paltan Bazaar", road: "Rajpur Road", lat: 30.3250, lng: 78.0430, pincode: "248001" },
      { name: "Ballupur", area: "Chakrata Road", road: "Ballupur Chowk Road", lat: 30.3380, lng: 78.0120, pincode: "248001" }
    ]
  }
];

/**
 * Helper to build a comprehensive, human-readable address with all available
 * hierarchical fields:
 * [House/Building], [Road/Street], [Area/Locality], [City], [District], [State], [PIN Code], [Country]
 */
function buildCompleteAddressFromOSM(addr, offlineFallback) {
  const parts = [];

  // 1. House / Building Number / Named Property
  const building = addr.house_number || addr.building || addr.amenity || addr.shop || addr.office || addr.commercial;
  if (building && !parts.includes(building)) {
    parts.push(building);
  }

  // 2. Road / Street Name
  let road = addr.road || addr.street || addr.highway || addr.pedestrian || addr.footway || addr.path;
  const isGenericRoad = !road || ['inside city', 'unnamed road', 'service road', 'road', 'track'].includes(road.toLowerCase().trim());

  // 3. Area / Locality / Suburb / Neighbourhood
  let locality = addr.neighbourhood || addr.suburb || addr.residential || addr.quarter || addr.subdistrict || addr.hamlet || addr.village;
  const isGenericLocality = locality && ['inside city', 'residential area'].includes(locality.toLowerCase().trim());

  if (isGenericRoad && isGenericLocality) {
    road = offlineFallback?.road || offlineFallback?.landmark || 'Main Road';
    locality = offlineFallback?.area || '';
  } else if (isGenericRoad) {
    road = offlineFallback?.road || '';
  } else if (isGenericLocality) {
    locality = offlineFallback?.area || '';
  }

  if (road && !parts.includes(road) && road.toLowerCase() !== 'inside city') {
    parts.push(road);
  }

  if (locality && !parts.includes(locality) && locality.toLowerCase() !== 'inside city') {
    parts.push(locality);
  }

  // If both road and locality are missing, supply offline landmark/area
  if (parts.length === 0 && offlineFallback?.landmark) {
    if (offlineFallback.road) parts.push(offlineFallback.road);
    if (offlineFallback.area) parts.push(offlineFallback.area);
    if (parts.length === 0) parts.push(offlineFallback.landmark);
  }

  // 4. City / Town / Village
  const city = addr.city || addr.town || addr.municipality || addr.village || offlineFallback?.city || 'City';
  if (city && !parts.includes(city)) {
    parts.push(city);
  }

  // 5. District (Formatted as "... District")
  let district = addr.state_district || addr.county || addr.district || offlineFallback?.district;
  if (district) {
    const formattedDistrict = district.toLowerCase().includes('district') ? district : `${district} District`;
    if (!parts.includes(formattedDistrict) && !parts.includes(district)) {
      parts.push(formattedDistrict);
    }
  }

  // 6. State
  const state = addr.state || addr.province || offlineFallback?.state || 'State';
  if (state && !parts.includes(state)) {
    parts.push(state);
  }

  // 7. PIN / Postal Code
  const postcode = addr.postcode || offlineFallback?.pincode;
  if (postcode && !parts.includes(postcode)) {
    parts.push(postcode);
  }

  // 8. Country
  const country = addr.country || 'India';
  if (country && !parts.includes(country)) {
    parts.push(country);
  }

  return parts.filter(Boolean).join(', ');
}

/**
 * Synchronous, instant reverse geocoding engine with high precision across India.
 * Generates a full, complete human-readable address with:
 * Road, Area, City, District, State, PIN Code, India.
 * Example:
 * "ABC Road, Shastri Nagar, Meerut, Meerut District, Uttar Pradesh, 250001, India"
 */
export function getOfflineReadableLocation(lat, lng) {
  const numLat = typeof lat === 'number' ? lat : parseFloat(lat);
  const numLng = typeof lng === 'number' ? lng : parseFloat(lng);

  if (isNaN(numLat) || isNaN(numLng)) {
    return {
      address: "Outer Ring Road, Sector 5, New Delhi, Central Delhi District, Delhi, 110001, India",
      city: "New Delhi",
      state: "Delhi",
      district: "Central Delhi District",
      pincode: "110001",
      country: "India",
      road: "Outer Ring Road",
      area: "Sector 5",
      landmark: "Outer Ring Road"
    };
  }

  // 1. Search for closest city hub
  let closestCity = INDIAN_CITY_CENTERS[0];
  let minCityDist = Infinity;

  for (const cityObj of INDIAN_CITY_CENTERS) {
    const dist = calculateDistanceKm(numLat, numLng, cityObj.lat, cityObj.lng);
    if (dist < minCityDist) {
      minCityDist = dist;
      closestCity = cityObj;
    }
  }

  // 2. Check closest landmark in this city
  let matchedLandmark = null;
  if (Array.isArray(closestCity.landmarks) && closestCity.landmarks.length > 0) {
    let minLandmarkDist = Infinity;
    for (const lm of closestCity.landmarks) {
      const lmDist = calculateDistanceKm(numLat, numLng, lm.lat, lm.lng);
      if (lmDist < minLandmarkDist) {
        minLandmarkDist = lmDist;
        matchedLandmark = lm;
      }
    }
  }

  let stateName = closestCity.state;
  let cityName = closestCity.name;
  let districtName = closestCity.district || `${cityName} District`;
  let pincode = matchedLandmark?.pincode || closestCity.pincode || "110001";

  if (minCityDist > 65) {
    let closestStateObj = null;
    let minStateDist = Infinity;
    for (const s of INDIAN_STATES_AND_CITIES) {
      if (s.defaultCoords) {
        const sDist = calculateDistanceKm(numLat, numLng, s.defaultCoords.lat, s.defaultCoords.lng);
        if (sDist < minStateDist) {
          minStateDist = sDist;
          closestStateObj = s;
        }
      }
    }
    if (closestStateObj) {
      stateName = closestStateObj.state;
      cityName = closestStateObj.cities?.[0] || cityName;
      districtName = `${cityName} District`;
      pincode = "110001";
    }
  }

  const parts = [];
  if (matchedLandmark?.road) parts.push(matchedLandmark.road);
  if (matchedLandmark?.area && matchedLandmark.area !== matchedLandmark.road) parts.push(matchedLandmark.area);
  if (parts.length === 0 && matchedLandmark?.name) parts.push(matchedLandmark.name);

  parts.push(cityName);
  parts.push(districtName.includes('District') ? districtName : `${districtName} District`);
  parts.push(stateName);
  parts.push(pincode);
  parts.push("India");

  const formattedAddress = parts.join(', ');

  return {
    address: formattedAddress,
    city: cityName,
    state: stateName,
    district: districtName,
    pincode: pincode,
    country: "India",
    road: matchedLandmark?.road || matchedLandmark?.name || null,
    area: matchedLandmark?.area || null,
    landmark: matchedLandmark?.name || null,
    distanceToCityKm: Math.round(minCityDist * 10) / 10
  };
}

/**
 * Asynchronous reverse geocoding with online OpenStreetMap lookup & complete address resolution.
 * Automatically resolves House/Building, Road, Area, City, District, State, PIN Code, Country.
 */
export async function reverseGeocode(lat, lng) {
  const numLat = typeof lat === 'number' ? lat : parseFloat(lat);
  const numLng = typeof lng === 'number' ? lng : parseFloat(lng);

  if (isNaN(numLat) || isNaN(numLng)) {
    return getOfflineReadableLocation(28.6139, 77.2090);
  }

  const cacheKey = `${numLat.toFixed(5)},${numLng.toFixed(5)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  const offlineFallback = getOfflineReadableLocation(numLat, numLng);

  // Try Online OSM Nominatim lookup with 2.8s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${numLat}&lon=${numLng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'CivicVision-Civic-Assistant/2.0'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const fullAddress = buildCompleteAddressFromOSM(addr, offlineFallback);

        const city = addr.city || addr.town || addr.municipality || addr.village || offlineFallback.city;
        const state = addr.state || addr.province || offlineFallback.state;
        const district = addr.state_district || addr.county || offlineFallback.district;
        const pincode = addr.postcode || offlineFallback.pincode;
        const country = addr.country || 'India';

        const result = {
          address: fullAddress,
          city,
          state,
          district: district?.includes('District') ? district : `${district} District`,
          pincode,
          country,
          road: addr.road || offlineFallback.road,
          area: addr.suburb || addr.neighbourhood || offlineFallback.area
        };

        geocodeCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    // Network / timeout fallback
  }

  geocodeCache.set(cacheKey, offlineFallback);
  return offlineFallback;
}

/**
 * Sanitizes and formats any location address string so that raw coordinate
 * strings (e.g. "GPS Position (28.6159° N, 77.20838° E)" or "28.9845, 77.7064")
 * or incomplete addresses are automatically replaced with a full, complete human-readable address.
 */
export function formatDisplayAddress(rawAddress, locationObj = null) {
  const str = String(rawAddress || '').trim();

  // Pattern detecting raw coordinates format
  const isRawCoordinateString =
    !str ||
    str.includes('GPS Position') ||
    str.includes('GPS Fix') ||
    str.includes('GPS Pinpoint') ||
    /^[-\d.]+\s*,\s*[-\d.]+$/.test(str) ||
    /\d+\.\d+°\s*[NSEW]/.test(str);

  if (isRawCoordinateString) {
    let lat = locationObj?.lat;
    let lng = locationObj?.lng;

    // Try extracting numbers from the string if locationObj coordinates missing
    if (lat === undefined || lng === undefined) {
      const matches = str.match(/([-\d.]+)[^\d-]+([-\d.]+)/);
      if (matches && matches.length >= 3) {
        lat = parseFloat(matches[1]);
        lng = parseFloat(matches[2]);
      }
    }

    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      const resolved = getOfflineReadableLocation(lat, lng);
      return resolved.address;
    }

    if (locationObj?.city && locationObj?.state) {
      return `${locationObj.city}, ${locationObj.city} District, ${locationObj.state}, India`;
    }

    return "Outer Ring Road, Sector 5, New Delhi, Central Delhi District, Delhi, 110001, India";
  }

  // If address has "inside city" or is short, clean and expand it if coordinates available
  if (str.toLowerCase().startsWith('inside city,') && locationObj?.lat && locationObj?.lng) {
    const resolved = getOfflineReadableLocation(locationObj.lat, locationObj.lng);
    return resolved.address;
  }

  return str;
}
