import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import TournamentCreation from '@/components/TournamentCreation';
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
import { Tournament, TournamentStatus, TournamentFormat, CreateTournamentRequest } from '@/types/tournament';

const TournamentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | 'all'>('all');

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

  const filteredTournaments = mockTournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tournament.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            <Button
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Tournament
            </Button>
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
          {/* Tournament Grid */}
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
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full bg-[var(--gradient-primary)] hover:opacity-90" 
                      disabled={tournament.status !== 'open'}
                    >
                      {tournament.status === 'open' ? 'Join Tournament' : 
                       tournament.status === 'in_progress' ? 'View Matches' : 
                       'View Results'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tournaments found</h3>
              <p className="text-muted-foreground">Try adjusting your search or create a new tournament.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-tournaments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tournaments yet</h3>
                <p className="text-muted-foreground mb-4">Join your first tournament to get started!</p>
                <Button>Browse Tournaments</Button>
              </div>
            </CardContent>
          </Card>
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
