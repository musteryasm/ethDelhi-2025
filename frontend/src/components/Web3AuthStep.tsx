import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Globe } from 'lucide-react';
import GlassCard from './GlassCard';
import NeonButton from './NeonButton';

interface Web3AuthStepProps {
  isConnecting: boolean;
  onAuth: () => void;
}

const Web3AuthStep = ({ isConnecting, onAuth }: Web3AuthStepProps) => {
  return (
    <GlassCard className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-cyber-green bg-opacity-20 rounded-full border-2 border-cyber-green mx-auto mb-4 flex items-center justify-center">
          <Shield className="w-10 h-10 text-cyber-green" />
        </div>
      </motion.div>

      <h2 className="font-orbitron text-2xl font-bold mb-2 text-cyber-green">
        Web3 Authentication
      </h2>
      <p className="text-gray-300 text-sm mb-6">
        Secure decentralized authentication protocol initialization
      </p>

      {/* Authentication Features */}
      <div className="space-y-3 mb-6 text-left">
        <div className="flex items-center space-x-3 text-sm">
          <Lock className="w-4 h-4 text-cyber-green" />
          <span className="text-gray-300">End-to-end </span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Globe className="w-4 h-4 text-cyber-green" />
          <span className="text-gray-300">Decentralized identity</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <Shield className="w-4 h-4 text-cyber-green" />
          <span className="text-gray-300">Zero-knowledge proofs</span>
        </div>
      </div>

      <NeonButton onClick={onAuth} className="w-full" size="lg" disabled={isConnecting}>
        {isConnecting ? (
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 animate-spin" />
            <span>Authenticating...</span>
          </div>
        ) : (
          'Initialize Auth Sequence'
        )}
      </NeonButton>


    </GlassCard>
  );
};

export default Web3AuthStep;