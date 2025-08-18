import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PlayerCard from './PlayerCard';
import { Player, Match, Goal } from '@/types/football';
import { Calendar, Users, Plus, Minus, Save, Clock, ArrowLeft, ArrowRight, Check, X, Target, Award } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

interface MatchCreationProps {
  players: Player[];
  onCreateMatch: (match: Omit<Match, 'id'>) => void;
}

const MatchCreation = ({ players, onCreateMatch }: MatchCreationProps) => {
  const [matchDate, setMatchDate] = useState('');
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(players);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [saves, setSaves] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const handlePlayerSelect = (player: Player, team: 'A' | 'B') => {
    if (team === 'A' && teamA.length < 11) {
      setTeamA([...teamA, player]);
      setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
    } else if (team === 'B' && teamB.length < 11) {
      setTeamB([...teamB, player]);
      setAvailablePlayers(availablePlayers.filter(p => p.id !== player.id));
    }
  };

  const handlePlayerRemove = (player: Player, team: 'A' | 'B') => {
    if (team === 'A') {
      setTeamA(teamA.filter(p => p.id !== player.id));
    } else {
      setTeamB(teamB.filter(p => p.id !== player.id));
    }
    setAvailablePlayers([...availablePlayers, player]);
  };

  const addGoal = (team: 'A' | 'B') => {
    setGoals([...goals, { scorer: '', assister: undefined, team, isOwnGoal: false }]);
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const updateGoal = (index: number, field: keyof Goal, value: string | boolean) => {
    const updatedGoals = [...goals];
    if (field === 'assister' && value === 'no-assist') {
      updatedGoals[index] = { ...updatedGoals[index], [field]: undefined };
    } else {
      updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    }
    setGoals(updatedGoals);
  };

  const updateSaves = (playerId: string, saveCount: number) => {
    setSaves(prev => ({
      ...prev,
      [playerId]: saveCount
    }));
  };

  const getTeamPlayers = (team: 'A' | 'B') => {
    return team === 'A' ? teamA : teamB;
  };

  const getOpposingTeamPlayers = (team: 'A' | 'B') => {
    return team === 'A' ? teamB : teamA;
  };

  const calculateScore = (team: 'A' | 'B') => {
    return goals.filter(g => {
      if (g.isOwnGoal) {
        return g.team !== team;
      }
      return g.team === team && g.scorer;
    }).length;
  };

  const handleCreateMatch = () => {
    const minPlayers = 5;
    const maxPlayers = 11;
    const validTeamSizes = teamA.length >= minPlayers && teamA.length <= maxPlayers &&
                          teamB.length >= minPlayers && teamB.length <= maxPlayers;

    if (matchDate && validTeamSizes) {
      const validGoals = goals.filter(g => g.scorer);
      const scoreA = calculateScore('A');
      const scoreB = calculateScore('B');
      
      const match: Omit<Match, 'id'> = {
        date: matchDate,
        teamA: teamA.map(p => p.id),
        teamB: teamB.map(p => p.id),
        scoreA,
        scoreB,
        goals: validGoals,
        saves,
        completed: true
      };
      onCreateMatch(match);
      
      // Reset form
      setMatchDate('');
      setTeamA([]);
      setTeamB([]);
      setAvailablePlayers(players);
      setGoals([]);
      setSaves({});
      setCurrentStep(0);
    }
  };

  const teamAGoals = calculateScore('A');
  const teamBGoals = calculateScore('B');

  const steps = [
    { title: 'Match Details', icon: Calendar },
    { title: 'Select Teams', icon: Users },
    { title: 'Track Goals', icon: Target },
    { title: 'Final Stats', icon: Award }
  ];

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 0: return matchDate !== '';
      case 1: return teamA.length >= 5 && teamB.length >= 5 && teamA.length <= 11 && teamB.length <= 11;
      case 2: return true; // Goals are optional
      case 3: return true;
      default: return false;
    }
  };

  // Desktop Layout (unchanged from original)
  const DesktopLayout = () => (
    <div className="floating-section">
      {/* Desktop content - keeping original implementation */}
      <div className="section-header">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-purple-400/30 mb-4">
          <span className="text-purple-400 text-lg mr-2">⚽</span>
          <span className="text-on-dark-muted font-medium">Match Creation</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-4 lg:mb-6">
          Create
          <span className="gradient-text-light ml-3">Match</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-2xl text-on-dark-muted max-w-none sm:max-w-3xl mx-auto px-2 sm:px-0">
          Set up teams from 5v5 to 11v11, track goals, and create memorable football matches
        </p>
        <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-400/20 max-w-md mx-auto">
          <p className="text-sm text-blue-300">
            ⚽ <strong>Team Size:</strong> Each team needs 5-11 players (e.g., 5v5, 7v8, 11v11)
          </p>
        </div>
      </div>

      {/* Original desktop implementation continues here... */}
      <div className="floating-card mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-on-dark font-poppins">Match Details</h3>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-on-dark-muted">Match Date</Label>
              <Input
                id="date"
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            
            {(teamA.length >= 5 && teamB.length >= 5) && (
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <div className="text-center p-3 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30">
                  <h4 className="text-blue-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Team A Score</h4>
                  <div className="text-2xl sm:text-4xl font-bold text-on-dark">{teamAGoals}</div>
                </div>
                <div className="text-center p-3 sm:p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-400/30">
                  <h4 className="text-red-300 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Team B Score</h4>
                  <div className="text-2xl sm:text-4xl font-bold text-on-dark">{teamBGoals}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Rest of desktop implementation... */}
      <div className="flex justify-center">
        <Button
          onClick={handleCreateMatch}
          disabled={!matchDate || teamA.length < 5 || teamA.length > 11 || teamB.length < 5 || teamB.length > 11}
          size="lg"
          className="px-6 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25"
        >
          <Save className="w-6 h-6 mr-3" />
          Create Match
        </Button>
      </div>
    </div>
  );

  // Mobile Layout - Completely New Design
  const MobileLayout = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white font-poppins">Create Match</h1>
              <p className="text-white/60 text-sm">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-primary border-primary text-white'
                      : index < currentStep
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-white/30 text-white/60'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    React.createElement(step.icon, { className: "w-4 h-4" })
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="px-4 py-6 pb-24">
        {/* Step 0: Match Details */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-blue-400/30">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Match Details</h2>
              <p className="text-white/60">When did this match take place?</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <Label className="text-white mb-3 block">Match Date</Label>
              <Input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                className="h-14 bg-white/10 border border-white/20 rounded-xl text-white focus:border-primary focus:ring-primary text-lg"
              />
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-400/20">
              <h3 className="text-white font-semibold mb-2">Team Requirements</h3>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Each team needs 5-11 players</li>
                <li>• Popular formats: 5v5, 7v7, 11v11</li>
                <li>• Teams can have different sizes</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 1: Team Selection */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-green-400/30">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Select Teams</h2>
              <p className="text-white/60">Choose players for each team</p>
            </div>

            {/* Team Status */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-400/30">
                <h3 className="text-blue-300 font-semibold mb-2">Team A</h3>
                <p className={`text-2xl font-bold ${teamA.length >= 5 ? 'text-white' : 'text-red-400'}`}>
                  {teamA.length}
                </p>
                <p className="text-white/60 text-sm">players</p>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-4 border border-red-400/30">
                <h3 className="text-red-300 font-semibold mb-2">Team B</h3>
                <p className={`text-2xl font-bold ${teamB.length >= 5 ? 'text-white' : 'text-red-400'}`}>
                  {teamB.length}
                </p>
                <p className="text-white/60 text-sm">players</p>
              </div>
            </div>

            {/* Available Players */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Available Players ({availablePlayers.length})</h3>
              {availablePlayers.map((player) => (
                <div key={player.id} className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">{player.name}</h4>
                      <p className="text-white/60 text-sm">{player.position} • {player.rating} rating</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePlayerSelect(player, 'A')}
                      disabled={teamA.length >= 11}
                      className="flex-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                      variant="outline"
                    >
                      Add to Team A
                    </Button>
                    <Button
                      onClick={() => handlePlayerSelect(player, 'B')}
                      disabled={teamB.length >= 11}
                      className="flex-1 bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30"
                      variant="outline"
                    >
                      Add to Team B
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Teams */}
            {(teamA.length > 0 || teamB.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Selected Players</h3>
                
                {teamA.length > 0 && (
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/20">
                    <h4 className="text-blue-300 font-medium mb-3">Team A ({teamA.length})</h4>
                    <div className="space-y-2">
                      {teamA.map((player) => (
                        <div key={player.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                          <div>
                            <p className="text-white font-medium">{player.name}</p>
                            <p className="text-white/60 text-sm">{player.position}</p>
                          </div>
                          <Button
                            onClick={() => handlePlayerRemove(player, 'A')}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {teamB.length > 0 && (
                  <div className="bg-red-500/10 rounded-xl p-4 border border-red-400/20">
                    <h4 className="text-red-300 font-medium mb-3">Team B ({teamB.length})</h4>
                    <div className="space-y-2">
                      {teamB.map((player) => (
                        <div key={player.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                          <div>
                            <p className="text-white font-medium">{player.name}</p>
                            <p className="text-white/60 text-sm">{player.position}</p>
                          </div>
                          <Button
                            onClick={() => handlePlayerRemove(player, 'B')}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Goals */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-yellow-400/30">
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Track Goals</h2>
              <p className="text-white/60">Record goals and assists</p>
            </div>

            {/* Current Score */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 text-center border border-blue-400/30">
                <h3 className="text-blue-300 font-semibold mb-2">Team A</h3>
                <p className="text-4xl font-bold text-white">{teamAGoals}</p>
              </div>
              <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl p-6 text-center border border-red-400/30">
                <h3 className="text-red-300 font-semibold mb-2">Team B</h3>
                <p className="text-4xl font-bold text-white">{teamBGoals}</p>
              </div>
            </div>

            {/* Add Goal Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={() => addGoal('A')}
                className="h-12 bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Goal Team A
              </Button>
              <Button
                onClick={() => addGoal('B')}
                className="h-12 bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Goal Team B
              </Button>
            </div>

            {/* Goals List */}
            {goals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Goals ({goals.length})</h3>
                {goals.map((goal, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-medium ${goal.team === 'A' ? 'text-blue-300' : 'text-red-300'}`}>
                        Goal {index + 1} - Team {goal.team}
                      </h4>
                      <Button
                        onClick={() => removeGoal(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={goal.isOwnGoal || false}
                          onCheckedChange={(checked) => updateGoal(index, 'isOwnGoal', checked as boolean)}
                        />
                        <Label className="text-orange-300 text-sm">Own Goal</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white/80 text-sm">Scorer</Label>
                        <Select
                          value={goal.scorer}
                          onValueChange={(value) => updateGoal(index, 'scorer', value)}
                        >
                          <SelectTrigger className="bg-white/10 border border-white/20 text-white">
                            <SelectValue placeholder="Select scorer" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-white/20">
                            {(goal.isOwnGoal ? getOpposingTeamPlayers(goal.team) : getTeamPlayers(goal.team)).map((player) => (
                              <SelectItem key={player.id} value={player.id} className="text-white">
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Final Review */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border border-green-400/30">
                <Award className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Match Summary</h2>
              <p className="text-white/60">Review and create your match</p>
            </div>

            {/* Match Result */}
            <div className="bg-gradient-to-r from-blue-500/10 to-red-500/10 rounded-2xl p-6 border border-white/20 text-center">
              <h3 className="text-white font-semibold mb-4">Final Score</h3>
              <div className="grid grid-cols-3 items-center gap-4">
                <div>
                  <p className="text-blue-300 font-medium">Team A</p>
                  <p className="text-3xl font-bold text-white">{teamAGoals}</p>
                </div>
                <div className="text-white/60 text-2xl font-bold">VS</div>
                <div>
                  <p className="text-red-300 font-medium">Team B</p>
                  <p className="text-3xl font-bold text-white">{teamBGoals}</p>
                </div>
              </div>
            </div>

            {/* Match Details Summary */}
            <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold mb-4">Match Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Date:</span>
                  <span className="text-white">{matchDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Team A Players:</span>
                  <span className="text-white">{teamA.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Team B Players:</span>
                  <span className="text-white">{teamB.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Goals:</span>
                  <span className="text-white">{goals.length}</span>
                </div>
              </div>
            </div>

            {/* Create Match Button */}
            <Button
              onClick={handleCreateMatch}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl"
            >
              <Save className="w-5 h-5 mr-2" />
              Create Match
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-4 z-50 safe-area-pb">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-white/60 text-sm font-medium">
            {currentStep + 1} of {steps.length}
          </div>

          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1 || !canProceedToNextStep()}
            className="bg-primary hover:bg-primary/90 h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Show different layouts based on screen size */}
      <div className="hidden md:block">
        <DesktopLayout />
      </div>
      <div className="block md:hidden">
        <MobileLayout />
      </div>
    </>
  );
};

export default MatchCreation;
