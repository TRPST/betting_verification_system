import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server';

// Enhanced sample data for realistic user names and scenarios
const userData = {
  names: [
    "John Smith", "Mary Johnson", "Peter Brown", "Sarah Davis", "Michael Wilson",
    "Emma Taylor", "James Anderson", "Sophie White", "David Miller", "Olivia Jones",
    "William Turner", "Isabella Martinez", "Benjamin Clark", "Ava Rodriguez", "Lucas Lee",
    "Sophia Thompson", "Daniel White", "Mia Garcia", "Alexander Moore", "Charlotte Baker",
    "Ethan Hill", "Amelia Nelson", "Matthew Adams", "Harper King", "Andrew Scott",
    "Abigail Green", "Joseph Phillips", "Elizabeth Evans", "Christopher Ross", "Victoria Gray",
    "Joshua Cooper", "Sofia Perez", "Ryan Butler", "Chloe Collins", "Nathan Rivera",
    "Zoe Morgan", "Samuel Brooks", "Lily Price", "David Hughes", "Grace Bennett",
    "Thabo Mbeki", "Lerato Molefe", "Sipho Ndlovu", "Nomvula Mokonyane", "Mandla Zulu",
    "Precious Mthembu", "Blessing Mokoena", "Thandeka Nkosi", "Themba Khumalo", "Lindiwe Dlamini"
  ],
  companies: [
    "Tech Solutions Ltd", "Global Banking Corp", "Retail Express", "Healthcare Plus",
    "Education First", "Travel & Co", "Sports Direct", "Food Delivery SA",
    "Insurance Partners", "Real Estate Group", "Betting World", "Lucky Star Casino",
    "Hollywoodbets", "Betway SA", "Sportingbet", "Sunbet", "World Sports Betting",
    "Supabets", "Gbets", "Playabets", "Phumelela Gaming", "Gold Rush Gaming"
  ],
  locations: [
    "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth",
    "Bloemfontein", "East London", "Nelspruit", "Kimberley", "Polokwane",
    "Rustenburg", "Pietermaritzburg", "Stellenbosch", "Soweto", "Centurion",
    "Sandton", "Midrand", "Randburg", "Boksburg", "Benoni"
  ],
  verificationTypes: [
    "Personal Account", "Business Account", "Student Account", "Senior Account",
    "Joint Account", "Investment Account", "Savings Account", "Credit Account",
    "Betting Account", "Casino Account", "Sports Betting", "Horse Racing",
    "Poker Account", "Bingo Account", "Lottery Account"
  ],
  statuses: [
    { emoji: "✅", text: "Verified", weight: 60 },
    { emoji: "⏳", text: "Pending Review", weight: 20 },
    { emoji: "⚠️", text: "Flagged", weight: 15 },
    { emoji: "🚨", text: "Fraud Alert", weight: 5 }
  ],
  rejectionReasons: [
    "Document expired", "Poor image quality", "Information mismatch",
    "Suspected forgery", "Missing information", "Document tampering",
    "Incomplete submission", "Duplicate application"
  ],
  deviceTypes: [
    "Mobile Android", "Mobile iOS", "Desktop Windows", "Desktop Mac", "Tablet"
  ],
  browsers: [
    "Chrome", "Safari", "Firefox", "Edge", "Opera"
  ],
  ipRanges: [
    "196.25.X.X", "41.13.X.X", "105.226.X.X", "197.184.X.X", "165.255.X.X"
  ]
};

// Generate weighted random status based on probability weights
function getRandomStatus() {
  const totalWeight = userData.statuses.reduce((sum, status) => sum + status.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const status of userData.statuses) {
    if (random < status.weight) {
      return `${status.emoji} ${status.text}`;
    }
    random -= status.weight;
  }
  
  return userData.statuses[0].emoji + " " + userData.statuses[0].text;
}

// Generate random IP address in South African ranges
function generateSAIPAddress() {
  const ipRange = userData.ipRanges[Math.floor(Math.random() * userData.ipRanges.length)];
  return ipRange.replace('X.X', `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`);
}

