// Hardcoded contest data for hackathon demo
export const HARDCODED_CONTESTS = [
  {
    id: 1,
    name: "Quick Win Contest",
    description: "Fast-paced challenge with low entry barrier",
    stakeAmount: "1000000000000000", // 0.001 CBTC in wei
    stakeAmountDisplay: "0.001",
    startTime: Math.floor(Date.now() / 1000),
    endTime: Math.floor(Date.now() / 1000) + 86400, // 1 day
    maxParticipants: 50,
    minParticipants: 2,
    participantCount: 12,
    rewardsDistributed: false,
    difficulty: "Easy",
    duration: "1 Day",
    prizePool: "0.6 CBTC", // 50 * 0.01 * 0.12 (12% of total)
    icon: "⚡",
    color: "from-green-400 to-blue-500",
    participants: []
  },
  {
    id: 2,
    name: "Weekly Challenge",
    description: "Medium stake weekly fitness challenge",
    stakeAmount: "2000000000000000", // 0.002 CBTC in wei
    stakeAmountDisplay: "0.002",
    startTime: Math.floor(Date.now() / 1000),
    endTime: Math.floor(Date.now() / 1000) + 604800, // 7 days
    maxParticipants: 100,
    minParticipants: 5,
    participantCount: 28,
    rewardsDistributed: false,
    difficulty: "Medium",
    duration: "7 Days",
    prizePool: "2.8 CBTC", // 100 * 0.1 * 0.28
    icon: "💪",
    color: "from-blue-400 to-purple-500",
    participants: []
  },
  {
    id: 3,
    name: "Monthly Tournament",
    description: "High stakes monthly championship",
    stakeAmount: "5000000000000000", // 0.005 CBTC in wei
    stakeAmountDisplay: "0.005",
    startTime: Math.floor(Date.now() / 1000),
    endTime: Math.floor(Date.now() / 1000) + 2592000, // 30 days
    maxParticipants: 200,
    minParticipants: 10,
    participantCount: 45,
    rewardsDistributed: false,
    difficulty: "Hard",
    duration: "30 Days",
    prizePool: "45 CBTC", // 200 * 1 * 0.225
    icon: "🏆",
    color: "from-purple-400 to-pink-500",
    participants: []
  },
  {
    id: 4,
    name: "Elite Championship",
    description: "Premium elite championship with massive rewards",
    stakeAmount: "10000000000000000", // 0.01 CBTC in wei
    stakeAmountDisplay: "0.01",
    startTime: Math.floor(Date.now() / 1000),
    endTime: Math.floor(Date.now() / 1000) + 5184000, // 60 days
    maxParticipants: 500,
    minParticipants: 20,
    participantCount: 8,
    rewardsDistributed: false,
    difficulty: "Elite",
    duration: "60 Days",
    prizePool: "40 CBTC", // 500 * 5 * 0.016
    icon: "👑",
    color: "from-yellow-400 to-orange-500",
    participants: []
  }
];

// Helper function to get contest by ID
export const getContestById = (id) => {
  return HARDCODED_CONTESTS.find(contest => contest.id === parseInt(id));
};

// Helper function to format stake amount for display
export const formatStakeAmount = (weiAmount) => {
  const amount = parseFloat(weiAmount) / 1e18;
  return amount.toFixed(2);
};

// Helper function to calculate time remaining
export const getTimeRemaining = (endTime) => {
  const now = Math.floor(Date.now() / 1000);
  const remaining = endTime - now;
  
  if (remaining <= 0) return "Ended";
  
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
