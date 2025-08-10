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
  Target,
  Clock,
  DollarSign,
  Loader2,
  Star,
  Zap,
  Crown
} from 'lucide-react';
import { Tournament, TournamentStatus, TournamentFormat, CreateTournamentRequest, Team } from '@/types/tournament';

const TournamentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | 'all'>('all');
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [joiningTournament, setJoiningTournament] = useState<string | null>(null);

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
        return <Trophy className="w-4 h-4" />;
      case 'group_stage':
        return <Users className="w-4 h-4" />;
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

  return (
    <div className="floating-section">
      {/* Hero Header */}
      <div className="section-header">
        <div className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-yellow-400/30 mb-4">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          <span className="text-on-dark-muted font-medium">Tournaments</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-on-dark font-poppins mb-4 lg:mb-6">
          Epic Football
          <span className="gradient-text-light ml-3">Tournaments</span>
        </h1>
        <p className="text-lg lg:text-2xl text-on-dark-muted max-w-3xl mx-auto mb-8 lg:mb-12">
          Compete in legendary tournaments and prove your team's worth
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
          <TeamCreation
            onCreateTeam={handleCreateTeam}
            trigger={
              <Button
                size="lg"
                className="px-6 lg:px-10 py-3 lg:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-500/25 text-sm lg:text-lg"
              >
                <Users className="w-4 h-4 lg:w-6 lg:h-6 mr-2" />
                Create Team
              </Button>
            }
          />
          <TournamentCreation onCreateTournament={handleCreateTournament} />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="floating-card mb-8">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-dark-subtle w-5 h-5" />
              <Input
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/10 border border-white/20 rounded-xl text-on-dark placeholder:text-on-dark-subtle focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((filter) => {
                const Icon = filter.icon;
                const isActive = statusFilter === filter.id;
                
                return (
                  <Button
                    key={filter.id}
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(filter.id as any)}
                    className={`
                      px-4 py-2 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg' 
                        : 'bg-white/10 border border-white/20 text-on-dark-muted hover:text-on-dark hover:bg-white/20'
                      }
                    `}
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

      {/* Tournament Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 p-1 glass-card border border-white/20 rounded-2xl">
          <TabsTrigger 
            value="browse" 
            className="rounded-xl font-medium text-on-dark-muted data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Browse Tournaments
          </TabsTrigger>
          <TabsTrigger 
            value="my-tournaments"
            className="rounded-xl font-medium text-on-dark-muted data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            My Tournaments
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard"
            className="rounded-xl font-medium text-on-dark-muted data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            Leaderboard
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
                {filteredTournaments.map((tournament, index) => (
                  <div key={tournament.id} className={`floating-card animate-fade-in animate-stagger-${(index % 5) + 1}`}>
                    <div className="p-6">
                      {/* Tournament Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                            {getFormatIcon(tournament.format)}
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
                        <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status)} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                          {tournament.status}
                        </Badge>
                      </div>

                      {/* Tournament Stats Grid */}
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
                      
                      {/* Tournament Dates */}
                      <div className="flex items-center space-x-2 text-sm text-on-dark-muted mb-6 p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>
                          {new Date(tournament.start_date!).toLocaleDateString()} - {' '}
                          {new Date(tournament.end_date!).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Action Section */}
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
                    {/* Same structure as browse tournaments but with management options */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                          {getFormatIcon(tournament.format)}
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
                      <Badge className={`bg-gradient-to-r ${getStatusColor(tournament.status)} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                        {tournament.status}
                      </Badge>
                    </div>

                    {/* Tournament Stats */}
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
};

export default TournamentPage;
