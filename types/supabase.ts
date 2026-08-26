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
        };
        Insert: {
          id?: string;
          target_user_id: string;
          word: string;
          created_at?: string;
          is_self_vote?: boolean;
          voter_fingerprint?: string | null;
        };
        Update: {
          id?: string;
          target_user_id?: string;
          word?: string;
          created_at?: string;
          is_self_vote?: boolean;
          voter_fingerprint?: string | null;
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
        };
        Insert: {
          id?: string;
          target_user_id: string;
          voter_fingerprint: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          target_user_id?: string;
          voter_fingerprint?: string;
          created_at?: string;
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
