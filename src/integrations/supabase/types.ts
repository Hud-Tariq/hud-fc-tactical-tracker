export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      match_goals: {
        Row: {
          assister_id: string | null
          created_at: string | null
          id: string
          is_own_goal: boolean | null
          match_id: string
          minute: number | null
          scorer_id: string
          team: string
        }
        Insert: {
          assister_id?: string | null
          created_at?: string | null
          id?: string
          is_own_goal?: boolean | null
          match_id: string
          minute?: number | null
          scorer_id: string
          team: string
        }
        Update: {
          assister_id?: string | null
          created_at?: string | null
          id?: string
          is_own_goal?: boolean | null
          match_id?: string
          minute?: number | null
          scorer_id?: string
          team?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_goals_assister_id_fkey"
            columns: ["assister_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_goals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_goals_scorer_id_fkey"
            columns: ["scorer_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      match_saves: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          player_id: string
          saves_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          player_id: string
          saves_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          player_id?: string
          saves_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "match_saves_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_saves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          completed: boolean
          created_at: string | null
          date: string
          id: string
          score_a: number
          score_b: number
          team_a_players: string[]
          team_b_players: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          date: string
          id?: string
          score_a?: number
          score_b?: number
          team_a_players: string[]
          team_b_players: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          date?: string
          id?: string
          score_a?: number
          score_b?: number
          team_a_players?: string[]
          team_b_players?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          age: number
          clean_sheets: number
          created_at: string | null
          id: string
          matches_played: number
          name: string
          position: Database["public"]["Enums"]["player_position"]
          rating: number
          total_assists: number
          total_goals: number
          total_saves: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age: number
          clean_sheets?: number
          created_at?: string | null
          id?: string
          matches_played?: number
          name: string
          position: Database["public"]["Enums"]["player_position"]
          rating?: number
          total_assists?: number
          total_goals?: number
          total_saves?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age?: number
          clean_sheets?: number
          created_at?: string | null
          id?: string
          matches_played?: number
          name?: string
          position?: Database["public"]["Enums"]["player_position"]
          rating?: number
          total_assists?: number
          total_goals?: number
          total_saves?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          away_color: string | null
          created_at: string | null
          home_color: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          owner_id: string
          short_name: string | null
        }
        Insert: {
          away_color?: string | null
          created_at?: string | null
          home_color?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          owner_id: string
          short_name?: string | null
        }
        Update: {
          away_color?: string | null
          created_at?: string | null
          home_color?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          short_name?: string | null
        }
        Relationships: []
      }
      tournament_brackets: {
        Row: {
          bracket_position: number
          created_at: string | null
          id: string
          match_id: string | null
          parent_bracket_id: string | null
          stage_id: string
          team_a_id: string | null
          team_b_id: string | null
          tournament_id: string
          winner_advances_to: string | null
          winner_team_id: string | null
        }
        Insert: {
          bracket_position: number
          created_at?: string | null
          id?: string
          match_id?: string | null
          parent_bracket_id?: string | null
          stage_id: string
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id: string
          winner_advances_to?: string | null
          winner_team_id?: string | null
        }
        Update: {
          bracket_position?: number
          created_at?: string | null
          id?: string
          match_id?: string | null
          parent_bracket_id?: string | null
          stage_id?: string
          team_a_id?: string | null
          team_b_id?: string | null
          tournament_id?: string
          winner_advances_to?: string | null
          winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_brackets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_brackets_parent_bracket_id_fkey"
            columns: ["parent_bracket_id"]
            isOneToOne: false
            referencedRelation: "tournament_brackets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_brackets_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "tournament_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_brackets_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_brackets_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_brackets_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_brackets_winner_advances_to_fkey"
            columns: ["winner_advances_to"]
            isOneToOne: false
            referencedRelation: "tournament_brackets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_brackets_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_match_goals: {
        Row: {
          assister_id: string | null
          created_at: string | null
          extra_time_minute: number | null
          goal_type: string | null
          id: string
          is_free_kick: boolean | null
          is_own_goal: boolean | null
          is_penalty: boolean | null
          match_id: string
          minute: number | null
          scorer_id: string
          team_side: string | null
        }
        Insert: {
          assister_id?: string | null
          created_at?: string | null
          extra_time_minute?: number | null
          goal_type?: string | null
          id?: string
          is_free_kick?: boolean | null
          is_own_goal?: boolean | null
          is_penalty?: boolean | null
          match_id: string
          minute?: number | null
          scorer_id: string
          team_side?: string | null
        }
        Update: {
          assister_id?: string | null
          created_at?: string | null
          extra_time_minute?: number | null
          goal_type?: string | null
          id?: string
          is_free_kick?: boolean | null
          is_own_goal?: boolean | null
          is_penalty?: boolean | null
          match_id?: string
          minute?: number | null
          scorer_id?: string
          team_side?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_match_goals_assister_id_fkey"
            columns: ["assister_id"]
            isOneToOne: false
            referencedRelation: "tournament_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_match_goals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_match_goals_scorer_id_fkey"
            columns: ["scorer_id"]
            isOneToOne: false
            referencedRelation: "tournament_players"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_match_players: {
        Row: {
          id: string
          match_id: string
          minutes_played: number | null
          player_id: string
          position_played: string | null
          red_cards: number | null
          team_side: string | null
          yellow_cards: number | null
        }
        Insert: {
          id?: string
          match_id: string
          minutes_played?: number | null
          player_id: string
          position_played?: string | null
          red_cards?: number | null
          team_side?: string | null
          yellow_cards?: number | null
        }
        Update: {
          id?: string
          match_id?: string
          minutes_played?: number | null
          player_id?: string
          position_played?: string | null
          red_cards?: number | null
          team_side?: string | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_match_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_players"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_match_saves: {
        Row: {
          created_at: string | null
          id: string
          match_id: string
          player_id: string
          saves_count: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id: string
          player_id: string
          saves_count?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: string
          player_id?: string
          saves_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "tournament_match_saves_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "tournament_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_match_saves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "tournament_players"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_matches: {
        Row: {
          attendance: number | null
          completed: boolean | null
          created_at: string | null
          extra_time_score_a: number | null
          extra_time_score_b: number | null
          finished_at: string | null
          id: string
          kickoff_at: string | null
          match_status: string | null
          referee: string | null
          scheduled_at: string | null
          score_a: number | null
          score_a_penalties: number | null
          score_b: number | null
          score_b_penalties: number | null
          stage_id: string | null
          team_a_id: string
          team_b_id: string
          tournament_id: string
          updated_at: string | null
          venue: string | null
          weather_conditions: string | null
        }
        Insert: {
          attendance?: number | null
          completed?: boolean | null
          created_at?: string | null
          extra_time_score_a?: number | null
          extra_time_score_b?: number | null
          finished_at?: string | null
          id?: string
          kickoff_at?: string | null
          match_status?: string | null
          referee?: string | null
          scheduled_at?: string | null
          score_a?: number | null
          score_a_penalties?: number | null
          score_b?: number | null
          score_b_penalties?: number | null
          stage_id?: string | null
          team_a_id: string
          team_b_id: string
          tournament_id: string
          updated_at?: string | null
          venue?: string | null
          weather_conditions?: string | null
        }
        Update: {
          attendance?: number | null
          completed?: boolean | null
          created_at?: string | null
          extra_time_score_a?: number | null
          extra_time_score_b?: number | null
          finished_at?: string | null
          id?: string
          kickoff_at?: string | null
          match_status?: string | null
          referee?: string | null
          scheduled_at?: string | null
          score_a?: number | null
          score_a_penalties?: number | null
          score_b?: number | null
          score_b_penalties?: number | null
          stage_id?: string | null
          team_a_id?: string
          team_b_id?: string
          tournament_id?: string
          updated_at?: string | null
          venue?: string | null
          weather_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_matches_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "tournament_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_players: {
        Row: {
          id: string
          is_eligible: boolean | null
          jersey_number: number | null
          joined_at: string | null
          role: string | null
          tournament_team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_eligible?: boolean | null
          jersey_number?: number | null
          joined_at?: string | null
          role?: string | null
          tournament_team_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_eligible?: boolean | null
          jersey_number?: number | null
          joined_at?: string | null
          role?: string | null
          tournament_team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_players_tournament_team_id_fkey"
            columns: ["tournament_team_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_settings: {
        Row: {
          created_at: string | null
          data_type: string | null
          id: string
          setting_key: string
          setting_value: string
          tournament_id: string
        }
        Insert: {
          created_at?: string | null
          data_type?: string | null
          id?: string
          setting_key: string
          setting_value: string
          tournament_id: string
        }
        Update: {
          created_at?: string | null
          data_type?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_settings_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_stages: {
        Row: {
          created_at: string | null
          id: string
          name: string
          stage_order: number
          stage_type: string | null
          teams_advance: number | null
          tournament_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          stage_order: number
          stage_type?: string | null
          teams_advance?: number | null
          tournament_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          stage_order?: number
          stage_type?: string | null
          teams_advance?: number | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_stages_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_teams: {
        Row: {
          goals_against: number | null
          goals_for: number | null
          group_name: string | null
          id: string
          joined_at: string | null
          matches_drawn: number | null
          matches_lost: number | null
          matches_played: number | null
          matches_won: number | null
          points: number | null
          registration_status: string | null
          seed_number: number | null
          team_id: string
          tournament_id: string
        }
        Insert: {
          goals_against?: number | null
          goals_for?: number | null
          group_name?: string | null
          id?: string
          joined_at?: string | null
          matches_drawn?: number | null
          matches_lost?: number | null
          matches_played?: number | null
          matches_won?: number | null
          points?: number | null
          registration_status?: string | null
          seed_number?: number | null
          team_id: string
          tournament_id: string
        }
        Update: {
          goals_against?: number | null
          goals_for?: number | null
          group_name?: string | null
          id?: string
          joined_at?: string | null
          matches_drawn?: number | null
          matches_lost?: number | null
          matches_played?: number | null
          matches_won?: number | null
          points?: number | null
          registration_status?: string | null
          seed_number?: number | null
          team_id?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          entry_fee: number | null
          extra_time_enabled: boolean | null
          format: string
          id: string
          is_active: boolean
          match_duration: number | null
          max_teams: number | null
          min_teams: number | null
          name: string
          penalty_shootouts_enabled: boolean | null
          prize_pool: number | null
          rules_text: string | null
          start_date: string | null
          status: string | null
          updated_at: string
          visibility: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          extra_time_enabled?: boolean | null
          format?: string
          id?: string
          is_active?: boolean
          match_duration?: number | null
          max_teams?: number | null
          min_teams?: number | null
          name: string
          penalty_shootouts_enabled?: boolean | null
          prize_pool?: number | null
          rules_text?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          visibility?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          extra_time_enabled?: boolean | null
          format?: string
          id?: string
          is_active?: boolean
          match_duration?: number | null
          max_teams?: number | null
          min_teams?: number | null
          name?: string
          penalty_shootouts_enabled?: boolean | null
          prize_pool?: number | null
          rules_text?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
          visibility?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      tournament_standings: {
        Row: {
          goal_difference: number | null
          goals_against: number | null
          goals_for: number | null
          matches_drawn: number | null
          matches_lost: number | null
          matches_played: number | null
          matches_won: number | null
          points: number | null
          team_id: string | null
          team_name: string | null
          tournament_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      player_position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      player_position: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
    },
  },
} as const
