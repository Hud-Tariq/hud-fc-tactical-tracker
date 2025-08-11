import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Tournament, 
  TournamentWithTeams, 
  CreateTournamentRequest,
  TournamentTeam,
  Team
} from '@/types/tournament';

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentWithTeams[]>([]);
  const [myTournaments, setMyTournaments] = useState<TournamentWithTeams[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTournaments = async () => {
    try {
      console.log('Fetching tournaments...');
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_teams (
            *,
            teams (*)
          ),
          tournament_stages (*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched tournaments:', data);
      setTournaments(data || []);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments",
        variant: "destructive",
      });
    }
  };

  const fetchMyTournaments = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching my tournaments for user:', user.id);
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_teams (
            *,
            teams (*)
          ),
          tournament_stages (*)
        `)
        .eq('created_by', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Fetched my tournaments:', data);
      setMyTournaments(data || []);
    } catch (error) {
      console.error('Error fetching my tournaments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your tournaments",
        variant: "destructive",
      });
    }
  };

  const createTournament = async (tournamentData: CreateTournamentRequest) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Creating tournament:', tournamentData);
      
      const { data, error } = await supabase
        .from('tournaments')
        .insert([{
          ...tournamentData,
          created_by: user.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Tournament created:', data);
      
      // Create initial stage for single elimination tournaments
      if (tournamentData.format === 'single_elimination') {
        await supabase
          .from('tournament_stages')
          .insert([{
            tournament_id: data.id,
            name: 'Round 1',
            stage_order: 1,
            stage_type: 'knockout'
          }]);
      }
      
      await Promise.all([fetchTournaments(), fetchMyTournaments()]);
      
      toast({
        title: "Success!",
        description: `Tournament "${tournamentData.name}" created successfully!`,
      });
      
      return data;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw error;
    }
  };

  const joinTournament = async (tournamentId: string, teamId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Joining tournament:', { tournamentId, teamId });
      
      const { data, error } = await supabase
        .from('tournament_teams')
        .insert([{
          tournament_id: tournamentId,
          team_id: teamId,
          registration_status: 'approved' // Auto-approve for now
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Joined tournament:', data);
      
      await fetchTournaments();
      
      toast({
        title: "Success!",
        description: "Successfully joined the tournament!",
      });
      
      return data;
    } catch (error) {
      console.error('Error joining tournament:', error);
      toast({
        title: "Error",
        description: "Failed to join tournament",
        variant: "destructive",
      });
      throw error;
    }
  };

  const createTeam = async (teamData: { name: string; short_name?: string; home_color?: string; away_color?: string }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Creating team:', teamData);
      
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          ...teamData,
          owner_id: user.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      console.log('Team created:', data);
      
      toast({
        title: "Success!",
        description: `Team "${teamData.name}" created successfully!`,
      });
      
      return data;
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchUserTeams = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', user.id)
        .eq('is_active', true);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user teams:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setLoading(true);
        await Promise.all([fetchTournaments(), fetchMyTournaments()]);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  return {
    tournaments,
    myTournaments,
    loading,
    createTournament,
    joinTournament,
    createTeam,
    fetchUserTeams,
    refreshTournaments: () => Promise.all([fetchTournaments(), fetchMyTournaments()])
  };
};
