import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, User, Target, Zap, Crown } from "lucide-react";
import GlassCard from "./GlassCard";
import NeonButton from "./NeonButton";

interface VerificationStepProps {
  wallet?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const VerificationStep = ({ wallet, onSubmit }: VerificationStepProps) => {
  const [selectedLevel, setSelectedLevel] = useState<string>("noob");
  const navigate = useNavigate();

  const levels = [
    { id: "noob", name: "Noob", icon: Zap },
    { id: "mid", name: "Mid", icon: Target },
    { id: "god", name: "God", icon: Crown },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    navigate("/dashboard");
  };

  return (
    <GlassCard className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-cyber-green bg-opacity-20 rounded-full border-2 border-cyber-green mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-cyber-green" />
        </div>
      </motion.div>

      <h2 className="font-orbitron text-2xl font-bold mb-2 text-cyber-green">
        Verify Your Details
      </h2>
      <p className="text-gray-300 text-sm mb-6">
        Confirm your wallet and answer a couple of quick questions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Wallet Verification */}
        <div className="bg-gray-900 border border-cyber-green border-opacity-30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-cyber-green" />
            <span className="text-cyber-green font-semibold text-sm">
              Wallet Connected
            </span>
          </div>
          <p className="text-gray-300 font-mono text-xs break-all">{wallet}</p>
        </div>

        {/* Level Selection */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <User className="w-4 h-4 text-cyber-green" />
            <span className="text-gray-300 text-sm font-medium">
              Select Your Fitness Level
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {levels.map((level) => (
              <motion.div
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all duration-300 text-center ${
                  selectedLevel === level.id
                    ? "border-cyber-green bg-cyber-green bg-opacity-20"
                    : "border-gray-700 bg-gray-800 hover:border-cyber-green hover:border-opacity-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center space-y-2">
                  <level.icon className="w-6 h-6 text-cyber-green" />
                  <span className="text-white text-xs font-bold uppercase">
                    {level.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Goal Input */}
        <div>
          <label className="block">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-cyber-green" />
              <span className="text-gray-300 text-sm font-medium">
                Your Fitness Goal
              </span>
            </div>
            <input
              name="goal"
              type="text"
              placeholder="e.g., Build strength, lose weight, run marathon..."
              className="w-full bg-gray-800 border border-cyber-green border-opacity-50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none transition-colors"
              required
              maxLength={100}
            />
          </label>
        </div>

        {/* Hidden input for selected level */}
        <input type="hidden" name="level" value={selectedLevel} />

        <NeonButton type="submit" className="w-full" size="md">
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Complete Setup & Enter</span>
          </div>
        </NeonButton>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        Your data is encrypted and stored securely on-chain
      </div>
    </GlassCard>
  );
};

export default VerificationStep;
