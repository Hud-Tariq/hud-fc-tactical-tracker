import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SquadManagement from '@/components/SquadManagement';
import MatchCreation from '@/components/MatchCreation';
import MatchView from '@/components/MatchView';
import Statistics from '@/components/Statistics';
import { useSupabaseFootballData } from '@/hooks/useSupabaseFootballData';
import { Player } from '@/types/football';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, Trophy } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('squad');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { 
    players, 
    matches, 
    loading, 
    addPlayer, 
    createMatch, 
    getPlayerById 
  } = useSupabaseFootballData();

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setActiveTab('stats');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 p-8">
          <div className="relative">
            <img 
              src="https://pps.whatsapp.net/v/t61.24694-24/473409892_1299041094506728_9189987459084226587_n.jpg?ccb=11-4&oh=01_Q5Aa1wFGe45tsx-rSrXCp9k21OuheDPRRdErSPAx3hEKsONRLw&oe=68725DEA&_nc_sid=5e03e0&_nc_cat=107"
              alt="Hud FC Logo"
              className="w-16 h-16 rounded-full object-cover animate-pulse"
            />
            <Loader2 className="absolute -bottom-2 -right-2 h-6 w-6 animate-spin text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Loading Hud FC...
            </h2>
            <p className="text-muted-foreground mt-2">Setting up your football management system</p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'squad':
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="hero-gradient rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Squad Management</h1>
                  <p className="text-white/90 text-sm sm:text-base">Manage your team roster and player information</p>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{players.length} Players</span>
                </div>
              </div>
            </div>
            
            <SquadManagement
              players={players}
              onAddPlayer={addPlayer}
              onPlayerClick={handlePlayerClick}
            />
          </div>
        );
      case 'matches':
        return players.length >= 10 ? (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="hero-gradient rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Create Match</h1>
                  <p className="text-white/90 text-sm sm:text-base">Set up teams and track match performance</p>
                </div>
                <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">{matches.length} Matches</span>
                </div>
              </div>
            </div>
            
            <MatchCreation
              players={players}
              onCreateMatch={createMatch}
            />
          </div>
        ) : (
          <Card className="border-2 border-dashed border-border">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-muted-foreground">Not Enough Players</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  You need at least 10 players to create a match
                </p>
                <div className="inline-flex items-center space-x-2 bg-accent/50 rounded-full px-4 py-2">
                  <span className="text-sm font-medium">Current squad:</span>
                  <span className="text-sm font-bold text-primary">{players.length}/10 players</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('squad')}
                className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Add Players</span>
              </button>
            </CardContent>
          </Card>
        );
      case 'view-matches':
        return (
          <MatchView
            matches={matches}
            players={players}
            onBack={() => setActiveTab('matches')}
          />
        );
      case 'stats':
        return <Statistics players={players} />;
      case 'history':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold">Match History</h2>
              <div className="text-sm text-muted-foreground">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} played
              </div>
            </div>
            {matches.length > 0 ? (
              <div className="grid gap-4">
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div className="space-y-2">
                          <p className="font-medium text-sm text-muted-foreground">{match.date}</p>
                          <p className="text-lg font-semibold">Team A vs Team B</p>
                          {match.averageTeamARating && match.averageTeamBRating && (
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Team A Rating: {match.averageTeamARating.toFixed(1)}</span>
                              <span>Team B Rating: {match.averageTeamBRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-primary">
                            {match.scoreA} - {match.scoreB}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            match.completed 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {match.completed ? "Completed" : "Pending"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2 border-dashed border-border">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">No matches played yet</h3>
                    <p className="text-muted-foreground">Create your first match to start building your team's history</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('matches')}
                    className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Create Match</span>
                  </button>
                </CardContent>
              </Card>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