// Generate random verification data with more realistic patterns
function generateVerificationData(days: number) {
  // Create base pattern with weekly cycles (more on weekdays, less on weekends)
  const baseData = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    // Generate more verifications during business hours
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isMonday = date.getDay() === 1; // Mondays have more verifications
    const isFriday = date.getDay() === 5; // Fridays have more verifications too
    
    // Base numbers with realistic patterns
    let baseNumber = isWeekend ? 15 : 35;
    if (isMonday) baseNumber = 45; // More on Mondays
    if (isFriday) baseNumber = 50; // Even more on Fridays
    
    // Add some randomness but maintain the pattern
    const randomFactor = Math.random() * 0.3 + 0.85; // 0.85 to 1.15
    
    const verified = Math.floor((baseNumber * randomFactor) * 0.6);
    const pending = Math.floor((baseNumber * randomFactor) * 0.2);
    const flagged = Math.floor((baseNumber * randomFactor) * 0.15);
    const fraud = Math.floor((baseNumber * randomFactor) * 0.05);
    
    return {
      date: date.toISOString().split('T')[0],
      verified,
      pending,
      flagged,
      fraud,
      total: verified + pending + flagged + fraud
    };
  });
  
  // Add a trend over time (gradually increasing)
  return baseData.map((day, index) => {
    // Slight upward trend as days progress
    const trendFactor = 1 + (index / (days * 2)); // Gradually increases
    
    return {
      ...day,
      verified: Math.floor(day.verified * trendFactor),
      pending: Math.floor(day.pending * trendFactor),
      flagged: Math.floor(day.flagged * trendFactor),
      fraud: Math.floor(day.fraud * trendFactor),
      total: Math.floor((day.verified + day.pending + day.flagged + day.fraud) * trendFactor)
    };
  });
}

