import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Target, 
  Trophy, 
  BarChart3,
  Play,
  Users,
  DollarSign,
  Camera,
  Clock,
  Flame
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

type ActiveTab = 'challenges' | 'contests' | 'betting' | 'dashboard';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('challenges');
  const [showCameraModal, setShowCameraModal] = useState(false);

  const tabs = [
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'contests', label: 'Contests', icon: Trophy },
    { id: 'betting', label: 'Betting', icon: DollarSign },
    { id: 'dashboard', label: 'My Dashboard', icon: BarChart3 },
  ];

  const challenges = [
    { id: 1, name: 'Push-up Challenge', stake: '0.1 ETH', difficulty: 'Medium', duration: '30 days', participants: 1247 },
    { id: 2, name: 'Squat Master', stake: '0.05 ETH', difficulty: 'Easy', duration: '14 days', participants: 892 },
    { id: 3, name: 'Burpee Beast', stake: '0.2 ETH', difficulty: 'Hard', duration: '60 days', participants: 543 },
    { id: 4, name: 'Plank Warrior', stake: '0.08 ETH', difficulty: 'Medium', duration: '21 days', participants: 756 },
  ];

  const contests = [
    { id: 1, name: 'Summer Shred Competition', prize: '10 ETH', participants: 2547, timeLeft: '5d 12h' },
    { id: 2, name: 'Cardio King Challenge', prize: '5 ETH', participants: 1892, timeLeft: '2d 8h' },
    { id: 3, name: 'Strength Summit', prize: '15 ETH', participants: 3241, timeLeft: '12d 15h' },
  ];

  const renderChallenges = () => (
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

            {/* Camera preview frame */}
            <div className="relative mb-6">
              <div className="aspect-video bg-gray-900 rounded-lg border-2 border-cyber-green relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-dashed border-cyber-green opacity-50 rounded-lg" />
                <div className="flex items-center justify-center h-full">
                  <Camera className="w-16 h-16 text-cyber-green opacity-50" />
                </div>
                
                {/* Holographic corners */}
                <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-cyber-green opacity-80" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-cyber-green opacity-80" />
                
                {/* Scanning line */}
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

  const renderContests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron text-3xl font-bold text-cyber-green">Live Contests</h2>
        <div className="text-sm text-gray-400">
          Total Prize Pool: <span className="text-cyber-green font-bold">30 ETH</span>
        </div>
      </div>

      <div className="grid gap-6">
        {contests.map((contest) => (
          <GlassCard key={contest.id} glowEffect>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                  {contest.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1 text-cyber-green" />
                    Prize: {contest.prize}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {contest.participants} participants
                  </span>
                  <span className="flex items-center text-red-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {contest.timeLeft} left
                  </span>
                </div>
              </div>
              <div className="text-right">
                <NeonButton size="sm">
                  Join Contest
                </NeonButton>
              </div>
            </div>
            
            {/* Leaderboard preview */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-bold text-sm text-gray-300 mb-2">Top Performers</h4>
              <div className="space-y-1 text-sm">
                {[1, 2, 3].map((rank) => (
                  <div key={rank} className="flex justify-between items-center">
                    <span className="text-gray-400">
                      #{rank} Anonymous_User_{1000 + rank}
                    </span>
                    <span className="text-cyber-green font-bold">
                      {1000 - rank * 50} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderBetting = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-orbitron text-3xl font-bold text-cyber-green">Betting Market</h2>
        <div className="text-sm text-gray-400">
          Your Balance: <span className="text-cyber-green font-bold">1.25 ETH</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { event: 'Will User_1337 complete 1000 push-ups?', odds: '2.1x', pool: '0.8 ETH' },
          { event: 'Next challenge winner prediction', odds: '3.5x', pool: '1.2 ETH' },
          { event: 'Daily step count over 15,000', odds: '1.8x', pool: '0.6 ETH' },
          { event: 'Perfect form completion rate >90%', odds: '4.2x', pool: '2.1 ETH' },
        ].map((bet, index) => (
          <GlassCard key={index} glowEffect>
            <div className="mb-4">
              <h3 className="font-bold text-white mb-2">{bet.event}</h3>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>Pool: {bet.pool}</span>
                <span className="text-cyber-green font-bold text-lg">{bet.odds}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <NeonButton size="sm" className="flex-1">
                Bet YES
              </NeonButton>
              <NeonButton size="sm" variant="secondary" className="flex-1">
                Bet NO
              </NeonButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="font-orbitron text-3xl font-bold text-cyber-green">Performance Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <GlassCard glowEffect>
          <div className="text-center">
            <Trophy className="w-8 h-8 text-cyber-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">127</div>
            <div className="text-sm text-gray-400">Challenges Completed</div>
          </div>
        </GlassCard>
        
        <GlassCard glowEffect>
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-cyber-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">8.4 ETH</div>
            <div className="text-sm text-gray-400">Total Earned</div>
          </div>
        </GlassCard>
        
        <GlassCard glowEffect>
          <div className="text-center">
            <Flame className="w-8 h-8 text-cyber-green mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">23</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </div>
        </GlassCard>
      </div>

      {/* Charts Area */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-orbitron text-xl font-bold text-white mb-4">Weekly Progress</h3>
          <div className="h-48 flex items-end space-x-2">
            {[40, 65, 85, 45, 90, 75, 95].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full bg-cyber-green rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
                <div className="text-xs text-gray-400 mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-orbitron text-xl font-bold text-white mb-4">Achievement Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Strength Training', percentage: 85 },
              { label: 'Cardio Challenges', percentage: 70 },
              { label: 'Flexibility Goals', percentage: 60 },
              { label: 'Endurance Tests', percentage: 90 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-cyber-green">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-cyber-green h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex relative z-10">
      {/* Sidebar */}
      <div className="w-64 bg-cyber-black bg-opacity-50 backdrop-blur border-r border-cyber-green border-opacity-20 p-4">
        <div className="mb-8">
          <h1 className="font-orbitron text-2xl font-bold text-cyber-green">
            CYBER<span className="text-white">FIT</span>
          </h1>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-cyber-green bg-opacity-20 text-cyber-green border border-cyber-green'
                    : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* User stats sidebar */}
        <div className="mt-12">
          <GlassCard className="text-center p-4">
            <div className="w-16 h-16 rounded-full bg-cyber-green bg-opacity-20 border-2 border-cyber-green mx-auto mb-3 flex items-center justify-center">
              <span className="font-orbitron font-bold text-cyber-green">CY</span>
            </div>
            <div className="text-sm">
              <div className="text-white font-bold">CyberAthlete_2024</div>
              <div className="text-gray-400">Level 12 • Elite</div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'challenges' && renderChallenges()}
          {activeTab === 'contests' && renderContests()}
          {activeTab === 'betting' && renderBetting()}
          {activeTab === 'dashboard' && renderDashboard()}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;