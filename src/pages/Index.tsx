import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import SquadManagement from '@/components/SquadManagement';
import MatchCreation from '@/components/MatchCreation';
import MatchView from '@/components/MatchView';
import Statistics from '@/components/Statistics';
import TournamentPage from '@/components/TournamentPage';
import { useSupabaseFootballData } from '@/hooks/useSupabaseFootballData';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import { Goal } from '@/types/football';

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
    console.log('Player clicked:', player);
  };

  // Enhanced match completion handler
  const handleMatchComplete = async (
    matchId: string, 
    teamAScore: number, 
    teamBScore: number, 
    goals: Goal[], 
    saves: Record<string, number>
  ) => {
    console.log('Completing match with full data:', {
      matchId,
      teamAScore,
      teamBScore,
      goals,
      saves
    });
    
    await completeMatch(matchId, teamAScore, teamBScore, goals, saves);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-primary/5">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-t-2 border-accent mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-headline text-foreground">HUD FC Manager</p>
            <p className="text-muted-foreground">Loading your tactical dashboard...</p>
          </div>
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
      default:
        return <SquadManagement players={players} onAddPlayer={addPlayer} onPlayerClick={handlePlayerClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <Navigation activeTab={currentView} onTabChange={setCurrentView} />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
