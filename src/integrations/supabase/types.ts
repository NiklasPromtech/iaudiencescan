export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      audiences: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
          wallets: string[] | null
          website_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
          wallets?: string[] | null
          website_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
          wallets?: string[] | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audiences_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      covalent_request_queue: {
        Row: {
          created_at: string
          error: string | null
          id: string
          priority: number
          processed_at: string | null
          request_type: Database["public"]["Enums"]["CovalentRequestType"]
          retry_count: number
          scan_id: string | null
          status: Database["public"]["Enums"]["CovalentQueueStatus"]
          wallet_address: string
          website_id: string | null
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          priority?: number
          processed_at?: string | null
          request_type: Database["public"]["Enums"]["CovalentRequestType"]
          retry_count?: number
          scan_id?: string | null
          status?: Database["public"]["Enums"]["CovalentQueueStatus"]
          wallet_address: string
          website_id?: string | null
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          priority?: number
          processed_at?: string | null
          request_type?: Database["public"]["Enums"]["CovalentRequestType"]
          retry_count?: number
          scan_id?: string | null
          status?: Database["public"]["Enums"]["CovalentQueueStatus"]
          wallet_address?: string
          website_id?: string | null
        }
        Relationships: []
      }
      email_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      entitlements: {
        Row: {
          created_at: string
          credits: number
          id: string
          period_start: string
          plan: Database["public"]["Enums"]["Plan"]
          scans_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits?: number
          id: string
          period_start?: string
          plan?: Database["public"]["Enums"]["Plan"]
          scans_used?: number
          updated_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          period_start?: string
          plan?: Database["public"]["Enums"]["Plan"]
          scans_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          last_selected_website_id: string | null
          starred_metrics: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          last_selected_website_id?: string | null
          starred_metrics?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          last_selected_website_id?: string | null
          starred_metrics?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scans: {
        Row: {
          archived_at: string | null
          audience_id: string | null
          chain: string
          completed_at: string | null
          created_at: string
          error: string | null
          id: string
          name: string | null
          processed_count: number
          progress: number
          status: Database["public"]["Enums"]["ScanStatus"]
          step: Database["public"]["Enums"]["ScanStep"]
          updated_at: string
          user_id: string
          wallet_count: number
          wallets: string[] | null
          website_id: string | null
        }
        Insert: {
          archived_at?: string | null
          audience_id?: string | null
          chain: string
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          name?: string | null
          processed_count?: number
          progress?: number
          status?: Database["public"]["Enums"]["ScanStatus"]
          step?: Database["public"]["Enums"]["ScanStep"]
          updated_at?: string
          user_id: string
          wallet_count: number
          wallets?: string[] | null
          website_id?: string | null
        }
        Update: {
          archived_at?: string | null
          audience_id?: string | null
          chain?: string
          completed_at?: string | null
          created_at?: string
          error?: string | null
          id?: string
          name?: string | null
          processed_count?: number
          progress?: number
          status?: Database["public"]["Enums"]["ScanStatus"]
          step?: Database["public"]["Enums"]["ScanStep"]
          updated_at?: string
          user_id?: string
          wallet_count?: number
          wallets?: string[] | null
          website_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scans_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scans_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          name: string
          site_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          site_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          site_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      studies: {
        Row: {
          config: Json
          created_at: string
          id: string
          is_limited: boolean
          name: string
          result_url: string | null
          status: Database["public"]["Enums"]["StudyStatus"]
          updated_at: string
          user_id: string
        }
        Insert: {
          config: Json
          created_at?: string
          id: string
          is_limited?: boolean
          name: string
          result_url?: string | null
          status?: Database["public"]["Enums"]["StudyStatus"]
          updated_at: string
          user_id: string
        }
        Update: {
          config?: Json
          created_at?: string
          id?: string
          is_limited?: boolean
          name?: string
          result_url?: string | null
          status?: Database["public"]["Enums"]["StudyStatus"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "studies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      study_shares: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          share_token: string
          study_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id: string
          share_token: string
          study_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          share_token?: string
          study_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_shares_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_submissions: {
        Row: {
          created_at: string
          id: string
          telegram_handle: string
        }
        Insert: {
          created_at?: string
          id?: string
          telegram_handle: string
        }
        Update: {
          created_at?: string
          id?: string
          telegram_handle?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          address: string
          created_at: string
          id: string
          metadata: Json
          name: string
          symbol: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          symbol: string
          updated_at: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      touchpoints: {
        Row: {
          color: string | null
          cost_amount: number | null
          cost_currency: string | null
          created_at: string
          end_date: string | null
          event_type: string
          id: string
          name: string
          notes: string | null
          start_date: string | null
          timestamp: string | null
          updated_at: string
          user_id: string
          website_id: string
        }
        Insert: {
          color?: string | null
          cost_amount?: number | null
          cost_currency?: string | null
          created_at?: string
          end_date?: string | null
          event_type?: string
          id?: string
          name: string
          notes?: string | null
          start_date?: string | null
          timestamp?: string | null
          updated_at?: string
          user_id: string
          website_id: string
        }
        Update: {
          color?: string | null
          cost_amount?: number | null
          cost_currency?: string | null
          created_at?: string
          end_date?: string | null
          event_type?: string
          id?: string
          name?: string
          notes?: string | null
          start_date?: string | null
          timestamp?: string | null
          updated_at?: string
          user_id?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "touchpoints_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          supabase_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          supabase_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          supabase_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_shares: {
        Row: {
          created_at: string
          email: string
          id: string
          shared_by_id: string
          user_id: string | null
          website_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          shared_by_id: string
          user_id?: string | null
          website_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          shared_by_id?: string
          user_id?: string | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_shares_shared_by_id_fkey"
            columns: ["shared_by_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_shares_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_shares_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      website_tag_contracts: {
        Row: {
          chain: string
          chain_id: string | null
          contract_address: string
          created_at: string
          id: string
          name: string
          start_date: string | null
          updated_at: string
          website_id: string
        }
        Insert: {
          chain: string
          chain_id?: string | null
          contract_address: string
          created_at?: string
          id: string
          name: string
          start_date?: string | null
          updated_at: string
          website_id: string
        }
        Update: {
          chain?: string
          chain_id?: string | null
          contract_address?: string
          created_at?: string
          id?: string
          name?: string
          start_date?: string | null
          updated_at?: string
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_tag_contracts_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      websites: {
        Row: {
          archived_at: string | null
          base_url: string
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["WebsiteStatus"]
          tag_id: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          archived_at?: string | null
          base_url: string
          created_at?: string
          id: string
          name: string
          status?: Database["public"]["Enums"]["WebsiteStatus"]
          tag_id: string
          updated_at: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          archived_at?: string | null
          base_url?: string
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["WebsiteStatus"]
          tag_id?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "websites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      CovalentQueueStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
      CovalentRequestType: "WALLET_ENRICHMENT" | "SCAN_WALLET"
      Plan: "FREE" | "PRO" | "ENTERPRISE"
      ScanStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
      ScanStep:
        | "QUEUED"
        | "FETCHING_BALANCES"
        | "FETCHING_TRANSACTIONS"
        | "BUILDING_NETWORK"
        | "ENRICHING_SOCIALS"
        | "FETCHING_NEWS"
        | "FINALIZING"
        | "DONE"
      StudyStatus: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED"
      WebsiteStatus: "PENDING" | "VERIFIED" | "FAILED"
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
      CovalentQueueStatus: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      CovalentRequestType: ["WALLET_ENRICHMENT", "SCAN_WALLET"],
      Plan: ["FREE", "PRO", "ENTERPRISE"],
      ScanStatus: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      ScanStep: [
        "QUEUED",
        "FETCHING_BALANCES",
        "FETCHING_TRANSACTIONS",
        "BUILDING_NETWORK",
        "ENRICHING_SOCIALS",
        "FETCHING_NEWS",
        "FINALIZING",
        "DONE",
      ],
      StudyStatus: ["PENDING", "RUNNING", "COMPLETED", "FAILED"],
      WebsiteStatus: ["PENDING", "VERIFIED", "FAILED"],
    },
  },
} as const
