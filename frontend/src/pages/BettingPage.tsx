import { useState } from "react";
import {
  Trophy,
  Users,
  Clock,
  DollarSign,
  Eye,
  Calendar,
  Play,
  X,
  User,
  Award,
  BarChart3,
  Flame,
  Activity,
  Wallet,
  Star,
  Video,
  Volume2,
  VolumeX,
  MessageSquare,
} from "lucide-react";

// Simple GlassCard component
const GlassCard = ({ children, className = "", glowEffect = false }) => (
  <div
    className={`
    bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6
    ${glowEffect ? "shadow-lg shadow-green-500/20" : ""}
    ${className}
  `}
  >
    {children}
  </div>
);

// Simple NeonButton component
const NeonButton = ({ children, className = "", size = "md", onClick }) => (
  <button
    onClick={onClick}
    className={`
      bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg
      transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30
      ${size === "sm" ? "px-3 py-1 text-sm" : "px-4 py-2"}
      ${className}
    `}
  >
    {children}
  </button>
);

const BettingPage = () => {
  const [selectedContest, setSelectedContest] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [betAmount, setBetAmount] = useState("");
  const [selectedBets, setSelectedBets] = useState({});
  const [isMuted, setIsMuted] = useState(false);

  const contests = [
    {
      id: 1,
      title: "Ultimate Strength Showdown",
      type: "strength",
      startTime: "2024-10-15 18:00",
      duration: "45 mins",
      totalPool: "12.5 ETH",
      participants: 8,
      status: "upcoming",
      minBet: "0.01 ETH",
      featured: true,
      description:
        "Elite athletes compete in strength challenges including deadlifts, bench press, and functional movements.",
      rules: [
        "Each participant performs 3 rounds of exercises",
        "Scoring based on weight lifted and form quality",
        "AI judges monitor form and technique",
        "Maximum time limit: 45 minutes per participant",
      ],
      participantsList: [
        {
          id: 1,
          name: "IronTitan_X",
          level: 18,
          winRate: 87,
          totalEarned: "23.4 ETH",
          streak: 12,
          completedChallenges: 89,
          rank: "Legend",
          odds: "2.3x",
          recentPerformance: [95, 88, 92, 90, 94, 87, 96],
        },
        {
          id: 2,
          name: "PowerLift_Pro",
          level: 16,
          winRate: 82,
          totalEarned: "18.7 ETH",
          streak: 8,
          completedChallenges: 76,
          rank: "Elite",
          odds: "2.8x",
          recentPerformance: [91, 84, 89, 87, 90, 85, 93],
        },
        {
          id: 3,
          name: "StrengthBeast",
          level: 15,
          winRate: 79,
          totalEarned: "15.2 ETH",
          streak: 6,
          completedChallenges: 67,
          rank: "Elite",
          odds: "3.2x",
          recentPerformance: [88, 82, 86, 84, 87, 81, 89],
        },
      ],
    },
    {
      id: 2,
      title: "Cardio Thunder Challenge",
      type: "cardio",
      startTime: "2024-10-16 19:30",
      duration: "30 mins",
      totalPool: "8.2 ETH",
      participants: 12,
      status: "betting-closed",
      minBet: "0.005 ETH",
      featured: false,
      description:
        "High-intensity cardio challenge featuring burpees, mountain climbers, and sprint intervals.",
      rules: [
        "Non-stop 30-minute intense cardio workout",
        "Points awarded for consistency and intensity",
        "Heart rate monitoring required",
      ],
      participantsList: [],
    },
    {
      id: 3,
      title: "Endurance Marathon",
      type: "endurance",
      startTime: "2024-10-17 20:00",
      duration: "90 mins",
      totalPool: "20.1 ETH",
      participants: 15,
      status: "live",
      minBet: "0.02 ETH",
      featured: true,
      description:
        "Epic 90-minute endurance test combining running, cycling, and bodyweight exercises.",
      rules: [
        "Three-stage endurance challenge",
        "Continuous monitoring for 90 minutes",
        "Elimination rounds every 30 minutes",
      ],
      participantsList: [],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "text-blue-400 bg-blue-900/20";
      case "betting-closed":
        return "text-yellow-400 bg-yellow-900/20";
      case "live":
        return "text-red-400 bg-red-900/20";
      case "completed":
        return "text-green-400 bg-green-900/20";
      default:
        return "text-gray-400 bg-gray-900/20";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "strength":
        return Trophy;
      case "cardio":
        return Activity;
      case "endurance":
        return Star;
      default:
        return Trophy;
    }
  };

  const placeBet = (contestId, participant, amount) => {
    if (amount && parseFloat(amount) > 0) {
      setSelectedBets({
        ...selectedBets,
        [contestId]: { participant, amount },
      });
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white p-6 space-y-8">
      {/* Header */}
      <div className="flex bg-cyber-black justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-green-500 mb-2">
            Contest Betting Arena
          </h1>
          <p className="text-gray-400">
            Live sports betting on fitness challenges
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-400 mb-1">Your Balance</div>
          <div className="text-2xl font-bold text-green-500 flex items-center">
            <Wallet className="w-5 h-5 mr-2" />
            1.25 ETH
          </div>
        </div>
      </div>

      {!selectedContest ? (
        /* Contest List */
        <div className="grid lg:grid-cols-2 gap-6">
          {contests.map((contest) => {
            const Icon = getTypeIcon(contest.type);

            return (
              <div
                key={contest.id}
                className="cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedContest(contest)}
              >
                <GlassCard
                  className={
                    contest.featured ? "border-2 border-green-500" : ""
                  }
                  glowEffect={contest.featured}
                >
                  {contest.featured && (
                    <div className="absolute -top-3 left-4 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-green-500">
                          {contest.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(contest.startTime).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {contest.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        contest.status
                      )}`}
                    >
                      {contest.status.replace("-", " ").toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">
                        {contest.totalPool}
                      </div>
                      <div className="text-xs text-gray-400">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">
                        {contest.participants}
                      </div>
                      <div className="text-xs text-gray-400">Athletes</div>
                    </div>
                    <div className="text-center">
                      <Activity className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-bold text-white">
                        {contest.minBet}
                      </div>
                      <div className="text-xs text-gray-400">Min Bet</div>
                    </div>
                  </div>

                  <NeonButton className="w-full flex items-center justify-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {contest.status === "live" ? "Watch Live" : "View Contest"}
                  </NeonButton>
                </GlassCard>
              </div>
            );
          })}
        </div>
      ) : (
        /* Contest Detail View */
        <div className="space-y-6">
          {/* Contest Header */}
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => setSelectedContest(null)}
                className="text-green-500 hover:text-green-400 mb-4"
              >
                ← Back to Contests
              </button>
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedContest.title}
              </h2>
              <div className="flex items-center space-x-4 text-gray-400">
                <span>
                  Starts: {new Date(selectedContest.startTime).toLocaleString()}
                </span>
                <span>Duration: {selectedContest.duration}</span>
                <span>Pool: {selectedContest.totalPool}</span>
              </div>
            </div>

            {selectedContest.status === "live" && (
              <NeonButton onClick={() => setIsLiveStreamOpen(true)}>
                <Play className="w-4 h-4 mr-2" />
                Watch Live
              </NeonButton>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("participants")}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === "participants"
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Participants ({selectedContest.participants})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" ? (
            <div className="grid lg:grid-cols-2 gap-6">
              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">
                  Contest Description
                </h3>
                <p className="text-gray-300 mb-6">
                  {selectedContest.description}
                </p>

                <h4 className="font-semibold text-white mb-3">
                  Rules & Format
                </h4>
                <ul className="space-y-2 text-gray-300">
                  {selectedContest.rules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <h3 className="text-xl font-bold text-white mb-4">
                  Prize Distribution
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded border border-green-500/20">
                    <span className="text-white font-medium">1st Place</span>
                    <span className="text-green-500 font-bold">
                      50% of pool
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded border border-green-500/20">
                    <span className="text-white font-medium">2nd Place</span>
                    <span className="text-green-500 font-bold">
                      30% of pool
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded border border-green-500/20">
                    <span className="text-white font-medium">3rd Place</span>
                    <span className="text-green-500 font-bold">
                      20% of pool
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedContest.participantsList.map((participant) => (
                <GlassCard
                  key={participant.id}
                  className="hover:scale-105 transition-all"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User className="w-8 h-8 text-green-500" />
                    </div>
                    <h4 className="font-bold text-white">{participant.name}</h4>
                    <div className="text-sm text-green-500">
                      Level {participant.level} • {participant.rank}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="text-center">
                      <div className="text-white font-bold">
                        {participant.winRate}%
                      </div>
                      <div className="text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold">
                        {participant.totalEarned}
                      </div>
                      <div className="text-gray-400">Earned</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300">Odds:</span>
                    <span className="text-green-500 font-bold text-lg">
                      {participant.odds}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedParticipant(participant)}
                      className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-sm transition-colors"
                    >
                      View Profile
                    </button>

                    {selectedContest.status === "upcoming" && (
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.1"
                          className="flex-1 bg-gray-800 border border-green-500/50 rounded px-2 py-1 text-white text-xs"
                          onChange={(e) => setBetAmount(e.target.value)}
                        />
                        <NeonButton
                          size="sm"
                          className="px-3"
                          onClick={() =>
                            placeBet(
                              selectedContest.id,
                              participant.name,
                              betAmount
                            )
                          }
                        >
                          Bet
                        </NeonButton>
                      </div>
                    )}

                    {selectedBets[selectedContest.id]?.participant ===
                      participant.name && (
                      <div className="bg-green-900/20 border border-green-500/30 rounded px-2 py-1 text-center">
                        <div className="text-green-400 text-xs font-bold">
                          ✓ Bet Placed:{" "}
                          {selectedBets[selectedContest.id].amount} ETH
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Participant Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <GlassCard className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-green-500">
                  {selectedParticipant.name}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Level {selectedParticipant.level}</span>
                  <span className="text-green-500">
                    {selectedParticipant.rank}
                  </span>
                  <span>{selectedParticipant.winRate}% Win Rate</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-3 rounded border border-green-500/20">
                    <Trophy className="w-5 h-5 text-green-500 mb-1" />
                    <div className="text-lg font-bold text-white">
                      {selectedParticipant.completedChallenges}
                    </div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded border border-green-500/20">
                    <DollarSign className="w-5 h-5 text-green-500 mb-1" />
                    <div className="text-lg font-bold text-white">
                      {selectedParticipant.totalEarned}
                    </div>
                    <div className="text-xs text-gray-400">Earned</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded border border-green-500/20">
                    <Flame className="w-5 h-5 text-green-500 mb-1" />
                    <div className="text-lg font-bold text-white">
                      {selectedParticipant.streak}
                    </div>
                    <div className="text-xs text-gray-400">Day Streak</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded border border-green-500/20">
                    <BarChart3 className="w-5 h-5 text-green-500 mb-1" />
                    <div className="text-lg font-bold text-white">
                      {selectedParticipant.winRate}%
                    </div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3">
                  Recent Performance
                </h4>
                <div className="h-32 flex items-end space-x-1">
                  {selectedParticipant.recentPerformance.map((score, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${score}%` }}
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold">
                    Place Bet on {selectedParticipant.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    Odds: {selectedParticipant.odds}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.1"
                    className="w-20 bg-gray-800 border border-green-500/50 rounded px-2 py-1 text-white text-sm"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                  />
                  <NeonButton
                    size="sm"
                    onClick={() =>
                      selectedContest &&
                      placeBet(
                        selectedContest.id,
                        selectedParticipant.name,
                        betAmount
                      )
                    }
                  >
                    Bet {betAmount} ETH
                  </NeonButton>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Simple Live Stream Modal */}
      {isLiveStreamOpen && selectedContest && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="w-full h-full max-w-6xl mx-auto p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-bold">LIVE</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {selectedContest.title}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-gray-800 rounded hover:bg-gray-700"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setIsLiveStreamOpen(false)}
                  className="p-2 bg-gray-800 rounded hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <div className="aspect-video bg-gray-800 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-20 h-20 text-gray-600" />
                  </div>
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    LIVE
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded">
                    Current Leader: IronTitan_X
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <GlassCard className="p-4">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <Trophy className="w-4 h-4 mr-2 text-green-500" />
                    Live Leaderboard
                  </h3>
                  <div className="space-y-2">
                    {selectedContest.participantsList
                      .slice(0, 3)
                      .map((participant, index) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === 0
                                  ? "bg-green-500 text-black"
                                  : "bg-gray-600 text-white"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className="text-white">
                              {participant.name}
                            </span>
                          </div>
                          <span className="text-green-500 font-bold">
                            {100 - index * 5} pts
                          </span>
                        </div>
                      ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-4 flex-1">
                  <h3 className="font-bold text-white mb-3 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                    Live Chat
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-blue-400">
                      <strong>Viewer123:</strong> Amazing!
                    </div>
                    <div className="text-green-400">
                      <strong>FitFan:</strong> Great performance!
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BettingPage;
