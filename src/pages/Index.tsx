import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SquadManagement from '@/components/SquadManagement';
import MatchCreation from '@/components/MatchCreation';
import MatchView from '@/components/MatchView';
import { useSupabaseFootballData } from '@/hooks/useSupabaseFootballData';
import { Player } from '@/types/football';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading Hud FC...</span>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'squad':
        return (
          <SquadManagement
            players={players}
            onAddPlayer={addPlayer}
            onPlayerClick={handlePlayerClick}
          />
        );
      case 'matches':
        return players.length >= 10 ? (
          <MatchCreation
            players={players}
            onCreateMatch={createMatch}
          />
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                You need at least 10 players to create a match
              </p>
              <p className="text-sm text-muted-foreground">
                Current squad: {players.length}/10 players
              </p>
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
        return selectedPlayer ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Player Statistics</h2>
              <button 
                onClick={() => setSelectedPlayer(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to Squad
              </button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedPlayer.name}
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-teal-600">
                        {selectedPlayer.rating}
                      </div>
                      <div className="text-xs text-muted-foreground">Overall</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {selectedPlayer.averageMatchRating?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Match</div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedPlayer.age}</div>
                    <div className="text-sm text-muted-foreground">Age</div>
                  </div>
                  <div className="text-center">
                    <Badge className="mb-2">{selectedPlayer.position}</Badge>
                    <div className="text-sm text-muted-foreground">Position</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedPlayer.matchesPlayed}</div>
                    <div className="text-sm text-muted-foreground">Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{selectedPlayer.matchesPlayed * 60}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedPlayer.totalGoals}</div>
                    <div className="text-sm text-muted-foreground">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedPlayer.totalAssists}</div>
                    <div className="text-sm text-muted-foreground">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedPlayer.totalSaves}</div>
                    <div className="text-sm text-muted-foreground">Saves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedPlayer.cleanSheets}</div>
                    <div className="text-sm text-muted-foreground">Clean Sheets</div>
                  </div>
                </div>

                {selectedPlayer.matchRatings && selectedPlayer.matchRatings.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Recent Match Ratings</h4>
                    <div className="flex space-x-2 overflow-x-auto">
                      {selectedPlayer.matchRatings.slice(-10).map((rating, index) => (
                        <Badge
                          key={index}
                          variant={rating >= 7 ? "default" : rating >= 6 ? "secondary" : "destructive"}
                          className="min-w-12 justify-center"
                        >
                          {rating.toFixed(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Select a player from the squad to view their statistics
              </p>
            </CardContent>
          </Card>
        );
      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Match History</h2>
            {matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{match.date}</p>
                          <p className="text-sm text-muted-foreground">
                            Team A vs Team B
                          </p>
                          {match.averageTeamARating && match.averageTeamBRating && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Avg Ratings: {match.averageTeamARating.toFixed(1)} - {match.averageTeamBRating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {match.scoreA} - {match.scoreB}
                          </div>
                          <Badge variant={match.completed ? "default" : "secondary"}>
                            {match.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No matches played yet
                  </p>
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
    <div className="min-h-screen bg-slate-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
