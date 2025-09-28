import { useState, useEffect, useCallback } from 'react';
import { apiCall, API_ENDPOINTS } from '../config/api';

export const useContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiCall("http://localhost:3001/api/contests");
      
      if (data.contests && Array.isArray(data.contests)) {
        setContests(data.contests);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error fetching contests:', err);
      setError(err.message);
      
      // Fallback to static data
      const fallbackContests = [
        {
          id: 0,
          name: "Push-up Challenge (Fallback)",
          stakeAmount: "100000000000000000", // 0.1 ETH in wei
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000) + 30 * 24 * 3600,
          maxParticipants: 100,
          minParticipants: 5,
          participantCount: 23,
          difficulty: "Medium",
          rewardsDistributed: false,
        },
        {
          id: 1,
          name: "Squat Master (Fallback)",
          stakeAmount: "50000000000000000", // 0.05 ETH in wei
          startTime: Math.floor(Date.now() / 1000),
          endTime: Math.floor(Date.now() / 1000) + 14 * 24 * 3600,
          maxParticipants: 50,
          minParticipants: 5,
          participantCount: 12,
          difficulty: "Easy",
          rewardsDistributed: false,
        },
      ];
      
      setContests(fallbackContests);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUserJoinedContests = useCallback(async (userAddress) => {
    if (!userAddress || contests.length === 0) return new Set();

    const joinedSet = new Set();

    for (const contest of contests) {
      try {
        const data = await apiCall(API_ENDPOINTS.CONTEST_JOINED(contest.id, userAddress));
        if (data.hasJoined) {
          joinedSet.add(contest.id);
        }
      } catch (error) {
        console.error(`Error checking join status for contest ${contest.id}:`, error);
      }
    }

    return joinedSet;
  }, [contests]);

  useEffect(() => {
    console.log("Fetching contests");
    fetchContests();
  }, [fetchContests]);

  return {
    contests,
    loading,
    error,
    refetch: fetchContests,
    checkUserJoinedContests,
  };
};
