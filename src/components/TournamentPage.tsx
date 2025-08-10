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
  Loader2
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
        return 'bg-gray-500';
      case 'open':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-purple-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--gradient-hero)] p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">FUTBALMANIA</h1>
              <h2 className="text-2xl font-semibold mb-4">TOURNAMENTS</h2>
              <p className="text-lg opacity-90">Compete in epic football tournaments</p>
            </div>
            <TournamentCreation onCreateTournament={handleCreateTournament} />
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rotate-45 rounded-xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 -rotate-12 rounded-lg"></div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'open' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('open')}
            size="sm"
          >
            Open
          </Button>
          <Button
            variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('in_progress')}
            size="sm"
          >
            Live
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('completed')}
            size="sm"
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Tournament Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Tournaments</TabsTrigger>
          <TabsTrigger value="my-tournaments">My Tournaments</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading tournaments...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getFormatIcon(tournament.format)}
                      <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                      {tournament.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{tournament.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{tournament.max_teams} teams max</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{tournament.match_duration}min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>${tournament.entry_fee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-muted-foreground" />
                      <span>${tournament.prize_pool}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(tournament.start_date!).toLocaleDateString()} - {' '}
                      {new Date(tournament.end_date!).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    {tournament.status === 'open' && (
                      <>
                        {userTeams.length > 0 ? (
                          <>
                            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                              <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="Select your team" />
                              </SelectTrigger>
                              <SelectContent>
                                {userTeams.map((team) => (
                                  <SelectItem key={team.id} value={team.id}>
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
                              className="w-full bg-[var(--gradient-primary)] hover:opacity-90"
                              disabled={!selectedTeam || joiningTournament === tournament.id}
                              onClick={() => handleJoinTournament(tournament.id)}
                            >
                              {joiningTournament === tournament.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Joining...
                                </>
                              ) : (
                                'Join Tournament'
                              )}
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground text-center">You need a team to join</p>
                            <TeamCreation
                              onCreateTeam={handleCreateTeam}
                              trigger={
                                <Button className="w-full" variant="outline">
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
                        className="w-full bg-[var(--gradient-primary)] hover:opacity-90"
                        disabled
                      >
                        {tournament.status === 'in_progress' ? 'View Matches' : 'View Results'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
                ))}
              </div>

              {filteredTournaments.length === 0 && !loading && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tournaments found</h3>
              <p className="text-muted-foreground">Try adjusting your search or create a new tournament.</p>
              </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="my-tournaments" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading your tournaments...</span>
            </div>
          ) : filteredMyTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMyTournaments.map((tournament) => (
                <Card key={tournament.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(tournament.format)}
                        <CardTitle className="text-lg">{tournament.name}</CardTitle>
                      </div>
                      <Badge className={`${getStatusColor(tournament.status)} text-white`}>
                        {tournament.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tournament.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{tournament.tournament_teams?.length || 0}/{tournament.max_teams} teams</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{tournament.match_duration}min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>${tournament.entry_fee}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-muted-foreground" />
                        <span>${tournament.prize_pool}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button className="w-full bg-[var(--gradient-primary)] hover:opacity-90">
                        Manage Tournament
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tournaments yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first tournament to get started!</p>
                  <TournamentCreation onCreateTournament={handleCreateTournament} />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Medal className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Leaderboard coming soon</h3>
                <p className="text-muted-foreground">Compete in tournaments to earn your ranking!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TournamentPage;
