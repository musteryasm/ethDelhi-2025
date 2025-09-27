import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Clock,
  Play,
  Activity,
  Timer,
  Target,
} from "lucide-react";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";
import outputSquatGif from "../gifs/output_squat.gif";

const ContestsPage = () => {
  const [showContestModal, setShowContestModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState<any | null>(null);
  const [stakeInput, setStakeInput] = useState<string>("");
  const [isStarting, setIsStarting] = useState<boolean>(false);

  const contests = [
    {
      id: 1,
      name: "Max Squats in 5 Minutes",
      prize: "10 ETH",
      participants: 2547,
      timeLeft: "5d 12h",
      difficulty: "Hard",
      duration: "5 minutes",
      stake: "0.1 ETH",
      description:
        "Complete as many perfect squats as possible in 5 minutes. AI will track your form and count valid reps.",
      rules: [
        "Proper squat depth required",
        "No rest between reps",
        "AI form validation",
        "Top 10% share prize pool",
      ],
    },
    {
      id: 2,
      name: "100 Squats Speed Challenge",
      prize: "5 ETH",
      participants: 1892,
      timeLeft: "2d 8h",
      difficulty: "Medium",
      duration: "Until complete",
      stake: "0.05 ETH",
      description:
        "Complete 100 perfect squats as fast as possible. Fastest times win!",
      rules: [
        "Exactly 100 squats required",
        "Form matters over speed",
        "Single session only",
        "Winner takes 60% of pool",
      ],
    },
    {
      id: 3,
      name: "Squat Endurance Marathon",
      prize: "15 ETH",
      participants: 3241,
      timeLeft: "12d 15h",
      difficulty: "Extreme",
      duration: "30 minutes",
      stake: "0.2 ETH",
      description:
        "Maintain squat position for maximum time within 30 minutes. Longest hold wins.",
      rules: [
        "Continuous squat hold",
        "Proper form required",
        "No breaks allowed",
        "Progressive difficulty",
      ],
    },
    {
      id: 4,
      name: "Daily Squat Streak",
      prize: "8 ETH",
      participants: 1654,
      timeLeft: "1d 3h",
      difficulty: "Easy",
      duration: "7 days",
      stake: "0.03 ETH",
      description:
        "Complete 50 squats daily for 7 consecutive days. Consistency is key!",
      rules: [
        "50 squats per day",
        "7 day streak required",
        "Miss a day = elimination",
        "Completion bonus for all",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron text-3xl font-bold text-cyber-green">
          Live Contests
        </h2>
        <div className="text-sm text-gray-400">
          Total Prize Pool:{" "}
          <span className="text-cyber-green font-bold">38 ETH</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contests.map((contest) => (
          <GlassCard key={contest.id} glowEffect>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                  {contest.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      contest.difficulty === "Easy"
                        ? "bg-green-900 text-green-300"
                        : contest.difficulty === "Medium"
                        ? "bg-yellow-900 text-yellow-300"
                        : contest.difficulty === "Hard"
                        ? "bg-red-900 text-red-300"
                        : "bg-purple-900 text-purple-300"
                    }`}
                  >
                    {contest.difficulty}
                  </span>
                  <span className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    {contest.duration}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1 text-cyber-green" />
                    {contest.prize}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {contest.participants}
                  </span>
                  <span className="flex items-center text-red-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {contest.timeLeft}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-cyber-green font-bold text-lg mb-1">
                  {contest.stake}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <NeonButton
                size="sm"
                className="flex-1"
                onClick={() => {
                  setSelectedContest(contest);
                  setShowContestModal(true);
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Join Contest
              </NeonButton>
              <NeonButton size="sm" variant="secondary">
                View Details
              </NeonButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Contest Modal */}
      {showContestModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <GlassCard className="max-w-xl w-full max-h-[70vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h3 className="font-orbitron text-2xl font-bold text-cyber-green mb-2">
                {selectedContest?.name ?? "Contest Details"}
              </h3>
              <p className="text-gray-300 mb-4">
                {selectedContest?.description ?? "Get ready to compete!"}
              </p>
            </div>

            <div className="relative mb-6">
              <div className="aspect-video bg-gray-900 rounded-lg border-2 border-cyber-green relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-dashed border-cyber-green opacity-50 rounded-lg" />
                <div className="flex items-center justify-center h-full">
                  <img
                    src={outputSquatGif}
                    alt="contest demo"
                    className="max-w-full h-auto object-contain"
                  />
                </div>

                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cyber-green opacity-80" />
              </div>
            </div>

            {selectedContest && (
              <div className="mb-6">
                <h4 className="font-orbitron text-lg font-bold text-white mb-3">
                  Contest Rules
                </h4>
                <div className="space-y-2">
                  {selectedContest.rules.map((rule: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-300"
                    >
                      <Target className="w-4 h-4 mr-2 text-cyber-green flex-shrink-0" />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-3"></div>

              <div className="flex space-x-4">
                <NeonButton
                  className="flex-1"
                  onClick={async () => {
                    if (!selectedContest) return;
                    try {
                      setIsStarting(true);
                      // Open the detection interface
                      window.open("http://localhost:5001/", "_blank");
                      setShowContestModal(false);
                    } catch (err) {
                      console.error(err);
                    } finally {
                      setIsStarting(false);
                    }
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {isStarting ? "Starting..." : "Start Contest"}
                </NeonButton>
                <NeonButton
                  variant="secondary"
                  onClick={() => {
                    setShowContestModal(false);
                    setSelectedContest(null);
                    setStakeInput("");
                  }}
                >
                  Cancel
                </NeonButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default ContestsPage;
