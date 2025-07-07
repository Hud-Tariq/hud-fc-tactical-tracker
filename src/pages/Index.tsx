import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SquadManagement from '@/components/SquadManagement';
import MatchCreation from '@/components/MatchCreation';
import MatchView from '@/components/MatchView';
import Statistics from '@/components/Statistics';
import { useSupabaseFootballData } from '@/hooks/useSupabaseFootballData';
import { Player } from '@/types/football';
import { Card, CardContent } from '@/components/ui/card';
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
        return <Statistics players={players} />;
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
                          <div className="text-xs text-muted-foreground">
                            {match.completed ? "Completed" : "Pending"}
                          </div>
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
