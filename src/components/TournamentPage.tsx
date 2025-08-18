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

        <TabsContent value="browse" className="space-y-8 mt-8 bg-transparent">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto" />
                  <div className="absolute inset-0 w-12 h-12 border-t-2 border-pink-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <p className="text-on-dark-muted text-lg">Loading tournaments...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
                {filteredTournaments.map((tournament, index) => (
                  <div key={tournament.id} className={`floating-card animate-fade-in animate-stagger-${(index % 5) + 1}`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                            {getFormatIcon(tournament.format as TournamentFormat)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-on-dark font-poppins line-clamp-1">
                              {tournament.name}
                            </h3>
                            <p className="text-sm text-on-dark-muted line-clamp-2">
                              {tournament.description}
                            </p>
                          </div>
                        </div>
                        <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status as TournamentStatus)} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                          {tournament.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="w-4 h-4 text-blue-400 mr-1" />
                            <span className="text-sm font-medium text-on-dark">{tournament.max_teams}</span>
                          </div>
                          <p className="text-xs text-on-dark-subtle">Max Teams</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="w-4 h-4 text-green-400 mr-1" />
                            <span className="text-sm font-medium text-on-dark">{tournament.match_duration}min</span>
                          </div>
                          <p className="text-xs text-on-dark-subtle">Duration</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <DollarSign className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium text-on-dark">${tournament.entry_fee}</span>
                          </div>
                          <p className="text-xs text-on-dark-subtle">Entry Fee</p>
                        </div>
                        <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Trophy className="w-4 h-4 text-purple-400 mr-1" />
                            <span className="text-sm font-medium text-on-dark">${tournament.prize_pool}</span>
                          </div>
                          <p className="text-xs text-on-dark-subtle">Prize Pool</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-on-dark-muted mb-6 p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>
                          {new Date(tournament.start_date!).toLocaleDateString()} - {' '}
                          {new Date(tournament.end_date!).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {tournament.status === 'open' && (
                          <>
                            {userTeams.length > 0 ? (
                              <>
                                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                                  <SelectTrigger className="w-full h-10 bg-white/10 border border-white/20 rounded-xl text-on-dark focus:border-purple-400">
                                    <SelectValue placeholder="Select your team" />
                                  </SelectTrigger>
                                  <SelectContent className="glass-card-strong border-white/20 rounded-xl">
                                    {userTeams.map((team) => (
                                      <SelectItem key={team.id} value={team.id} className="text-on-dark hover:bg-white/10">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: team.home_color || '#6366f1' }}
                                          />
                                          {team.name}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  className="w-full h-10 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300"
                                  disabled={!selectedTeam || joiningTournament === tournament.id}
                                  onClick={() => handleJoinTournament(tournament.id)}
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
                              </>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-xs text-on-dark-muted text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-400/30 text-yellow-300">
                                  You need a team to join
                                </p>
                                <TeamCreation
                                  onCreateTeam={handleCreateTeam}
                                  trigger={
                                    <Button className="w-full h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300">
                                      <Plus className="w-4 h-4 mr-2" />
                                      Create Team First
                                    </Button>
                                  }
                                />
                              </div>
                            )}
                          </>
                        )}
                        {tournament.status !== 'open' && (
                          <Button
                            className="w-full h-10 bg-gradient-to-r from-purple-500/50 to-pink-600/50 text-white font-medium rounded-xl cursor-not-allowed"
                            disabled
                          >
                            {tournament.status === 'in_progress' ? 'View Matches' : 'View Results'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTournaments.length === 0 && !loading && (
                <div className="floating-card text-center py-20">
                  <div className="space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/20">
                      <Trophy className="w-16 h-16 text-on-dark-subtle" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-on-dark font-poppins">No Tournaments Found</h3>
                      <p className="text-on-dark-muted text-lg max-w-md mx-auto">
                        Try adjusting your search or create a new tournament to get started.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my-tournaments" className="space-y-8 mt-8 bg-transparent">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto" />
                <p className="text-on-dark-muted text-lg">Loading your tournaments...</p>
              </div>
            </div>
          ) : filteredMyTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
              {filteredMyTournaments.map((tournament, index) => (
                <div key={tournament.id} className={`floating-card animate-fade-in animate-stagger-${(index % 5) + 1}`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                          {getFormatIcon(tournament.format as TournamentFormat)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-on-dark font-poppins">
                            {tournament.name}
                          </h3>
                          <p className="text-sm text-on-dark-muted">
                            {tournament.description}
                          </p>
                        </div>
                      </div>
                      <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status as TournamentStatus)} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                        {tournament.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-blue-400 mr-1" />
                          <span className="text-sm font-medium text-on-dark">
                            {tournament.tournament_teams?.length || 0}/{tournament.max_teams}
                          </span>
                        </div>
                        <p className="text-xs text-on-dark-subtle">Teams</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="w-4 h-4 text-green-400 mr-1" />
                          <span className="text-sm font-medium text-on-dark">{tournament.match_duration}min</span>
                        </div>
                        <p className="text-xs text-on-dark-subtle">Duration</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <DollarSign className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-on-dark">${tournament.entry_fee}</span>
                        </div>
                        <p className="text-xs text-on-dark-subtle">Entry Fee</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Trophy className="w-4 h-4 text-purple-400 mr-1" />
                          <span className="text-sm font-medium text-on-dark">${tournament.prize_pool}</span>
                        </div>
                        <p className="text-xs text-on-dark-subtle">Prize Pool</p>
                      </div>
                    </div>

                    <Button className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-300">
                      <Trophy className="w-4 h-4 mr-2" />
                      Manage Tournament
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="floating-card text-center py-20">
              <div className="space-y-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/20">
                  <Trophy className="w-16 h-16 text-on-dark-subtle" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-on-dark font-poppins">No Tournaments Yet</h3>
                  <p className="text-on-dark-muted text-lg max-w-md mx-auto">
                    Create your first tournament to get started and build your football empire!
                  </p>
                </div>
                <TournamentCreation
                  onCreateTournament={handleCreateTournament}
                  trigger={
                    <Button
                      size="lg"
                      className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Tournament
                    </Button>
                  }
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-8 mt-8 bg-transparent">
          <div className="floating-card text-center py-20">
            <div className="space-y-6">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center border border-yellow-400/30">
                <Medal className="w-16 h-16 text-yellow-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-on-dark font-poppins">Global Leaderboard</h3>
                <p className="text-on-dark-muted text-lg max-w-md mx-auto">
                  Compete in tournaments to earn your ranking and climb the leaderboard!
                </p>
              </div>
              <div className="text-on-dark-subtle text-sm">
                Coming Soon - Track your victories and compare with other managers
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Mobile Layout - Enhanced and Responsive
  const MobileLayout = () => (
    <div className="floating-section">
      {/* Enhanced mobile header */}
      <div className="mb-8">
        {/* Quick stats overview */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="floating-card p-4 text-center hover-lift">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-on-dark">{tournaments.filter(t => t.status === 'open').length}</div>
            <div className="text-xs text-on-dark-muted">Open</div>
          </div>
          <div className="floating-card p-4 text-center hover-lift">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-on-dark">{tournaments.filter(t => t.status === 'in_progress').length}</div>
            <div className="text-xs text-on-dark-muted">Live</div>
          </div>
          <div className="floating-card p-4 text-center hover-lift">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-lg font-bold text-on-dark">{myTournaments.length}</div>
            <div className="text-xs text-on-dark-muted">Mine</div>
          </div>
        </div>

        {/* Enhanced search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-dark-subtle w-5 h-5 z-10" />
          <Input
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-white/10 border-2 border-white/20 rounded-2xl text-on-dark placeholder:text-on-dark-subtle focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 text-base"
          />
        </div>

        {/* Enhanced filter buttons */}
        <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
          {filterButtons.map((filter) => {
            const Icon = filter.icon;
            const isActive = statusFilter === filter.id;

            return (
              <Button
                key={filter.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(filter.id as TournamentStatus | 'all')}
                className={`flex-shrink-0 h-12 px-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30'
                    : 'bg-white/10 border-2 border-white/20 text-on-dark-muted hover:text-on-dark hover:bg-white/20 hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="font-medium">{filter.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Enhanced tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 h-14 p-1 bg-white/10 border-2 border-white/20 rounded-2xl">
          <TabsTrigger value="browse" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
            Browse
          </TabsTrigger>
          <TabsTrigger value="my-tournaments" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
            My Tournaments
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-sm font-semibold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white transition-all duration-300">
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
                <p className="text-on-dark-muted">Loading tournaments...</p>
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
            <div className="floating-card text-center py-16">
              <Trophy className="w-16 h-16 text-on-dark-subtle mx-auto mb-4" />
              <h3 className="text-xl font-bold text-on-dark mb-2">No Tournaments Found</h3>
              <p className="text-on-dark-muted">Try adjusting your search or create a new tournament</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-tournaments" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
                <p className="text-on-dark-muted">Loading your tournaments...</p>
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
            <div className="floating-card text-center py-16">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-on-dark mb-2">No Tournaments Yet</h3>
              <p className="text-on-dark-muted mb-4">Create your first tournament to get started</p>
              <TournamentCreation
                onCreateTournament={handleCreateTournament}
                trigger={
                  <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Tournament
                  </Button>
                }
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="floating-card text-center py-16">
            <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-on-dark mb-2">Global Leaderboard</h3>
            <p className="text-on-dark-muted">Coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Enhanced Mobile Tournament Card Component
  const MobileTournamentCard = ({ tournament, index, onJoin, joiningTournament, userTeams, selectedTeam, setSelectedTeam, handleCreateTeam }: any) => (
    <div className="floating-card animate-fade-in hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="p-5">
        {/* Enhanced header with better spacing */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
              {getFormatIcon(tournament.format as TournamentFormat)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-on-dark font-poppins mb-1 line-clamp-1">{tournament.name}</h3>
              <p className="text-sm text-on-dark-muted line-clamp-2 leading-relaxed">{tournament.description}</p>
            </div>
          </div>
          <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status as TournamentStatus)} text-white text-xs px-3 py-1.5 rounded-full ml-3 shadow-lg flex-shrink-0`}>
            {tournament.status}
          </Badge>
        </div>

        {/* Enhanced stats grid with better visual hierarchy */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 text-center hover:scale-105 transition-transform duration-200">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div className="text-base font-bold text-on-dark">${tournament.entry_fee}</div>
            <p className="text-xs text-yellow-300 font-medium">Entry Fee</p>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 text-center hover:scale-105 transition-transform duration-200">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-2 flex items-center justify-center shadow-md">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <div className="text-base font-bold text-on-dark">${tournament.prize_pool}</div>
            <p className="text-xs text-purple-300 font-medium">Prize Pool</p>
          </div>
        </div>

        {/* Enhanced info row with better icons */}
        <div className="flex items-center justify-between text-sm text-on-dark-muted mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
              {getFormatIcon(tournament.format as TournamentFormat)}
            </div>
            <span className="font-medium">{tournament.format.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
              <Users className="w-3 h-3" />
            </div>
            <span className="font-medium">{tournament.max_teams} teams</span>
          </div>
        </div>

        {/* Enhanced action section */}
        {tournament.status === 'open' ? (
          userTeams.length > 0 ? (
            <div className="space-y-4">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full h-12 bg-white/10 border-2 border-white/20 rounded-xl text-on-dark font-medium focus:border-purple-400 transition-all duration-200">
                  <SelectValue placeholder="Select your team" />
                </SelectTrigger>
                <SelectContent className="glass-card-strong border-white/20 rounded-xl">
                  {userTeams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id} className="text-on-dark hover:bg-white/10 rounded-lg mx-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: team.home_color || '#6366f1' }}
                        />
                        <span className="font-medium">{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
                disabled={!selectedTeam || joiningTournament === tournament.id}
                onClick={onJoin}
              >
                {joiningTournament === tournament.id ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    <span>Join Tournament</span>
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30">
                <p className="text-sm text-yellow-300 font-medium">You need a team to join this tournament</p>
              </div>
              <TeamCreation
                onCreateTeam={handleCreateTeam}
                trigger={
                  <Button className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
                    <Plus className="w-5 h-5 mr-2" />
                    <span>Create Team First</span>
                  </Button>
                }
              />
            </div>
          )
        ) : (
          <Button
            className="w-full h-12 bg-white/10 text-on-dark-muted font-semibold rounded-xl cursor-not-allowed border border-white/10"
            disabled
          >
            <div className="flex items-center justify-center space-x-2">
              {tournament.status === 'in_progress' ? (
                <>
                  <Eye className="w-5 h-5" />
                  <span>View Matches</span>
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  <span>View Results</span>
                </>
              )}
            </div>
          </Button>
        )}
      </div>
    </div>
  );

  // Simple Mobile My Tournament Card Component
  const MobileMyTournamentCard = ({ tournament, index }: any) => (
    <div className="floating-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-on-dark font-poppins mb-1">{tournament.name}</h3>
            <div className="flex items-center space-x-2">
              <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status as TournamentStatus)} text-white text-xs px-2 py-1 rounded-full`}>
                {tournament.status}
              </Badge>
              <span className="text-on-dark-muted text-sm">
                {tournament.tournament_teams?.length || 0}/{tournament.max_teams} teams
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium text-on-dark">${tournament.entry_fee}</span>
            </div>
            <p className="text-xs text-on-dark-subtle">Entry Fee</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-purple-400 mr-1" />
              <span className="text-sm font-medium text-on-dark">${tournament.prize_pool}</span>
            </div>
            <p className="text-xs text-on-dark-subtle">Prize Pool</p>
          </div>
        </div>

        <Button className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-xl">
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
