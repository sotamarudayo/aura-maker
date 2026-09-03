export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          self_vote_completed: boolean;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          self_vote_completed?: boolean;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          self_vote_completed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      votes: {
        Row: {
          id: string;
          target_user_id: string;
          word: string;
          created_at: string;
          is_self_vote: boolean;
          voter_fingerprint: string | null;
          relationship_type: string | null;
          voter_display_name: string | null;
        };
        Insert: {
          id?: string;
          target_user_id: string;
          word: string;
          created_at?: string;
          is_self_vote?: boolean;
          voter_fingerprint?: string | null;
          relationship_type?: string | null;
          voter_display_name?: string | null;
        };
        Update: {
          id?: string;
          target_user_id?: string;
          word?: string;
          created_at?: string;
          is_self_vote?: boolean;
          voter_fingerprint?: string | null;
          relationship_type?: string | null;
          voter_display_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "votes_target_user_id_fkey";
            columns: ["target_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      vote_sessions: {
        Row: {
          id: string;
          target_user_id: string;
          voter_fingerprint: string;
          created_at: string;
          relationship_type: string | null;
          voter_display_name: string | null;
        };
        Insert: {
          id?: string;
          target_user_id: string;
          voter_fingerprint: string;
          created_at?: string;
          relationship_type?: string | null;
          voter_display_name?: string | null;
        };
        Update: {
          id?: string;
          target_user_id?: string;
          voter_fingerprint?: string;
          created_at?: string;
          relationship_type?: string | null;
          voter_display_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "vote_sessions_target_user_id_fkey";
            columns: ["target_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      aura_fusions: {
        Row: {
          id: string;
          inviter_id: string;
          invitee_id: string | null;
          invite_token: string;
          status: string;
          created_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          inviter_id: string;
          invitee_id?: string | null;
          invite_token: string;
          status?: string;
          created_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          id?: string;
          inviter_id?: string;
          invitee_id?: string | null;
          invite_token?: string;
          status?: string;
          created_at?: string;
          accepted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "aura_fusions_inviter_id_fkey";
            columns: ["inviter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "aura_fusions_invitee_id_fkey";
            columns: ["invitee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Profile = Tables<"profiles">;
export type Vote = Tables<"votes">;
export type VoteSession = Tables<"vote_sessions">;
