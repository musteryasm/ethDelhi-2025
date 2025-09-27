import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Play, Activity, Camera } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

const ChallengesPage = () => {
  const [showCameraModal, setShowCameraModal] = useState(false);

  const challenges = [
    { id: 1, name: 'Push-up Challenge', stake: '0.1 ETH', difficulty: 'Medium', duration: '30 days', participants: 1247 },
    { id: 2, name: 'Squat Master', stake: '0.05 ETH', difficulty: 'Easy', duration: '14 days', participants: 892 },
    { id: 3, name: 'Burpee Beast', stake: '0.2 ETH', difficulty: 'Hard', duration: '60 days', participants: 543 },
    { id: 4, name: 'Plank Warrior', stake: '0.08 ETH', difficulty: 'Medium', duration: '21 days', participants: 756 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron text-3xl font-bold text-cyber-green">Active Challenges</h2>
        <div className="text-sm text-gray-400">
          Total Staked: <span className="text-cyber-green font-bold">2.4 ETH</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <GlassCard key={challenge.id} glowEffect>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                  {challenge.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className={`px-2 py-1 rounded text-xs ${
                    challenge.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {challenge.duration}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {challenge.participants}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-cyber-green font-bold text-lg">
                  {challenge.stake}
                </div>
                <div className="text-xs text-gray-400">Stake Required</div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <NeonButton 
                size="sm" 
                className="flex-1"
                onClick={() => setShowCameraModal(true)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Challenge
              </NeonButton>
              <NeonButton size="sm" variant="secondary">
                View Details
              </NeonButton>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        >
          <GlassCard className="max-w-2xl w-full">
            <div className="text-center mb-6">
              <h3 className="font-orbitron text-2xl font-bold text-cyber-green mb-2">
                AI Challenge Verification
              </h3>
              <p className="text-gray-300">
                Position yourself in the camera frame to begin tracking
              </p>
            </div>

            <div className="relative mb-6">
              <div className="aspect-video bg-gray-900 rounded-lg border-2 border-cyber-green relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-dashed border-cyber-green opacity-50 rounded-lg" />
                <div className="flex items-center justify-center h-full">
                  <Camera className="w-16 h-16 text-cyber-green opacity-50" />
                </div>
                
                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cyber-green opacity-80" />
                
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-cyber-green opacity-70"
                  animate={{ y: [0, 400, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <NeonButton className="flex-1">
                <Activity className="w-4 h-4 mr-2" />
                Start Recording
              </NeonButton>
              <NeonButton 
                variant="secondary"
                onClick={() => setShowCameraModal(false)}
              >
                Cancel
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
};

export default ChallengesPage;