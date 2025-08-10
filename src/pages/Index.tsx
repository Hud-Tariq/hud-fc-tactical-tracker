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
      <div className="min-h-screen main-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-3 border-pink-400 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-t-3 border-purple-400 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-on-dark font-poppins">HUD FC Manager</h1>
            <p className="text-on-dark-muted text-lg">Loading your tactical dashboard...</p>
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
      case 'tournaments':
        return <TournamentPage />;
      case 'statistics':
        return <Statistics players={players} />;
      default:
        return <SquadManagement players={players} onAddPlayer={addPlayer} onPlayerClick={handlePlayerClick} />;
    }
  };

  return (
    <div className="min-h-screen main-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      {/* Navigation */}
      <Navigation activeTab={currentView} onTabChange={setCurrentView} />
      
      {/* Main Content */}
      <main className="content-container">
        <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-in">
              {renderCurrentView()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
