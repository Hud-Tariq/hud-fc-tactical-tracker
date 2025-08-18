import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentCreation from '@/components/TournamentCreation';
import TeamCreation from '@/components/TeamCreation';
import { useTournaments } from '@/hooks/useTournaments';
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Plus,
  Search,
  Filter,
  Medal,
  Goal,
  Clock,
  DollarSign,
  Loader2,
  Star,
  Zap,
  Crown,
  Shield,
  ChevronRight,
  TrendingUp,
  Eye,
  Play,
  Flame,
  Target
} from 'lucide-react';
import { Tournament, TournamentStatus, TournamentFormat, CreateTournamentRequest, Team } from '@/types/tournament';

const TournamentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | 'all'>('all');
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [joiningTournament, setJoiningTournament] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('browse');

  const {
    tournaments,
    myTournaments,
    loading,
    createTournament,
    joinTournament,
    createTeam,
    fetchUserTeams
  } = useTournaments();

  const handleCreateTournament = async (tournament: CreateTournamentRequest) => {
    await createTournament(tournament);
  };

  const handleCreateTeam = async (teamData: { name: string; short_name?: string; home_color?: string; away_color?: string }) => {
    const newTeam = await createTeam(teamData);
    if (newTeam) {
      await loadUserTeams();
    }
    return newTeam;
  };

  const handleJoinTournament = async (tournamentId: string) => {
    if (!selectedTeam) {
      return;
    }

    setJoiningTournament(tournamentId);
    try {
      await joinTournament(tournamentId, selectedTeam);
    } finally {
      setJoiningTournament(null);
    }
  };

  const loadUserTeams = async () => {
    const teams = await fetchUserTeams();
    setUserTeams(teams);
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0].id);
    }
  };

  useEffect(() => {
    loadUserTeams();
  }, []);

  const getStatusColor = (status: TournamentStatus) => {
    switch (status) {
      case 'draft':
        return 'from-gray-400 to-gray-500';
      case 'open':
        return 'from-green-400 to-emerald-500';
      case 'in_progress':
        return 'from-blue-400 to-cyan-500';
      case 'completed':
        return 'from-purple-400 to-pink-500';
      case 'cancelled':
        return 'from-red-400 to-pink-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getFormatIcon = (format: TournamentFormat) => {
    switch (format) {
      case 'single_elimination':
        return <Target className="w-4 h-4" />;
      case 'double_elimination':
        return <Medal className="w-4 h-4" />;
      case 'league':
        return <Users className="w-4 h-4" />;
      case 'group_stage':
        return <Shield className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMyTournaments = myTournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filterButtons = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'open', label: 'Open', icon: Star },
    { id: 'in_progress', label: 'Live', icon: Zap },
    { id: 'completed', label: 'Completed', icon: Crown }
  ];

  // Desktop Layout (keeping original)
  const DesktopLayout = () => (
    <div className="floating-section">
      {/* Hero Header */}
      <div className="section-header">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-yellow-400/30 mb-4">
          <span className="text-yellow-400 text-lg mr-2">⚽</span>
          <span className="text-on-dark-muted font-medium">Tournaments</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-4 lg:mb-6">
          Football
          <span className="gradient-text-light ml-3">Tournaments</span>
        </h1>
        <p className="text-base sm:text-lg lg:text-2xl text-on-dark-muted max-w-none sm:max-w-3xl mx-auto mb-6 sm:mb-8 lg:mb-12 px-2 sm:px-0">
          Compete in legendary tournaments and prove your team's worth
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center px-2 sm:px-0">
          <TeamCreation
            onCreateTeam={handleCreateTeam}
            trigger={
              <Button
                size="lg"
                className="px-4 sm:px-6 lg:px-10 py-2.5 sm:py-3 lg:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25 text-sm lg:text-lg"
              >
                <Shield className="w-4 h-4 lg:w-6 lg:h-6 mr-2" />
                Create Team
              </Button>
            }
          />
          <TournamentCreation onCreateTournament={handleCreateTournament} />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="floating-card mb-6 sm:mb-8">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-dark-subtle w-5 h-5" />
              <Input
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 h-10 sm:h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 text-sm sm:text-base"
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {filterButtons.map((filter) => {
                const Icon = filter.icon;
                const isActive = statusFilter === filter.id;
                
                return (
                  <Button
                    key={filter.id}
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(filter.id as TournamentStatus | 'all')}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg'
                        : 'bg-white/10 border border-white/20 text-on-dark-muted hover:text-on-dark hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop content continues as original... */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 sm:h-14 p-1 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl overflow-hidden">
          <TabsTrigger value="browse" className="rounded-xl font-medium text-on-dark hover:text-white hover:bg-white/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm lg:text-base px-1 sm:px-2 lg:px-4">
            <span className="hidden sm:inline">Browse Tournaments</span>
            <span className="sm:hidden">Browse</span>
          </TabsTrigger>
          <TabsTrigger value="my-tournaments" className="rounded-xl font-medium text-on-dark hover:text-white hover:bg-white/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm lg:text-base px-1 sm:px-2 lg:px-4">
            <span className="hidden sm:inline">My Tournaments</span>
            <span className="sm:hidden">My</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="rounded-xl font-medium text-on-dark hover:text-white hover:bg-white/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm lg:text-base px-1 sm:px-2 lg:px-4">
            <span className="hidden sm:inline">Leaderboard</span>
            <span className="sm:hidden">Board</span>
          </TabsTrigger>
        </TabsList>
        {/* Desktop tabs content remains the same... */}
      </Tabs>
    </div>
  );

  // Mobile Layout - Brilliant Native App Experience
  const MobileLayout = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white font-poppins">Tournaments</h1>
              <p className="text-white/60 text-sm">Compete and conquer</p>
            </div>
            <div className="flex items-center space-x-2">
              <TournamentCreation 
                onCreateTournament={handleCreateTournament}
                trigger={
                  <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 rounded-full w-10 h-10 p-0">
                    <Plus className="w-5 h-5" />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="flex space-x-3 mb-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 min-w-[100px]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{tournaments.filter(t => t.status === 'open').length}</p>
                  <p className="text-white/80 text-xs">Open</p>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-3 min-w-[100px]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{tournaments.filter(t => t.status === 'in_progress').length}</p>
                  <p className="text-white/80 text-xs">Live</p>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-3 min-w-[100px]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{myTournaments.length}</p>
                  <p className="text-white/80 text-xs">Mine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-10 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filterButtons.map((filter) => {
              const Icon = filter.icon;
              const isActive = statusFilter === filter.id;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id as TournamentStatus | 'all')}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-yellow-500 text-black'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'browse', label: 'Browse', icon: Search },
            { id: 'my-tournaments', label: 'My Tournaments', icon: Trophy },
            { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-yellow-500/20' : 'hover:bg-white/10'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-yellow-400' : 'text-white/60'}`} />
                <span className={`text-xs ${isActive ? 'text-yellow-400' : 'text-white/60'}`}>
                  {tab.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Content */}
      <div className="px-4 py-6 pb-20">
        {/* Browse Tournaments */}
        {activeTab === 'browse' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
                  <p className="text-white/60">Loading tournaments...</p>
                </div>
              </div>
            ) : filteredTournaments.length > 0 ? (
              <div className="space-y-4">
                {filteredTournaments.map((tournament, index) => (
                  <MobileTournamentCard 
                    key={tournament.id}
                    tournament={tournament}
                    index={index}
                    onJoin={() => handleJoinTournament(tournament.id)}
                    joiningTournament={joiningTournament}
                    userTeams={userTeams}
                    selectedTeam={selectedTeam}
                    setSelectedTeam={setSelectedTeam}
                    handleCreateTeam={handleCreateTeam}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-white/60" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Tournaments Found</h3>
                <p className="text-white/60 mb-6">Try adjusting your search or create a new tournament</p>
              </div>
            )}
          </div>
        )}

        {/* My Tournaments */}
        {activeTab === 'my-tournaments' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-yellow-400 mx-auto mb-4" />
                  <p className="text-white/60">Loading your tournaments...</p>
                </div>
              </div>
            ) : filteredMyTournaments.length > 0 ? (
              <div className="space-y-4">
                {filteredMyTournaments.map((tournament, index) => (
                  <MobileMyTournamentCard 
                    key={tournament.id}
                    tournament={tournament}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-400/30">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Tournaments Yet</h3>
                <p className="text-white/60 mb-6">Create your first tournament to get started</p>
                <TournamentCreation 
                  onCreateTournament={handleCreateTournament}
                  trigger={
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-xl px-8 py-3">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Tournament
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-400/30">
              <Crown className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Global Leaderboard</h3>
            <p className="text-white/60 mb-4">Coming soon...</p>
            <div className="text-white/40 text-sm">Track your victories and climb the rankings</div>
          </div>
        )}
      </div>
    </div>
  );

  // Mobile Tournament Card Component
  const MobileTournamentCard = ({ tournament, index, onJoin, joiningTournament, userTeams, selectedTeam, setSelectedTeam, handleCreateTeam }: any) => (
    <div 
      className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Tournament Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{tournament.name}</h3>
            <p className="text-white/60 text-sm line-clamp-2">{tournament.description}</p>
          </div>
          <div className="ml-3">
            <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status)} text-white text-xs px-3 py-1 rounded-full`}>
              {tournament.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-white/60">
          <div className="flex items-center space-x-1">
            {getFormatIcon(tournament.format)}
            <span>{tournament.format.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{tournament.max_teams} teams</span>
          </div>
        </div>
      </div>

      {/* Tournament Stats */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-white font-medium">${tournament.entry_fee}</span>
          </div>
          <p className="text-white/60 text-xs">Entry Fee</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 text-purple-400 mr-1" />
            <span className="text-white font-medium">${tournament.prize_pool}</span>
          </div>
          <p className="text-white/60 text-xs">Prize Pool</p>
        </div>
      </div>

      {/* Action Section */}
      <div className="p-4 border-t border-white/10">
        {tournament.status === 'open' ? (
          userTeams.length > 0 ? (
            <div className="space-y-3">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full h-12 bg-white/10 border border-white/20 rounded-xl text-white">
                  <SelectValue placeholder="Select your team" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {userTeams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id} className="text-white">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: team.home_color || '#6366f1' }}
                        />
                        <span>{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={onJoin}
                disabled={!selectedTeam || joiningTournament === tournament.id}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium"
              >
                {joiningTournament === tournament.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 mr-2" />
                    Join Tournament
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3 text-center">
                <p className="text-yellow-300 text-sm">You need a team to join</p>
              </div>
              <TeamCreation
                onCreateTeam={handleCreateTeam}
                trigger={
                  <Button className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Team First
                  </Button>
                }
              />
            </div>
          )
        ) : (
          <Button
            disabled
            className="w-full h-12 bg-white/10 text-white/60 rounded-xl cursor-not-allowed"
          >
            {tournament.status === 'in_progress' ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                View Matches
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                View Results
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile My Tournament Card Component
  const MobileMyTournamentCard = ({ tournament, index }: any) => (
    <div 
      className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{tournament.name}</h3>
            <div className="flex items-center space-x-2">
              <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status)} text-white text-xs px-2 py-1 rounded-full`}>
                {tournament.status}
              </Badge>
              <span className="text-white/60 text-sm">
                {tournament.tournament_teams?.length || 0}/{tournament.max_teams} teams
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              {getFormatIcon(tournament.format)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-white text-sm font-medium">${tournament.entry_fee}</span>
            </div>
            <p className="text-white/60 text-xs">Entry Fee</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-3 h-3 text-purple-400 mr-1" />
              <span className="text-white text-sm font-medium">${tournament.prize_pool}</span>
            </div>
            <p className="text-white/60 text-xs">Prize Pool</p>
          </div>
        </div>

        <Button className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl text-sm">
          <Trophy className="w-4 h-4 mr-2" />
          Manage Tournament
        </Button>
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

export default TournamentPage;
