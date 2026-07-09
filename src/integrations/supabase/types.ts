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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          after: Json | null
          before: Json | null
          created_at: string
          id: string
          resource_id: string | null
          resource_type: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          resource_id?: string | null
          resource_type: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          resource_id?: string | null
          resource_type?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          country: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      journal_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["notification_kind"]
          payload: Json
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["notification_kind"]
          payload?: Json
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["notification_kind"]
          payload?: Json
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          description: string
          group: string
          id: string
          key: string
        }
        Insert: {
          description: string
          group: string
          id?: string
          key: string
        }
        Update: {
          description?: string
          group?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academic_degree: string | null
          country: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          institution_id: string | null
          institution_text: string | null
          orcid: string | null
          updated_at: string
        }
        Insert: {
          academic_degree?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name?: string
          id: string
          institution_id?: string | null
          institution_text?: string | null
          orcid?: string | null
          updated_at?: string
        }
        Update: {
          academic_degree?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          institution_id?: string | null
          institution_text?: string | null
          orcid?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          permission_id: string
          role_id: string
        }
        Insert: {
          permission_id: string
          role_id: string
        }
        Update: {
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          key: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          key: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          key?: string
          name?: string
        }
        Relationships: []
      }
      submission_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          deadline: string | null
          editor_id: string
          id: string
          instructions: string | null
          submission_id: string
          unassigned_at: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          deadline?: string | null
          editor_id: string
          id?: string
          instructions?: string | null
          submission_id: string
          unassigned_at?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          deadline?: string | null
          editor_id?: string
          id?: string
          instructions?: string | null
          submission_id?: string
          unassigned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_assignments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_authors: {
        Row: {
          academic_degree: string | null
          contributor_role: Database["public"]["Enums"]["contributor_role"]
          country: string | null
          created_at: string
          credit_roles: string[]
          department: string | null
          email: string | null
          full_name: string
          id: string
          institution: string | null
          institution_url: string | null
          is_corresponding: boolean
          orcid: string | null
          phone: string | null
          profile_id: string | null
          scopus_url: string | null
          sort_order: number
          submission_id: string
        }
        Insert: {
          academic_degree?: string | null
          contributor_role?: Database["public"]["Enums"]["contributor_role"]
          country?: string | null
          created_at?: string
          credit_roles?: string[]
          department?: string | null
          email?: string | null
          full_name: string
          id?: string
          institution?: string | null
          institution_url?: string | null
          is_corresponding?: boolean
          orcid?: string | null
          phone?: string | null
          profile_id?: string | null
          scopus_url?: string | null
          sort_order?: number
          submission_id: string
        }
        Update: {
          academic_degree?: string | null
          contributor_role?: Database["public"]["Enums"]["contributor_role"]
          country?: string | null
          created_at?: string
          credit_roles?: string[]
          department?: string | null
          email?: string | null
          full_name?: string
          id?: string
          institution?: string | null
          institution_url?: string | null
          is_corresponding?: boolean
          orcid?: string | null
          phone?: string | null
          profile_id?: string | null
          scopus_url?: string | null
          sort_order?: number
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_authors_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_authors_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_declarations: {
        Row: {
          created_at: string
          declaration_key: string
          explanation: string | null
          id: string
          response_type: string
          response_value: string | null
          submission_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          declaration_key: string
          explanation?: string | null
          id?: string
          response_type: string
          response_value?: string | null
          submission_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          declaration_key?: string
          explanation?: string | null
          id?: string
          response_type?: string
          response_value?: string | null
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_declarations_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_files: {
        Row: {
          filename: string
          id: string
          kind: Database["public"]["Enums"]["file_kind"]
          mime: string | null
          size_bytes: number
          storage_path: string
          submission_id: string
          uploaded_at: string
          uploaded_by: string
          version_id: string | null
        }
        Insert: {
          filename: string
          id?: string
          kind?: Database["public"]["Enums"]["file_kind"]
          mime?: string | null
          size_bytes?: number
          storage_path: string
          submission_id: string
          uploaded_at?: string
          uploaded_by: string
          version_id?: string | null
        }
        Update: {
          filename?: string
          id?: string
          kind?: Database["public"]["Enums"]["file_kind"]
          mime?: string | null
          size_bytes?: number
          storage_path?: string
          submission_id?: string
          uploaded_at?: string
          uploaded_by?: string
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_files_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "submission_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_status_history: {
        Row: {
          actor_id: string | null
          created_at: string
          from_state: Database["public"]["Enums"]["workflow_state"] | null
          id: string
          payload: Json
          reason: string | null
          submission_id: string
          to_state: Database["public"]["Enums"]["workflow_state"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          from_state?: Database["public"]["Enums"]["workflow_state"] | null
          id?: string
          payload?: Json
          reason?: string | null
          submission_id: string
          to_state: Database["public"]["Enums"]["workflow_state"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          from_state?: Database["public"]["Enums"]["workflow_state"] | null
          id?: string
          payload?: Json
          reason?: string | null
          submission_id?: string
          to_state?: Database["public"]["Enums"]["workflow_state"]
        }
        Relationships: [
          {
            foreignKeyName: "submission_status_history_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_suggested_reviewers: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          institution: string | null
          reason: string | null
          sort_order: number
          submission_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          institution?: string | null
          reason?: string | null
          sort_order?: number
          submission_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          institution?: string | null
          reason?: string | null
          sort_order?: number
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_suggested_reviewers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_versions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          note: string | null
          submission_id: string
          version_no: number
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          note?: string | null
          submission_id: string
          version_no: number
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          note?: string | null
          submission_id?: string
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "submission_versions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          abstract: string | null
          abstract_en: string | null
          ai_section: string | null
          article_format: string | null
          article_type: Database["public"]["Enums"]["article_type"]
          cover_letter: string | null
          created_at: string
          declarations: Json
          id: string
          keywords: string[]
          keywords_en: string[]
          manuscript_id: string
          originality_confirmed: boolean
          owner_id: string
          primary_language: Database["public"]["Enums"]["primary_language"]
          research_field: string | null
          special_issue: boolean | null
          submitted_at: string | null
          terms_accepted: boolean
          title: string
          title_en: string | null
          title_original: string | null
          updated_at: string
          workflow_state: Database["public"]["Enums"]["workflow_state"]
        }
        Insert: {
          abstract?: string | null
          abstract_en?: string | null
          ai_section?: string | null
          article_format?: string | null
          article_type?: Database["public"]["Enums"]["article_type"]
          cover_letter?: string | null
          created_at?: string
          declarations?: Json
          id?: string
          keywords?: string[]
          keywords_en?: string[]
          manuscript_id?: string
          originality_confirmed?: boolean
          owner_id: string
          primary_language?: Database["public"]["Enums"]["primary_language"]
          research_field?: string | null
          special_issue?: boolean | null
          submitted_at?: string | null
          terms_accepted?: boolean
          title?: string
          title_en?: string | null
          title_original?: string | null
          updated_at?: string
          workflow_state?: Database["public"]["Enums"]["workflow_state"]
        }
        Update: {
          abstract?: string | null
          abstract_en?: string | null
          ai_section?: string | null
          article_format?: string | null
          article_type?: Database["public"]["Enums"]["article_type"]
          cover_letter?: string | null
          created_at?: string
          declarations?: Json
          id?: string
          keywords?: string[]
          keywords_en?: string[]
          manuscript_id?: string
          originality_confirmed?: boolean
          owner_id?: string
          primary_language?: Database["public"]["Enums"]["primary_language"]
          research_field?: string | null
          special_issue?: boolean | null
          submitted_at?: string | null
          terms_accepted?: boolean
          title?: string
          title_en?: string | null
          title_original?: string | null
          updated_at?: string
          workflow_state?: Database["public"]["Enums"]["workflow_state"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string
          granted_by: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_editor: {
        Args: {
          _deadline?: string
          _editor_id: string
          _instructions?: string
          _submission_id: string
        }
        Returns: {
          abstract: string | null
          abstract_en: string | null
          ai_section: string | null
          article_format: string | null
          article_type: Database["public"]["Enums"]["article_type"]
          cover_letter: string | null
          created_at: string
          declarations: Json
          id: string
          keywords: string[]
          keywords_en: string[]
          manuscript_id: string
          originality_confirmed: boolean
          owner_id: string
          primary_language: Database["public"]["Enums"]["primary_language"]
          research_field: string | null
          special_issue: boolean | null
          submitted_at: string | null
          terms_accepted: boolean
          title: string
          title_en: string | null
          title_original: string | null
          updated_at: string
          workflow_state: Database["public"]["Enums"]["workflow_state"]
        }
        SetofOptions: {
          from: "*"
          to: "submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      bootstrap_super_admin: {
        Args: { _expected_token: string; _provided_token: string }
        Returns: boolean
      }
      generate_manuscript_id: { Args: never; Returns: string }
      has_permission: {
        Args: { _permission_key: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: { _role_key: string; _user_id: string }
        Returns: boolean
      }
      is_assigned_editor: {
        Args: { _submission_id: string; _user_id: string }
        Returns: boolean
      }
      transition_submission: {
        Args: {
          _payload?: Json
          _reason?: string
          _submission_id: string
          _to_state: Database["public"]["Enums"]["workflow_state"]
        }
        Returns: {
          abstract: string | null
          abstract_en: string | null
          ai_section: string | null
          article_format: string | null
          article_type: Database["public"]["Enums"]["article_type"]
          cover_letter: string | null
          created_at: string
          declarations: Json
          id: string
          keywords: string[]
          keywords_en: string[]
          manuscript_id: string
          originality_confirmed: boolean
          owner_id: string
          primary_language: Database["public"]["Enums"]["primary_language"]
          research_field: string | null
          special_issue: boolean | null
          submitted_at: string | null
          terms_accepted: boolean
          title: string
          title_en: string | null
          title_original: string | null
          updated_at: string
          workflow_state: Database["public"]["Enums"]["workflow_state"]
        }
        SetofOptions: {
          from: "*"
          to: "submissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      article_type:
        | "research"
        | "review"
        | "short_communication"
        | "book_review"
        | "editorial"
      contributor_role:
        | "author"
        | "co_author"
        | "corresponding"
        | "translator"
        | "editor"
      file_kind:
        | "manuscript"
        | "anonymous_manuscript"
        | "cover_letter"
        | "figure"
        | "table"
        | "supplementary"
        | "data"
        | "other"
      notification_kind:
        | "submission_received"
        | "editor_assigned"
        | "state_changed"
        | "revision_requested"
        | "decision_made"
        | "file_added"
      primary_language: "uz" | "en" | "ru" | "qq"
      workflow_state:
        | "draft"
        | "submitted"
        | "screening"
        | "editor_assigned"
        | "under_review"
        | "revision_requested"
        | "revised"
        | "accepted"
        | "rejected"
        | "withdrawn"
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
      article_type: [
        "research",
        "review",
        "short_communication",
        "book_review",
        "editorial",
      ],
      contributor_role: [
        "author",
        "co_author",
        "corresponding",
        "translator",
        "editor",
      ],
      file_kind: [
        "manuscript",
        "anonymous_manuscript",
        "cover_letter",
        "figure",
        "table",
        "supplementary",
        "data",
        "other",
      ],
      notification_kind: [
        "submission_received",
        "editor_assigned",
        "state_changed",
        "revision_requested",
        "decision_made",
        "file_added",
      ],
      primary_language: ["uz", "en", "ru", "qq"],
      workflow_state: [
        "draft",
        "submitted",
        "screening",
        "editor_assigned",
        "under_review",
        "revision_requested",
        "revised",
        "accepted",
        "rejected",
        "withdrawn",
      ],
    },
  },
} as const