// Generate random ID number following South African ID number format
function generateSAIDNumber() {
  // Format: YYMMDD SSSS C A Z
  // YY - Year of birth (00-99)
  // MM - Month of birth (01-12)
  // DD - Day of birth (01-31)
  // SSSS - Sequence for people born on the same day (0001-9999)
  // C - Citizenship (0 for SA citizen, 1 for permanent resident)
  // A - Gender (0-4 for female, 5-9 for male)
  // Z - Control digit
  
  const year = Math.floor(Math.random() * 99).toString().padStart(2, '0');
  const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
  const day = (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0');
  const sequence = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  const citizenship = Math.floor(Math.random() * 2);
  const gender = Math.floor(Math.random() * 10);
  const checksum = Math.floor(Math.random() * 10);
  
  return `${year}${month}${day}${sequence}${citizenship}${gender}${checksum}`;
}

// Generate more detailed recent verifications
function generateRecentVerifications(count: number) {
  return Array.from({ length: count }, () => {
    const name = userData.names[Math.floor(Math.random() * userData.names.length)];
    const company = Math.random() > 0.3 ? userData.companies[Math.floor(Math.random() * userData.companies.length)] : undefined;
    const location = userData.locations[Math.floor(Math.random() * userData.locations.length)];
    const type = userData.verificationTypes[Math.floor(Math.random() * userData.verificationTypes.length)];
    const status = getRandomStatus();
    const idNumber = generateSAIDNumber();
    const deviceType = userData.deviceTypes[Math.floor(Math.random() * userData.deviceTypes.length)];
    const browser = userData.browsers[Math.floor(Math.random() * userData.browsers.length)];
    const ipAddress = generateSAIPAddress();
    
    // Generate timestamp within the last 24 hours
    const now = new Date();
    const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString();
    
    // Generate verification time (1-15 minutes)
    const verificationTime = Math.floor(Math.random() * 15) + 1;
    
    // Generate rejection reason if status is rejected
    const rejectionReason = status.includes("⚠️") || status.includes("🚨") 
      ? userData.rejectionReasons[Math.floor(Math.random() * userData.rejectionReasons.length)]
      : undefined;
    
    // Generate account type
    const accountType = Math.random() > 0.5 ? "Personal" : "Business";
    
    return {
      id: Math.random().toString(36).substring(2, 10),
      name,
      type,
      location,
      status,
      timestamp,
      idNumber,
      details: {
        accountType,
        deviceType,
        browser,
        ipAddress,
        verificationTime,
        rejectionReason,
        company
      }
    };
  });
}

// Generate hourly distribution data
function generateHourlyDistribution() {
  return Array.from({ length: 24 }, (_, hour) => {
    // Business hours have more verifications
    const isBusinessHour = hour >= 8 && hour <= 17;
    const isPeakHour = hour >= 10 && hour <= 14;
    
    let baseCount = isBusinessHour ? 25 : 10;
    if (isPeakHour) baseCount = 40;
    
    // Add some randomness
    const randomFactor = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
    const count = Math.floor(baseCount * randomFactor);
    
    return {
      hour: `${hour}:00`,
      count
    };
  });
}

// Generate rejection statistics
function generateRejectionStats() {
  return userData.rejectionReasons.map(reason => {
    return {
      reason,
      count: Math.floor(Math.random() * 30) + 5
    };
  }).sort((a, b) => b.count - a.count);
}

// Generate device statistics
function generateDeviceStats() {
  return userData.deviceTypes.map(device => {
    return {
      device,
      total: Math.floor(Math.random() * 100) + 50
    };
  });
}

// Generate location statistics
function generateLocationStats() {
  return userData.locations.slice(0, 10).map(location => {
    const total = Math.floor(Math.random() * 200) + 100;
    const verificationRate = Math.floor(Math.random() * 30) + 70; // 70-100%
    const verified = Math.floor(total * (verificationRate / 100));
    const flagged = Math.floor(total * (Math.random() * 0.15)); // 0-15%
    const fraud = Math.floor(total * (Math.random() * 0.05)); // 0-5%
    
    return {
      location,
      total,
      verified,
      flagged,
      fraud,
      verificationRate
    };
  }).sort((a, b) => b.total - a.total);
}

// Generate overall statistics
function generateStats() {
  const totalVerified = Math.floor(Math.random() * 1000) + 2000;
  const pendingVerifications = Math.floor(Math.random() * 200) + 100;
  const flaggedForReview = Math.floor(Math.random() * 100) + 50;
  const fraudAlerts = Math.floor(Math.random() * 30) + 10;
  const totalProcessed = totalVerified + pendingVerifications + flaggedForReview + fraudAlerts;
  
  return {
    totalVerified,
    pendingVerifications,
    flaggedForReview,
    fraudAlerts,
    totalProcessed,
    verificationRate: Math.floor((totalVerified / totalProcessed) * 100),
    rejectionRate: Math.floor(((flaggedForReview + fraudAlerts) / totalProcessed) * 100),
    growthRate: Math.floor(Math.random() * 20) + 5,
    averageTime: Math.floor(Math.random() * 5) + 3,
    dailyAverage: Math.floor(totalProcessed / 30)
  };
}

export async function GET(request: NextRequest) {
  // Get time range from query params (default to week)
  const searchParams = request.nextUrl.searchParams;
  const timeRange = searchParams.get('timeRange') || 'week';
  
  // Determine number of days based on time range
  let days = 7;
  if (timeRange === 'month') days = 30;
  if (timeRange === 'year') days = 365;
  
  // Generate data
  const trendData = generateVerificationData(days);
  const recentActivity = generateRecentVerifications(20);
  const hourlyDistribution = generateHourlyDistribution();
  const rejectionStats = generateRejectionStats();
  const deviceStats = generateDeviceStats();
  const locationStats = generateLocationStats();
  const stats = generateStats();
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return NextResponse.json({
    trendData,
    recentActivity,
    hourlyDistribution,
    rejectionStats,
    deviceStats,
    locationStats,
    stats
  });
}