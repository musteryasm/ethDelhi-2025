import { Trophy, Users, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';

const ContestsPage = () => {
  const contests = [
    { id: 1, name: 'Summer Shred Competition', prize: '10 ETH', participants: 2547, timeLeft: '5d 12h' },
    { id: 2, name: 'Cardio King Challenge', prize: '5 ETH', participants: 1892, timeLeft: '2d 8h' },
    { id: 3, name: 'Strength Summit', prize: '15 ETH', participants: 3241, timeLeft: '12d 15h' },
  ];

  return (
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
};

export default ContestsPage;