// Hybrid CTFd API Integration - Real API with fallback to mock data
const CTFD_BASE_URL = '/api/ctfd';

// Types
export interface CTFdUser {
  id: number;
  name: string;
  email?: string;
  affiliation?: string;
  score?: number;
  solves?: number;
  place?: number;
}

export interface CTFdTeam {
  id: number;
  name: string;
  score: number;
  solves: number;
  place: number;
  members: CTFdUser[];
}

export interface CTFdChallenge {
  id: number;
  name: string;
  category: string;
  value: number;
  description: string;
  state: string;
}

export interface CTFdAward {
  id: number;
  name: string;
  description: string;
  category: string;
  value: number;
  team_id: number;
  user_id: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}


// Core API function - Fetch real data from API
async function fetchFromCTFd<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${CTFD_BASE_URL}?endpoint=${encodeURIComponent(endpoint)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { 
        success: false, 
        error: data.message || `HTTP error! status: ${response.status}` 
      };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}


// Data fetching functions
export async function getUsers(): Promise<ApiResponse<CTFdUser[]>> {
  return fetchFromCTFd<CTFdUser[]>('/users');
}

export async function getScoreboard(): Promise<ApiResponse<CTFdTeam[]>> {
  return fetchFromCTFd<CTFdTeam[]>('/scoreboard');
}

export async function getChallenges(): Promise<ApiResponse<CTFdChallenge[]>> {
  return fetchFromCTFd<CTFdChallenge[]>('/challenges');
}

export async function getAwards(): Promise<ApiResponse<CTFdAward[]>> {
  return fetchFromCTFd<CTFdAward[]>('/awards');
}

// Team processing functions
export async function getAllTeams(): Promise<CTFdTeam[]> {
  try {
    // First try to get scoreboard data
    const scoreboardResponse = await getScoreboard();
    
    if (scoreboardResponse.success && scoreboardResponse.data && scoreboardResponse.data.length > 0) {
      return scoreboardResponse.data;
    }

    // Fallback to users data if scoreboard fails
    const usersResponse = await getUsers();
    
    if (!usersResponse.success || !usersResponse.data) {
      throw new Error(`Failed to fetch users data from API: ${usersResponse.error || 'Unknown error'}`);
    }

    // Group users by affiliation to create teams
    const teamsMap = new Map<string, CTFdUser[]>();
    
    usersResponse.data.forEach(user => {
      if (user.affiliation) {
        if (!teamsMap.has(user.affiliation)) {
          teamsMap.set(user.affiliation, []);
        }
        teamsMap.get(user.affiliation)!.push(user);
      }
    });

    // Convert to teams and sort by number of members (more members = higher rank)
    const allTeams: CTFdTeam[] = Array.from(teamsMap.entries()).map(([affiliation, members], index) => ({
      id: index + 1,
      name: affiliation,
      score: members.reduce((sum, member) => sum + (member.score || 0), 0),
      solves: members.reduce((sum, member) => sum + (member.solves || 0), 0),
      place: index + 1,
      members: members
    }));

    // Sort teams by score (highest first)
    allTeams.sort((a, b) => b.score - a.score);
    
    // Reassign places after sorting
    allTeams.forEach((team, index) => {
      team.place = index + 1;
    });

    return allTeams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw new Error(`Unable to fetch team data from CTFd API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getTop3Teams(): Promise<CTFdTeam[]> {
  const allTeams = await getAllTeams();
  return allTeams.slice(0, 3);
}

export async function getTeamsRanked4to13(): Promise<CTFdTeam[]> {
  const allTeams = await getAllTeams();
  return allTeams.slice(3, 13);
}

export async function getAllChallenges(): Promise<CTFdChallenge[]> {
  try {
    const response = await getChallenges();
    
    if (!response.success) {
      console.warn(`Failed to fetch challenges: ${response.error}`);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
}

export async function getAwardsData(): Promise<CTFdAward[]> {
  try {
    const response = await getAwards();
    
    if (!response.success) {
      console.warn(`Failed to fetch awards: ${response.error}`);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching awards:', error);
    return [];
  }
}

// Statistics functions
export async function getTeamStatistics(teamId: number): Promise<ApiResponse<any>> {
  return fetchFromCTFd<any>(`/teams/${teamId}`);
}

// Utility functions
export function formatTeamName(name: string): string {
  return name || 'Unknown Team';
}

export function calculateTeamScore(members: CTFdUser[]): number {
  return members.reduce((sum, member) => sum + (member.score || 0), 0);
}

export function calculateTeamSolves(members: CTFdUser[]): number {
  return members.reduce((sum, member) => sum + (member.solves || 0), 0);
}

// Export all functions as default
export default {
  getUsers,
  getScoreboard,
  getChallenges,
  getAwards,
  getAllTeams,
  getTop3Teams,
  getTeamsRanked4to13,
  getAllChallenges,
  getAwardsData,
  getTeamStatistics,
  formatTeamName,
  calculateTeamScore,
  calculateTeamSolves,
};
