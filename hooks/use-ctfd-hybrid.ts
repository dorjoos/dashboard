import { useState, useEffect } from 'react';
import { 
  getTop3Teams, 
  getTeamsRanked4to13, 
  getAllChallenges, 
  getAwardsData 
} from '@/lib/ctfd-hybrid';

export interface CTFdData {
  top3Teams: any[];
  teamsRanked4to13: any[];
  challenges: any[];
  awards: any[];
  loading: boolean;
  error: string | null;
}

export function useCTFdHybrid(): CTFdData {
  const [top3Teams, setTop3Teams] = useState<any[]>([]);
  const [teamsRanked4to13, setTeamsRanked4to13] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [top3Data, teams4to13Data, challengesData, awardsData] = await Promise.all([
        getTop3Teams(),
        getTeamsRanked4to13(),
        getAllChallenges(),
        getAwardsData()
      ]);

      setTop3Teams(top3Data);
      setTeamsRanked4to13(teams4to13Data);
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
    teamsRanked4to13,
    challenges,
    awards,
    loading,
    error
  };
}
