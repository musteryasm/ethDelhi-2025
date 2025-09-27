import { motion } from 'framer-motion';
import { 
  Trophy, 
  DollarSign, 
  Flame, 
  TrendingUp, 
  Target, 
  Clock, 
  Activity, 
  Award,
  BarChart3,
  Calendar,
  Zap,
  Users,
  Star
} from 'lucide-react';
import GlassCard from '../components/GlassCard';

const DashboardAnalyticsPage = () => {
  const achievements = [
    { label: 'Strength Training', percentage: 85, color: 'bg-red-500', trend: '+5%' },
    { label: 'Cardio Challenges', percentage: 70, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Flexibility Goals', percentage: 60, color: 'bg-purple-500', trend: '+8%' },
    { label: 'Endurance Tests', percentage: 90, color: 'bg-green-500', trend: '+3%' },
  ];

  const weeklyData = [
    { day: 'Mon', value: 40, calories: 320, exercises: 5 },
    { day: 'Tue', value: 65, calories: 480, exercises: 8 },
    { day: 'Wed', value: 85, calories: 620, exercises: 12 },
    { day: 'Thu', value: 45, calories: 380, exercises: 6 },
    { day: 'Fri', value: 90, calories: 750, exercises: 15 },
    { day: 'Sat', value: 75, calories: 540, exercises: 9 },
    { day: 'Sun', value: 95, calories: 820, exercises: 18 }
  ];

  const recentAchievements = [
    { title: 'Perfect Week', description: '7 days straight completion', icon: Award, time: '2 days ago' },
    { title: 'High Performer', description: 'Top 10% this month', icon: Star, time: '1 week ago' },
    { title: 'Consistency King', description: '30-day streak milestone', icon: Target, time: '2 weeks ago' },
  ];

  const leaderboardData = [
    { rank: 1, name: 'You', score: 1250, change: '+15' },
    { rank: 2, name: 'CyberWarrior_X', score: 1180, change: '-5' },
    { rank: 3, name: 'FitMaster2024', score: 1150, change: '+8' },
    { rank: 4, name: 'IronPhoenix', score: 1100, change: '+12' },
    { rank: 5, name: 'QuantumFit', score: 1080, change: '-2' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-orbitron text-4xl font-bold text-cyber-green mb-2">
            Performance Analytics
          </h2>
          <p className="text-gray-400">Track your fitness journey with advanced metrics</p>
        </motion.div>
        
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+12% this week</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard glowEffect className="group hover:scale-105 transition-all duration-300">
            <div className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Trophy className="w-10 h-10 text-cyber-green mx-auto mb-3 group-hover:animate-bounce" />
              <div className="text-3xl font-bold text-white mb-1">127</div>
              <div className="text-sm text-gray-400 mb-2">Challenges Completed</div>
              <div className="text-xs text-green-400 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8 this week
              </div>
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard glowEffect className="group hover:scale-105 transition-all duration-300">
            <div className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <DollarSign className="w-10 h-10 text-yellow-400 mx-auto mb-3 group-hover:animate-pulse" />
              <div className="text-3xl font-bold text-white mb-1">8.4 ETH</div>
              <div className="text-sm text-gray-400 mb-2">Total Earned</div>
              <div className="text-xs text-yellow-400 flex items-center justify-center">
                <Zap className="w-3 h-3 mr-1" />
                +0.3 ETH today
              </div>
            </div>
          </GlassCard>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard glowEffect className="group hover:scale-105 transition-all duration-300">
            <div className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Flame className="w-10 h-10 text-orange-400 mx-auto mb-3 group-hover:animate-bounce" />
              <div className="text-3xl font-bold text-white mb-1">23</div>
              <div className="text-sm text-gray-400 mb-2">Day Streak</div>
              <div className="text-xs text-orange-400 flex items-center justify-center">
                <Target className="w-3 h-3 mr-1" />
                7 days to goal
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard glowEffect className="group hover:scale-105 transition-all duration-300">
            <div className="text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Activity className="w-10 h-10 text-blue-400 mx-auto mb-3 group-hover:animate-pulse" />
              <div className="text-3xl font-bold text-white mb-1">94%</div>
              <div className="text-sm text-gray-400 mb-2">Success Rate</div>
              <div className="text-xs text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2% vs last month
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Progress */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-orbitron text-xl font-bold text-white flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-cyber-green" />
                Weekly Performance
              </h3>
              <div className="text-sm text-gray-400">
                Avg: 68% completion
              </div>
            </div>
            
            <div className="h-64 flex items-end space-x-3 mb-4">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex-1 group">
                  <div className="relative">
                    <motion.div
                      className="w-full bg-gradient-to-t from-cyber-green to-cyan-400 rounded-t-lg relative overflow-hidden"
                      initial={{ height: 0 }}
                      animate={{ height: `${day.value * 2}px` }}
                      transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Hover tooltip */}
                      <div className="absolute inset-0 bg-white bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      <div>{day.calories} calories</div>
                      <div>{day.exercises} exercises</div>
                      <div>{day.value}% completion</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-2 text-center font-medium">
                    {day.day}
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-400">4,320</div>
                <div className="text-xs text-gray-400">Total Calories</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">73</div>
                <div className="text-xs text-gray-400">Exercises Done</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">69%</div>
                <div className="text-xs text-gray-400">Avg Completion</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="h-full">
            <h3 className="font-orbitron text-xl font-bold text-white mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-cyber-green" />
              Leaderboard
            </h3>
            
            <div className="space-y-3">
              {leaderboardData.map((player, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    player.rank === 1 
                      ? 'bg-gradient-to-r from-cyber-green/20 to-cyan-500/20 border border-cyber-green/30' 
                      : 'bg-gray-900/50 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      player.rank === 1 ? 'bg-cyber-green text-black' :
                      player.rank === 2 ? 'bg-gray-400 text-black' :
                      player.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <div className={`font-semibold ${player.rank === 1 ? 'text-cyber-green' : 'text-white'}`}>
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {player.score} points
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-xs font-medium ${
                    player.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {player.change}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Achievement Progress and Recent Achievements */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Achievement Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard>
            <h3 className="font-orbitron text-xl font-bold text-white mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-cyber-green" />
              Achievement Progress
            </h3>
            
            <div className="space-y-4">
              {achievements.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-cyber-green font-bold">{item.percentage}%</span>
                      <span className="text-xs text-green-400">{item.trend}</span>
                    </div>
                  </div>
                  
                  <div className="relative w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${item.color} relative`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.9 + index * 0.1, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard>
            <h3 className="font-orbitron text-xl font-bold text-white mb-6 flex items-center">
              <Award className="w-5 h-5 mr-2 text-cyber-green" />
              Recent Achievements
            </h3>
            
            <div className="space-y-4">
              {recentAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gradient-to-r from-cyber-green/10 to-transparent rounded-lg border border-cyber-green/20 hover:border-cyber-green/40 transition-all group"
                  >
                    <div className="w-12 h-12 bg-cyber-green/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-cyber-green/30 transition-colors">
                      <Icon className="w-6 h-6 text-cyber-green" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-semibold text-white group-hover:text-cyber-green transition-colors">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-400 mb-1">
                        {achievement.description}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {achievement.time}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardAnalyticsPage;