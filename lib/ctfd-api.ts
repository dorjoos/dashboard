// CTFd API Service
const CTFD_BASE_URL = 'http://ethics.golomtbank.com/api/v1'; // Use Next.js proxy to access external API
const CTFD_TOKEN = 'ctfd_baac942af8073819f03340b1d2f96b37266c01040bcc118c04e9c05cdedab664';

// Interfaces
export interface CTFdUser {
  id: number;
  name: string;
  email: string;
  affiliation?: string;
  score: number;
  solves: number;
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

export interface CTFdUsersResponse {
  success: boolean;
  data?: CTFdUser[];
  error?: string;
}

export interface CTFdScoreboardResponse {
  success: boolean;
  data?: CTFdTeam[];
  error?: string;
}

export interface CTFdTeamDetails {
  id: number;
  name: string;
  score: number;
  solves: number;
  place: number;
}

export interface CTFdChallenge {
  id: number;
  name: string;
  category: string;
  value: number;
  description: string;
  state: string;
  requirements: any;
  connection_info?: string;
  max_attempts: number;
  type: string;
}

export interface CTFdChallengesResponse {
  success: boolean;
  data?: CTFdChallenge[];
  error?: string;
}

// CTFd API Class
class CTFdAPI {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async makeRequest<T>(endpoint: string): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { 
          success: false, 
          error: `HTTP error! status: ${response.status}`
        };
      }

      const data = await response.json();
      
      // Check if the response contains an error message
      if (data.message && data.message.includes('permission')) {
        return { 
          success: false, 
          error: data.message 
        };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUsers(): Promise<CTFdUsersResponse> {
    return this.makeRequest<CTFdUser[]>('/users');
  }

  async getScoreboard(): Promise<CTFdScoreboardResponse> {
    return this.makeRequest<CTFdTeam[]>('/scoreboard');
  }

  async getAwards(): Promise<any> {
    return this.makeRequest<any[]>('/awards');
  }

  async getTeamStatistics(teamId: number): Promise<any> {
    return this.makeRequest<any>(`/teams/${teamId}`);
  }

  async getChallenges(): Promise<CTFdChallengesResponse> {
    return this.makeRequest<CTFdChallenge[]>('/challenges');
  }
}

// Create API instance
const ctfdAPI = new CTFdAPI(CTFD_BASE_URL, CTFD_TOKEN);

// Helper functions
export async function getAllTeams(): Promise<CTFdTeam[]> {
  try {
    // First try to get scoreboard data
    const scoreboardResponse = await ctfdAPI.getScoreboard();
    
    if (scoreboardResponse.success && scoreboardResponse.data) {
      // Convert scoreboard data to teams
      const allTeams: CTFdTeam[] = scoreboardResponse.data.map((team, index) => ({
        id: team.id,
        name: team.name,
        score: team.score,
        solves: team.solves,
        place: team.place,
        members: [] // We'll fetch members separately if needed
      }));

      return allTeams;
    }

    // Fallback to users data if scoreboard fails
    const usersResponse = await ctfdAPI.getUsers();
    
    if (!usersResponse.success || !usersResponse.data) {
      throw new Error('Failed to fetch users data from API');
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
      score: members.reduce((sum, member) => sum + member.score, 0), // Sum of member scores
      solves: members.reduce((sum, member) => sum + member.solves, 0), // Sum of member solves
      place: index + 1,
      members: members
    }));

    // Sort teams by score (highest first)
    allTeams.sort((a, b) => b.score - a.score);
    
    // Reassign places after sorting
    allTeams.forEach((team, index) => {
      team.place = index + 1;
      team.id = index + 1;
    });

    return allTeams;

  } catch (error) {
    console.error('Error fetching teams from API:', error);
    throw new Error('Unable to fetch team data from CTFd API. Please check your connection and API credentials.');
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
    const challengesResponse = await ctfdAPI.getChallenges();
    
    if (challengesResponse.success && challengesResponse.data) {
      return challengesResponse.data;
    }

    // If we get a permission error, return empty array instead of throwing
    if (challengesResponse.error && challengesResponse.error.includes('permission')) {
      console.warn('Challenges endpoint requires higher permissions. Returning empty array.');
      return [];
    }

    throw new Error('Failed to fetch challenges data from API');
  } catch (error) {
    console.error('Error fetching challenges from API:', error);
    // Return empty array instead of throwing error for permission issues
    console.warn('Unable to fetch challenges data. Returning empty array.');
    return [];
  }
}

export async function getAwardsData(): Promise<any[]> {
  try {
    const awardsResponse = await ctfdAPI.getAwards();
    
    if (awardsResponse.success && awardsResponse.data) {
      return awardsResponse.data;
    }

    // If we get a permission error, return empty array instead of throwing
    if (awardsResponse.error && awardsResponse.error.includes('permission')) {
      console.warn('Awards endpoint requires higher permissions. Returning empty array.');
      return [];
    }

    throw new Error('Failed to fetch awards data from API');
  } catch (error) {
    console.error('Error fetching awards from API:', error);
    // Return empty array instead of throwing error for permission issues
    console.warn('Unable to fetch awards data. Returning empty array.');
    return [];
  }
}
