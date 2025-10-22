"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, Trophy, Zap, Lock, Terminal, Activity, RefreshCw, AlertCircle } from "lucide-react"
import { useCTFdHybrid } from "@/hooks/use-ctfd-hybrid"
import { Button } from "@/components/ui/button"

const recentActivity = [
  { user: "CyberNinja", action: "solved", challenge: "SQL Injection Master", points: 250, time: "2m ago" },
  { user: "ByteMaster", action: "solved", challenge: "XSS Vulnerability", points: 200, time: "5m ago" },
  { user: "CodeBreaker", action: "solved", challenge: "Buffer Overflow", points: 300, time: "8m ago" },
  { user: "HexHunter", action: "solved", challenge: "Crypto Challenge", points: 180, time: "12m ago" },
]

export function LeaderboardDashboard() {
  const { top3Teams, teamsRanked4to13, challenges, awards, loading, error } = useCTFdHybrid();

  return (
    <div className="min-h-screen bg-background grid-pattern relative overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line absolute inset-0 pointer-events-none" />

      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
              <div>
                <h1 className="text-3xl font-bold font-mono tracking-tight glow-text text-primary">
                  DIGITAL RISK MANAGEMENT
                </h1>
                <p className="text-sm text-muted-foreground font-mono">CTF COMPETITION 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-primary text-primary font-mono">
                <Activity className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
              <Badge variant="outline" className="border-accent text-accent font-mono">
                <Terminal className="h-3 w-3 mr-1" />
                ACTIVE: {teamsRanked4to13.length > 0 ? teamsRanked4to13.length + 3 : '...'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                disabled={loading}
                className="font-mono"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Top Section with Live Feed and Competition Stats */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Left Top - Live Feed */}
            <div className="bg-transparent backdrop-blur-sm">
              <h3 className="text-lg font-bold font-mono text-primary mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
                LIVE FEED
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-3 rounded bg-secondary/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-foreground">{activity.user}</span>
                      <span className="text-xs text-muted-foreground font-mono">{activity.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{activity.challenge}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-accent text-accent text-xs font-mono">
                        +{activity.points} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Top - Competition Stats */}
            <div className="bg-transparent backdrop-blur-sm">
              <h3 className="text-lg font-bold font-mono text-primary mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                COMPETITION STATS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded bg-secondary/30">
                  <span className="text-sm font-mono text-muted-foreground">Teams 4-13</span>
                  <span className="font-bold font-mono text-foreground">{teamsRanked4to13.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-secondary/30">
                  <span className="text-sm font-mono text-muted-foreground">Total Challenges</span>
                  <span className="font-bold font-mono text-primary">{challenges.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-secondary/30">
                  <span className="text-sm font-mono text-muted-foreground">Total Awards</span>
                  <span className="font-bold font-mono text-accent">{awards.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-secondary/30">
                  <span className="text-sm font-mono text-muted-foreground">Total Solves</span>
                  <span className="font-bold font-mono text-accent">
                    {teamsRanked4to13.reduce((sum, team) => sum + team.solves, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded bg-secondary/30">
                  <span className="text-sm font-mono text-muted-foreground">Avg Score</span>
                  <span className="font-bold font-mono text-destructive">
                    {teamsRanked4to13.length > 0 ? Math.round(teamsRanked4to13.reduce((sum, team) => sum + team.score, 0) / teamsRanked4to13.length) : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Podium */}
          <Card className="p-8 bg-card/80 backdrop-blur-sm relative overflow-visible">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-mono text-primary flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  TOP 3 HACKERS
                </h2>
              </div>

              {/* Top 3 Podium Container */}
              <div className="relative h-[400px] flex items-end justify-center gap-8">
                {/* Rank 2 - Left Position */}
                <div className="relative flex flex-col items-center">
                  {/* Hexagonal Avatar Frame */}
                  <div className="relative mb-6 z-20">
                    <div className="absolute inset-0 blur-2xl bg-blue-500/40" />
                    <div
                      className="relative"
                      style={{
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      }}
                    >
                      <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 p-1">
                        <div
                          style={{
                            clipPath:
                              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                          }}
                        >
                          <img
                            src={`/hacker-avatar-${(1 % 10) + 1}.jpg`}
                            alt={top3Teams[1]?.name || "Team 2"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/50">
                      2
                    </div>
                  </div>

                  {/* Platform */}
                  <div className="relative w-48 h-32 bg-gradient-to-br from-blue-600/80 to-blue-800/80 rounded-lg shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                    <div className="relative h-full flex flex-col items-center justify-center p-4">
                      <p className="font-mono font-bold text-white text-lg mb-1">{top3Teams[1]?.name || "Team 2"}</p>
                      <p className="text-xs text-blue-200 font-mono mb-2">Number #2</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-300 font-mono">Solves</span>
                          <span className="text-white font-bold font-mono">{top3Teams[1]?.solves || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-blue-300 font-mono">Score</span>
                          <span className="text-white font-bold font-mono">{top3Teams[1]?.score || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rank 1 - Center Position (Highest) */}
                <div className="relative flex flex-col items-center -mt-16">
                  {/* Hexagonal Avatar Frame */}
                  <div className="relative mb-6 z-20">
                    <div className="absolute inset-0 blur-3xl bg-red-500/50" />
                    <div
                      className="relative"
                      style={{
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      }}
                    >
                      <div className="w-36 h-36 bg-gradient-to-br from-red-500 to-orange-600 p-1">
                        <div
                          style={{
                            clipPath:
                              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                          }}
                        >
                          <img
                            src={`/hacker-avatar-${(0 % 10) + 1}.jpg`}
                            alt={top3Teams[0]?.name || "Team 1"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl shadow-lg shadow-red-500/50">
                      1
                    </div>
                  </div>

                  {/* Platform */}
                  <div className="relative w-56 h-40 bg-gradient-to-br from-red-600/80 to-orange-700/80 rounded-lg shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                    <div className="relative h-full flex flex-col items-center justify-center p-4">
                      <p className="font-mono font-bold text-white text-xl mb-1">{top3Teams[0]?.name || "Team 1"}</p>
                      <p className="text-sm text-red-200 font-mono mb-3">Number #1</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-red-300 font-mono">Solves</span>
                          <span className="text-white font-bold font-mono">{top3Teams[0]?.solves || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-red-300 font-mono">Score</span>
                          <span className="text-white font-bold font-mono">{top3Teams[0]?.score || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rank 3 - Right Position */}
                <div className="relative flex flex-col items-center">
                  {/* Hexagonal Avatar Frame */}
                  <div className="relative mb-6 z-20">
                    <div className="absolute inset-0 blur-2xl bg-green-500/40" />
                    <div
                      className="relative"
                      style={{
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      }}
                    >
                      <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 p-1">
                        <div
                          style={{
                            clipPath:
                              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                          }}
                        >
                          <img
                            src={`/hacker-avatar-${(2 % 10) + 1}.jpg`}
                            alt={top3Teams[2]?.name || "Team 3"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold text-lg shadow-lg shadow-green-500/50">
                      3
                    </div>
                  </div>

                  {/* Platform */}
                  <div className="relative w-48 h-32 bg-gradient-to-br from-green-600/80 to-green-800/80 rounded-lg shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                    <div className="relative h-full flex flex-col items-center justify-center p-4">
                      <p className="font-mono font-bold text-white text-lg mb-1">{top3Teams[2]?.name || "Team 3"}</p>
                      <p className="text-xs text-green-200 font-mono mb-2">Number #3</p>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-green-300 font-mono">Solves</span>
                          <span className="text-white font-bold font-mono">{top3Teams[2]?.solves || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-green-300 font-mono">Score</span>
                          <span className="text-white font-bold font-mono">{top3Teams[2]?.score || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Ranks 4-13 */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <h3 className="text-xl font-bold font-mono text-primary mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              RANKINGS 4-13
            </h3>
            
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive font-mono">Error: {error}</span>
              </div>
            )}

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="w-12 h-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 bg-muted rounded w-16" />
                      <div className="h-3 bg-muted rounded w-12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {teamsRanked4to13.map((team, index) => (
                  <div
                    key={team.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-all"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-bold font-mono">
                      {team.place || index + 4}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/hacker-avatar-${(index % 10) + 1}.jpg`} />
                      <AvatarFallback className="bg-muted text-muted-foreground font-mono">
                        {team.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-mono font-bold text-foreground">{team.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-primary text-lg">{team.score}</p>
                      <p className="text-xs text-muted-foreground font-mono">{team.solves} solve{team.solves !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
                
                {teamsRanked4to13.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground font-mono">No teams found in rankings 4-13</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}