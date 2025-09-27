import { motion } from 'framer-motion';
import { CheckCircle, User, Target } from 'lucide-react';
import GlassCard from './GlassCard';
import NeonButton from './NeonButton';

interface VerificationStepProps {
  wallet?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const VerificationStep = ({ wallet, onSubmit }: VerificationStepProps) => {
  return (
    <GlassCard className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
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

      <form onSubmit={onSubmit} className="space-y-6 text-left">
        {/* Wallet Verification */}
        <div className="bg-gray-900 border border-cyber-green border-opacity-30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-cyber-green" />
            <span className="text-cyber-green font-semibold text-sm">Wallet Connected</span>
          </div>
          <p className="text-gray-300 font-mono text-xs break-all">
            {wallet}
          </p>
        </div>

        {/* Nickname Input */}
        <div>
          <label className="block">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-cyber-green" />
              <span className="text-gray-300 text-sm font-medium">Preferred Nickname</span>
            </div>
            <input
              name="nickname"
              type="text"
              placeholder="Enter your cyber identity..."
              className="w-full bg-gray-800 border border-cyber-green border-opacity-50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none transition-colors"
              required
              maxLength={20}
            />
          </label>
        </div>

        {/* Goal Input */}
        <div>
          <label className="block">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-cyber-green" />
              <span className="text-gray-300 text-sm font-medium">Your Fitness Goal</span>
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

        <NeonButton type="submit" className="w-full" size="lg">
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
