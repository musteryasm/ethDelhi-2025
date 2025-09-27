import { motion } from "framer-motion";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Award,
  ArrowLeft,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";

const ContestResultPage = () => {
  const navigate = useNavigate();

  // Mock data for the contest results
  const contestInfo = {
    name: "Squat Master Challenge",
    totalParticipants: 892,
    totalPrizePool: "44.6 ETH",
    duration: "14 days",
    status: "Completed",
  };

  const currentUser = {
    name: "You",
    rank: 7,
    score: 2450,
    stakeAmount: "0.05 ETH",
    earnings: "+0.12 ETH",
    isProfit: true,
    percentileRank: 92, // 92% ahead of others
  };

  const leaderboardData = [
    {
      rank: 1,
      name: "FitnessBeast",
      score: 4850,
      earnings: "+2.23 ETH",
      change: "+15%",
    },
    {
      rank: 2,
      name: "SquatKing",
      score: 4720,
      earnings: "+1.87 ETH",
      change: "+12%",
    },
    {
      rank: 3,
      name: "LegendaryLifter",
      score: 4580,
      earnings: "+1.34 ETH",
      change: "+8%",
    },
    {
      rank: 4,
      name: "IronWill",
      score: 3920,
      earnings: "+0.89 ETH",
      change: "+5%",
    },
    {
      rank: 5,
      name: "PowerMover",
      score: 3650,
      earnings: "+0.67 ETH",
      change: "+3%",
    },
    {
      rank: 6,
      name: "FlexMaster",
      score: 2890,
      earnings: "+0.45 ETH",
      change: "+2%",
    },
    {
      rank: 7,
      name: "You",
      score: 2450,
      earnings: "+0.12 ETH",
      change: "+1%",
      isCurrentUser: true,
    },
    {
      rank: 8,
      name: "QuickSquat",
      score: 2340,
      earnings: "+0.08 ETH",
      change: "0%",
    },
    {
      rank: 9,
      name: "FitnessFreak",
      score: 2180,
      earnings: "+0.05 ETH",
      change: "-1%",
    },
    {
      rank: 10,
      name: "GymWarrior",
      score: 1950,
      earnings: "+0.02 ETH",
      change: "-2%",
    },
  ];

  return (
    <div className="min-h-screen bg-cyber-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </NeonButton>
            <div>
              <h1 className="font-orbitron text-4xl font-bold text-cyber-green">
                Contest Results
              </h1>
              <p className="text-gray-400 mt-1">
                {contestInfo.name} - {contestInfo.status}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-cyber-green">
              {contestInfo.totalPrizePool}
            </div>
            <div className="text-sm text-gray-400">Total Prize Pool</div>
          </div>
        </motion.div>

        {/* User Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Your Rank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard glowEffect className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-green to-cyan-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-black" />
                </div>
              </div>
              <div className="text-2xl font-bold text-cyber-green mb-1">
                #{currentUser.rank}
              </div>
              <div className="text-sm text-gray-400">Your Rank</div>
              <div className="text-xs text-cyan-400 mt-1">
                out of {contestInfo.totalParticipants}
              </div>
            </GlassCard>
          </motion.div>

          {/* Your Earnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard glowEffect className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentUser.isProfit ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {currentUser.isProfit ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  currentUser.isProfit ? "text-green-400" : "text-red-400"
                }`}
              >
                {currentUser.earnings}
              </div>
              <div className="text-sm text-gray-400">Your Earnings</div>
              <div className="text-xs text-gray-500 mt-1">
                Staked: {currentUser.stakeAmount}
              </div>
            </GlassCard>
          </motion.div>

          {/* Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard glowEffect className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {currentUser.score}
              </div>
              <div className="text-sm text-gray-400">Your Score</div>
              <div className="text-xs text-purple-300 mt-1">
                Excellent Performance!
              </div>
            </GlassCard>
          </motion.div>

          {/* Percentile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard glowEffect className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {currentUser.percentileRank}%
              </div>
              <div className="text-sm text-gray-400">Ahead of Others</div>
              <div className="text-xs text-yellow-300 mt-1">Top Performer!</div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-orbitron text-2xl font-bold text-white flex items-center">
                  <Crown className="w-6 h-6 mr-3 text-cyber-green" />
                  Final Leaderboard
                </h3>
                <div className="text-sm text-gray-400">
                  Top 10 / {contestInfo.totalParticipants} participants
                </div>
              </div>

              <div className="space-y-3">
                {leaderboardData.map((player, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      player.isCurrentUser
                        ? "bg-gradient-to-r from-cyber-green/30 to-cyan-500/30 border-2 border-cyber-green/50 shadow-lg shadow-cyber-green/20"
                        : player.rank === 1
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                        : player.rank === 2
                        ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30"
                        : player.rank === 3
                        ? "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border border-amber-600/30"
                        : "bg-gray-900/50 hover:bg-gray-800/50 border border-gray-700/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          player.rank === 1
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                            : player.rank === 2
                            ? "bg-gradient-to-r from-gray-300 to-gray-500 text-black"
                            : player.rank === 3
                            ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
                            : player.isCurrentUser
                            ? "bg-cyber-green text-black"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {player.rank <= 3 && player.rank === 1 && (
                          <Crown className="w-5 h-5" />
                        )}
                        {player.rank <= 3 && player.rank !== 1 && (
                          <Trophy className="w-4 h-4" />
                        )}
                        {player.rank > 3 && player.rank}
                      </div>

                      <div>
                        <div
                          className={`font-semibold text-lg ${
                            player.isCurrentUser
                              ? "text-cyber-green"
                              : player.rank === 1
                              ? "text-yellow-400"
                              : player.rank === 2
                              ? "text-gray-300"
                              : player.rank === 3
                              ? "text-amber-400"
                              : "text-white"
                          }`}
                        >
                          {player.name}
                          {player.isCurrentUser && (
                            <span className="ml-2 text-xs bg-cyber-green text-black px-2 py-1 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {player.score} points
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">
                        {player.earnings}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          player.change.startsWith("+")
                            ? "text-green-400"
                            : player.change.startsWith("-")
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {player.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Contest Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="h-full">
              <h3 className="font-orbitron text-xl font-bold text-white mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-cyber-green" />
                Contest Summary
              </h3>

              <div className="space-y-6">
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Challenge</div>
                  <div className="text-lg font-semibold text-white">
                    {contestInfo.name}
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Duration</div>
                  <div className="text-lg font-semibold text-white">
                    {contestInfo.duration}
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">
                    Total Participants
                  </div>
                  <div className="text-lg font-semibold text-white flex items-center">
                    <Users className="w-4 h-4 mr-2 text-cyber-green" />
                    {contestInfo.totalParticipants}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-cyber-green/20 to-cyan-500/20 rounded-lg border border-cyber-green/30">
                  <div className="text-sm text-gray-400 mb-1">
                    Prize Pool Distributed
                  </div>
                  <div className="text-2xl font-bold text-cyber-green">
                    {contestInfo.totalPrizePool}
                  </div>
                </div>

                <div className="pt-4">
                  <NeonButton size="md" className="w-full">
                    <Trophy className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-4 mt-8"
        >
          <NeonButton
            size="md"
            variant="secondary"
            onClick={() => navigate("/challenges")}
          >
            View More AI Challenges
          </NeonButton>
          <NeonButton>Share Results</NeonButton>
        </motion.div>
      </div>
    </div>
  );
};

export default ContestResultPage;
