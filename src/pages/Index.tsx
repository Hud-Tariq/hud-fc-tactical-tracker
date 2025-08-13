
import React, { useState, useEffect } from 'react';
import { useSupabaseFootballData } from '@/hooks/useSupabaseFootballData';
import { useTournaments } from '@/hooks/useTournaments';
import SquadManagement from '@/components/SquadManagement';
import MatchCreation from '@/components/MatchCreation';
import MatchView from '@/components/MatchView';
import MatchesPlayedView from '@/components/MatchesPlayedView';
import Statistics from '@/components/Statistics';
import TournamentPage from '@/components/TournamentPage';
import Navigation from '@/components/Navigation';
import { Goal } from '@/types/football';
import { useAuth } from '@/hooks/useAuth';

type ViewType = 'squad' | 'create-match' | 'view-matches' | 'matches-played' | 'statistics' | 'tournaments';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('squad');
  const { user, loading: isAuthLoading } = useAuth();
  const {
    players,
    matches,
    loading,
    addPlayer,
    createMatch,
    completeMatch,
    deleteMatch,
    getPlayerById,
    refreshData
  } = useSupabaseFootballData();
  const {
    tournaments,
    loading: tournamentsLoading,
    createTournament,
    refreshTournaments,
  } = useTournaments();

  useEffect(() => {
    refreshTournaments();
  }, [refreshTournaments]);

  const handleMatchComplete = async (
    matchId: string,
    teamAScore: number,
    teamBScore: number,
    goals: Goal[],
    saves: Record<string, number>
  ) => {
    if (matchId) {
      await completeMatch(matchId, teamAScore, teamBScore, goals, saves);
      setCurrentView('matches-played');
    }
  };

  const handlePlayerClick = (player: any) => {
    // Add player click handling logic here if needed
    console.log('Player clicked:', player);
  };

  if (isAuthLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Football App</h1>
            <p className="py-6">Please sign in to continue.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'squad':
        return (
          <SquadManagement
            players={players}
            onAddPlayer={addPlayer}
            onPlayerClick={handlePlayerClick}
          />
        );
      case 'create-match':
        return (
          <MatchCreation
            players={players}
            onCreateMatch={createMatch}
            onViewMatches={() => setCurrentView('view-matches')}
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
      case 'matches-played':
        return (
          <MatchesPlayedView
            matches={matches}
            players={players}
            onDeleteMatch={deleteMatch}
          />
        );
      case 'statistics':
        return (
          <Statistics
            players={players}
            matches={matches}
          />
        );
      case 'tournaments':
        return (
          <TournamentPage />
        );
      default:
        return (
          <SquadManagement
            players={players}
            onAddPlayer={addPlayer}
            onPlayerClick={handlePlayerClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navigation activeTab={currentView} onTabChange={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
