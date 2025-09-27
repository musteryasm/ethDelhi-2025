import { motion } from 'framer-motion';
import { User, Wallet, Target, Calendar, Award, TrendingUp, Edit, Settings, LogOut } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { useUserProfile } from '../hooks/useUserProfile';

const ProfilePage = () => {
  const profile = useUserProfile();

  if (!profile) {
    return <div className="text-center text-gray-400">Loading profile...</div>;
  }

  const achievements = [
    { title: 'First Challenge', description: 'Completed your first fitness challenge', date: 'Jan 2024', icon: Award },
    { title: 'Streak Master', description: '30-day consistency streak', date: 'Feb 2024', icon: TrendingUp },
    { title: 'High Earner', description: 'Earned over 5 ETH in rewards', date: 'Mar 2024', icon: Wallet },
    { title: 'Elite Status', description: 'Reached Elite rank', date: 'Apr 2024', icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-orbitron text-3xl font-bold text-cyber-green mb-2">Profile Center</h1>
          <p className="text-gray-400">Manage your Fitter Coin identity and track your progress</p>
        </motion.div>
        <div className="flex space-x-2">
          <NeonButton size="sm" variant="secondary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </NeonButton>
          <NeonButton size="sm" variant="secondary">
            <Settings className="w-4 h-4" />
          </NeonButton>
        </div>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard glowEffect>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-cyber-green bg-opacity-20 border-2 border-cyber-green flex items-center justify-center">
                  <span className="font-orbitron font-bold text-cyber-green text-xl">
                    {profile.nickname.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="font-orbitron text-2xl font-bold text-white">{profile.nickname}</h2>
                  <div className="flex items-center space-x-2 text-cyber-green">
                    <Award className="w-4 h-4" />
                    <span>Level {profile.level} • {profile.rank}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {profile.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="border-t border-gray-700 pt-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-cyber-green" />
                  <span className="text-gray-300 font-medium">Connected Wallet</span>
                </div>
                <div className="text-cyber-green text-sm">●  Connected</div>
              </div>
              <div className="mt-2 font-mono text-white bg-gray-900 px-3 py-2 rounded border border-cyber-green border-opacity-30">
                {profile.wallet}
              </div>
            </div>

            {/* Goal Section */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-cyber-green" />
                <span className="text-gray-300 font-medium">Current Fitness Goal</span>
              </div>
              <p className="text-white text-lg">{profile.goal}</p>
            </div>
          </GlassCard>

          {/* Achievements */}
          <GlassCard>
            <h3 className="font-orbitron text-xl font-bold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 text-cyber-green mr-2" />
              Achievements
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gray-900 bg-opacity-50 rounded border border-cyber-green border-opacity-20"
                  >
                    <div className="w-8 h-8 bg-cyber-green bg-opacity-20 rounded border border-cyber-green flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-cyber-green" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-400 mb-1">{achievement.description}</div>
                      <div className="text-xs text-cyber-green">{achievement.date}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-orbitron text-lg font-bold text-white mb-4">Performance Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Challenges Completed</span>
                <span className="text-cyber-green font-bold">{profile.challengesCompleted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Earned</span>
                <span className="text-cyber-green font-bold">{profile.totalEarned}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Current Streak</span>
                <span className="text-cyber-green font-bold">{profile.dayStreak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Success Rate</span>
                <span className="text-cyber-green font-bold">94%</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-orbitron text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <NeonButton size="sm" className="w-full" variant="secondary">
                Update Goal
              </NeonButton>
              <NeonButton size="sm" className="w-full" variant="secondary">
                Privacy Settings
              </NeonButton>
              <NeonButton size="sm" className="w-full" variant="secondary">
                Export Data
              </NeonButton>
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900 hover:bg-opacity-20 rounded transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;