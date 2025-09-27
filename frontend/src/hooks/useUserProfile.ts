import { useState, useEffect } from 'react';

interface UserProfile {
  wallet: string;
  nickname: string;
  goal: string;
  level: number;
  rank: string;
  totalEarned: string;
  challengesCompleted: number;
  dayStreak: number;
  joinDate: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Get user data from localStorage (set during auth)
    const userData = localStorage.getItem('cyberfit_user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setProfile({
        wallet: parsedData.wallet || '0x0000...0000',
        nickname: parsedData.nickname || 'CyberAthlete_2024',
        goal: parsedData.goal || 'General Fitness',
        level: 12,
        rank: 'Elite',
        totalEarned: '8.4 ETH',
        challengesCompleted: 127,
        dayStreak: 23,
        joinDate: new Date(parsedData.timestamp).toLocaleDateString() || 'Jan 2024'
      });
    }
  }, []);

  return profile;
};