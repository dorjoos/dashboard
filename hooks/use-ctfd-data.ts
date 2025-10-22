"use client";

import { useState, useEffect } from 'react';
import { CTFdTeam, CTFdChallenge, getTeamsRanked4to13, getTop3Teams, getAllChallenges, getAwardsData } from '@/lib/ctfd-api';

export interface UseCTFdDataReturn {
  top3Teams: CTFdTeam[];
  teams: CTFdTeam[];
  challenges: CTFdChallenge[];
  awards: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCTFdData(): UseCTFdDataReturn {
  const [top3Teams, setTop3Teams] = useState<CTFdTeam[]>([]);
  const [teams, setTeams] = useState<CTFdTeam[]>([]);
  const [challenges, setChallenges] = useState<CTFdChallenge[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch top 3 teams, teams 4-13, challenges, and awards in parallel
      const [top3Data, teamsData, challengesData, awardsData] = await Promise.all([
        getTop3Teams(),
        getTeamsRanked4to13(),
        getAllChallenges(),
        getAwardsData()
      ]);

      setTop3Teams(top3Data);
      setTeams(teamsData);
      setChallenges(challengesData);
      setAwards(awardsData);
    } catch (err) {
      console.error('Error fetching CTFd data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    top3Teams,
    teams,
    challenges,
    awards,
    loading,
    error,
    refetch: fetchData
  };
}
