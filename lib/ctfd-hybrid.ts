// Hybrid CTFd API Integration - Real API with fallback to mock data
const CTFD_BASE_URL = 'http://ethics.golomtbank.com/api/v1';

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

// Fallback mock data
const mockUsers: CTFdUser[] = [
  { id: 1, name: "Teswer", affiliation: "ТЭСВЭР", score: 1250, solves: 8 },
  { id: 2, name: "Tasraltgvi", affiliation: "ТАСРАЛТГҮЙ", score: 1180, solves: 7 },
  { id: 3, name: "Khariutslaga", affiliation: "ХАРИУЦЛАГА", score: 1100, solves: 6 },
  { id: 4, name: "Seremj", affiliation: "СЭРЭМЖ", score: 950, solves: 5 },
  { id: 5, name: "Yoszvi", affiliation: "ЁС ЗҮЙ", score: 850, solves: 4 },
  { id: 6, name: "Shudarga", affiliation: "ШУДАРГА", score: 750, solves: 3 },
  { id: 7, name: "Cyber", affiliation: "КИБЕР", score: 650, solves: 2 },
  { id: 8, name: "Medremj", affiliation: "МЭДРЭМЖ", score: 550, solves: 1 },
  { id: 9, name: "Manlailal", affiliation: "МАНЛАЙЛАЛ", score: 450, solves: 1 },
  { id: 10, name: "Tulguur", affiliation: "ТУЛГУУР", score: 350, solves: 0 },
  { id: 11, name: "Soyol", affiliation: "СОЁЛ", score: 250, solves: 0 },
  { id: 12, name: "Digital", affiliation: "ДИЖИТАЛ", score: 150, solves: 0 },
  { id: 13, name: "Darkhlaa", affiliation: "ДАРХЛАА", score: 50, solves: 0 },
];

const mockChallenges: CTFdChallenge[] = [
  { id: 1, name: "SQL Injection Master", category: "Web", value: 200, description: "Find the flag in the database", state: "visible" },
  { id: 2, name: "XSS Vulnerability", category: "Web", value: 150, description: "Exploit the XSS vulnerability", state: "visible" },
  { id: 3, name: "Buffer Overflow", category: "Pwn", value: 300, description: "Exploit the buffer overflow", state: "visible" },
  { id: 4, name: "Crypto Challenge", category: "Crypto", value: 250, description: "Decrypt the message", state: "visible" },
  { id: 5, name: "Reverse Engineering", category: "Reverse", value: 400, description: "Reverse the binary", state: "visible" },
];

const mockAwards: CTFdAward[] = [
  { id: 1, name: "First Blood", description: "First team to solve a challenge", category: "achievement", value: 100, team_id: 1, user_id: 1 },
  { id: 2, name: "Speed Demon", description: "Fastest solve", category: "achievement", value: 50, team_id: 2, user_id: 2 },
  { id: 3, name: "Persistence", description: "Most attempts", category: "achievement", value: 25, team_id: 3, user_id: 3 },
];

// Core API function - Try real API first, fallback to mock data
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
    
    // If real API fails, return mock data
    if (!response.ok || data.success === false) {
      console.warn(`Real API failed for ${endpoint}, using mock data`);
      return getMockData<T>(endpoint);
    }
    
    return { success: true, data };
  } catch (error) {
    console.warn(`Error fetching ${endpoint}, using mock data:`, error);
    return getMockData<T>(endpoint);
  }
}

// Mock data fallback
function getMockData<T>(endpoint: string): ApiResponse<T> {
  switch (endpoint) {
    case '/users':
      return { success: true, data: mockUsers as T };
    case '/challenges':
      return { success: true, data: mockChallenges as T };
    case '/awards':
      return { success: true, data: mockAwards as T };
    case '/scoreboard':
      return { success: true, data: [] as T };
    default:
      return { success: false, error: 'Endpoint not found' };
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
  const response = await getChallenges();
  return response.data || [];
}

export async function getAwardsData(): Promise<CTFdAward[]> {
  const response = await getAwards();
  return response.data || [];
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
