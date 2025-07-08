import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SquadManagement from '@/components/SquadManagement';
import MatchCreation from '@/components/MatchCreation';
import MatchView from '@/components/MatchView';
import Statistics from '@/components/Statistics';
import MatchSimulation from '@/components/MatchSimulation';
import { useSupabaseFootballData } from '@/hooks/useSupabaseFootballData';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState('squad');
  const { 
    players, 
    matches, 
    loading, 
    addPlayer, 
    createMatch, 
    completeMatch,
    deleteMatch,
    getPlayerById 
  } = useSupabaseFootballData();

  const handlePlayerClick = (player: any) => {
    // Handle player click - could show player details or stats
    console.log('Player clicked:', player);
  };

  const handleMatchComplete = (matchId: string, teamAScore: number, teamBScore: number, playerRatings: Record<string, number>) => {
    // Convert the new signature to the existing completeMatch function
    // For now, we'll create empty goals and saves arrays since the simulation doesn't provide them
    completeMatch(matchId, teamAScore, teamBScore, [], {});
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-orange-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'squad':
        return <SquadManagement players={players} onAddPlayer={addPlayer} onPlayerClick={handlePlayerClick} />;
      case 'create-match':
        return (
          <MatchCreation 
            players={players} 
            onCreateMatch={createMatch}
          />
        );
      case 'view-matches':
        return (
          <MatchView 
            matches={matches} 
            players={players} 
            onBack={() => setCurrentView('create-match')}
            onDeleteMatch={deleteMatch}
          />
        );
      case 'statistics':
        return <Statistics players={players} />;
      case 'simulation':
        return (
          <MatchSimulation
            matches={matches}
            players={players}
            onMatchComplete={handleMatchComplete}
            onBack={() => setCurrentView('create-match')}
          />
        );
      default:
        return <SquadManagement players={players} onAddPlayer={addPlayer} onPlayerClick={handlePlayerClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navigation activeTab={currentView} onTabChange={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
