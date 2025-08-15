import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import SquadManagement from '@/components/SquadManagement';
import MatchCreation from '@/components/MatchCreation';
import MatchView from '@/components/MatchView';
import Statistics from '@/components/Statistics';
import TournamentPage from '@/components/TournamentPage';
import { SquadLoadingSkeleton, TournamentLoadingSkeleton, MatchLoadingSkeleton } from '@/components/LoadingSkeleton';
import { useSupabaseFootballData } from '@/hooks/useSupabaseFootballData';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import { Goal } from '@/types/football';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState('squad');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const {
    players,
    matches,
    loading,
    playersLoading,
    matchesLoading,
    addPlayer,
    createMatch,
    completeMatch,
    deleteMatch,
    getPlayerById
  } = useSupabaseFootballData();

  const handlePlayerClick = (player: any) => {
    console.log('Player clicked:', player);
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === currentView) return; // Don't animate if same tab

    setIsTransitioning(true);

    // Short delay to allow fade out
    setTimeout(() => {
      setCurrentView(newTab);
      setAnimationKey(prev => prev + 1); // Force re-animation
      setIsTransitioning(false);
    }, 150);
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
        if (loading && players.length === 0) {
          return <SquadLoadingSkeleton />;
        }
        return <SquadManagement players={players} onAddPlayer={addPlayer} onPlayerClick={handlePlayerClick} />;
      case 'create-match':
        if (loading && players.length === 0) {
          return <SquadLoadingSkeleton />;
        }
        return (
          <MatchCreation
            players={players}
            onCreateMatch={createMatch}
          />
        );
      case 'view-matches':
        if ((loading || matchesLoading) && matches.length === 0) {
          return <MatchLoadingSkeleton />;
        }
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
        if ((loading || matchesLoading) && (players.length === 0 || matches.length === 0)) {
          return <MatchLoadingSkeleton />;
        }
        return <Statistics players={players} matches={matches} onRemoveMatch={deleteMatch} />;
      default:
        if (loading && players.length === 0) {
          return <SquadLoadingSkeleton />;
        }
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
      <Navigation activeTab={currentView} onTabChange={handleTabChange} />
      
      {/* Main Content */}
      <main className="content-container">
        <div className="w-full px-2 sm:px-4 lg:px-8 xl:px-12 py-2 sm:py-4 lg:py-8">
          <div className="animate-fade-in">
            {renderCurrentView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
