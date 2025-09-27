import { motion } from 'framer-motion';
import { User, Wallet, Target, Calendar, Award, TrendingUp, Copy, ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';
import { useUserProfile } from '../hooks/useUserProfile';

interface ProfileCardProps {
  isCollapsed: boolean;
}

const ProfileCard = ({ isCollapsed }: ProfileCardProps) => {
  const profile = useUserProfile();

  const copyWallet = () => {
    if (profile?.wallet) {
      navigator.clipboard.writeText(profile.wallet);
      // Could add toast notification here
    }
  };

  if (!profile) return null;

  if (isCollapsed) {
    return (
      <GlassCard className="text-center p-3">
        <div className="w-12 h-12 rounded-full bg-cyber-green bg-opacity-20 border-2 border-cyber-green mx-auto flex items-center justify-center">
          <span className="font-orbitron font-bold text-cyber-green text-sm">
            {profile.nickname.slice(0, 2).toUpperCase()}
          </span>
        </div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-4 mb-4">
        {/* Profile Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 rounded-full bg-cyber-green bg-opacity-20 border-2 border-cyber-green mx-auto mb-3 flex items-center justify-center">
            <span className="font-orbitron font-bold text-cyber-green">
              {profile.nickname.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="text-white font-bold text-lg">{profile.nickname}</div>
          <div className="text-cyber-green text-sm">Level {profile.level} • {profile.rank}</div>
        </div>

        {/* Wallet */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="flex items-center">
              <Wallet className="w-3 h-3 mr-1" />
              Wallet
            </span>
            <div className="flex space-x-1">
              <button onClick={copyWallet} className="hover:text-cyber-green transition-colors">
                <Copy className="w-3 h-3" />
              </button>
              <button className="hover:text-cyber-green transition-colors">
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="text-white text-xs font-mono bg-gray-900 px-2 py-1 rounded border border-cyber-green border-opacity-30">
            {profile.wallet.slice(0, 6)}...{profile.wallet.slice(-4)}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center p-2 bg-gray-900 bg-opacity-50 rounded border border-cyber-green border-opacity-20">
            <div className="text-cyber-green font-bold">{profile.challengesCompleted}</div>
            <div className="text-gray-400">Completed</div>
          </div>
          <div className="text-center p-2 bg-gray-900 bg-opacity-50 rounded border border-cyber-green border-opacity-20">
            <div className="text-cyber-green font-bold">{profile.totalEarned}</div>
            <div className="text-gray-400">Earned</div>
          </div>
        </div>
      </GlassCard>

      {/* Goal Card */}
      <GlassCard className="p-3 text-center">
        <Target className="w-4 h-4 text-cyber-green mx-auto mb-2" />
        <div className="text-xs text-gray-300 mb-1">Current Goal</div>
        <div className="text-white text-sm font-semibold">{profile.goal}</div>
      </GlassCard>
    </motion.div>
  );
};

export default ProfileCard;