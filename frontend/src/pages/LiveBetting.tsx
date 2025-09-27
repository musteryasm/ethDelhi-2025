import { useState } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Trophy } from "lucide-react";
import GlassCard from "../components/GlassCard";

interface Player {
  id: number;
  name: string;
  videoSrc: string;
  odds: string;
  totalBets: string;
  performance: string;
  status: "live" | "completed" | "upcoming";
}

interface UserBet {
  playerId: number;
  amount: string;
}

const LiveBettingPage = () => {
  const [userBets] = useState<UserBet[]>([
    { playerId: 1, amount: "0.15 ETH" }, // User has bet on CyberWarrior
    { playerId: 3, amount: "0.08 ETH" }, // User has bet on SquatKing
    { playerId: 5, amount: "0.05 ETH" }, // User has bet on IronPump
  ]);

  const players: Player[] = [
    {
      id: 1,
      name: "SquatMaster",
      videoSrc: "/src/gifs/squat.mp4",
      odds: "2.5x",
      totalBets: "1.2 ETH",
      performance: "85%",
      status: "live",
    },
    {
      id: 2,
      name: "PushUpPro",
      videoSrc: "/src/gifs/push-up.mp4",
      odds: "1.8x",
      totalBets: "2.4 ETH",
      performance: "92%",
      status: "live",
    },
    {
      id: 3,
      name: "PullUpKing",
      videoSrc: "/src/gifs/pull-up.mp4",
      odds: "3.2x",
      totalBets: "0.8 ETH",
      performance: "78%",
      status: "live",
    },
    {
      id: 4,
      name: "SitUpChamp",
      videoSrc: "/src/gifs/sit-up.mp4",
      odds: "2.1x",
      totalBets: "1.6 ETH",
      performance: "88%",
      status: "live",
    },
    {
      id: 5,
      name: "WalkWarrior",
      videoSrc: "/src/gifs/walk.mp4",
      odds: "4.0x",
      totalBets: "0.5 ETH",
      performance: "65%",
      status: "live",
    },
  ];

  const getUserBet = (playerId: number) => {
    return userBets.find((bet) => bet.playerId === playerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron text-3xl font-bold text-cyber-green">
          Live Betting Arena
        </h2>
        <div className="text-sm text-gray-400">
          Total Pool:{" "}
          <span className="text-cyber-green font-bold">6.5 ETH</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Betting Status */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-6">
            <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-cyber-green" />
              Betting Status
            </h3>

            <div className="text-center text-gray-400 py-6">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-cyber-green opacity-70" />
              <p className="text-cyber-green font-bold mb-2">
                Betting Complete!
              </p>
              <p className="text-sm">You've placed bets on 3 players</p>
              <p className="text-xs text-gray-500 mt-2">
                Contest in progress...
              </p>

              <div className="mt-4 text-center">
                <div className="text-cyber-green font-bold text-lg">
                  0.28 ETH
                </div>
                <div className="text-xs text-gray-400">Total Bet Amount</div>
              </div>
            </div>

            {/* User's Current Bets */}
            {userBets.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-orbitron text-lg font-bold text-white mb-3 flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-cyber-green" />
                  Your Bets
                </h4>
                <div className="space-y-2">
                  {userBets.map((bet) => {
                    const player = players.find((p) => p.id === bet.playerId);
                    return (
                      <div
                        key={bet.playerId}
                        className="bg-cyber-green bg-opacity-10 border border-cyber-green border-opacity-30 rounded-lg p-2"
                      >
                        <div className="text-cyber-green font-bold text-sm">
                          {player?.name}
                        </div>
                        <div className="text-xs text-gray-300">
                          Bet: {bet.amount} • Odds: {player?.odds}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Side - Video Grid */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {players.map((player) => {
              const userBet = getUserBet(player.id);
              const hasBet = !!userBet;

              return (
                <motion.div
                  key={player.id}
                  className={`transition-all duration-300 rounded-xl ${
                    hasBet
                      ? "border-2 border-cyber-green border-opacity-60 bg-cyber-green bg-opacity-5"
                      : "border border-gray-700"
                  }`}
                >
                  <GlassCard>
                    {/* Video */}
                    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-3">
                      <video
                        src={player.videoSrc}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2">
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            player.status === "live"
                              ? "bg-red-600 text-white"
                              : "bg-gray-600 text-gray-300"
                          }`}
                        >
                          {player.status.toUpperCase()}
                        </div>
                      </div>

                      {/* Bet Indicator */}
                      {hasBet && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-cyber-green text-black px-2 py-1 rounded text-xs font-bold">
                            BETTED
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-orbitron font-bold text-white">
                          {player.name}
                        </h3>
                        <div className="text-cyber-green font-bold">
                          {player.odds}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center text-gray-400">
                          <Users className="w-3 h-3 mr-1" />
                          {player.totalBets}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {player.performance}
                        </div>
                      </div>

                      {hasBet && (
                        <div className="bg-cyber-green bg-opacity-20 border border-cyber-green border-opacity-50 rounded p-2 text-center">
                          <div className="text-cyber-green font-bold text-sm">
                            Your Bet: {userBet.amount}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveBettingPage;
