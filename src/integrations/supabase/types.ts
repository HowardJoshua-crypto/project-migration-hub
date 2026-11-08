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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_invites: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      application_notes: {
        Row: {
          application_id: string
          author_id: string | null
          author_name: string
          body: string
          created_at: string
          id: string
        }
        Insert: {
          application_id: string
          author_id?: string | null
          author_name?: string
          body: string
          created_at?: string
          id?: string
        }
        Update: {
          application_id?: string
          author_id?: string | null
          author_name?: string
          body?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_notes_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_passport_snapshots: {
        Row: {
          application_id: string
          created_at: string
          snapshot: Json
        }
        Insert: {
          application_id: string
          created_at?: string
          snapshot: Json
        }
        Update: {
          application_id?: string
          created_at?: string
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "application_passport_snapshots_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_status_history: {
        Row: {
          actor: string
          application_id: string
          changed_by: string | null
          created_at: string
          id: string
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          actor: string
          application_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          status: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          actor?: string
          application_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "application_status_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          attachment_paths: string[]
          cover_note: string
          id: string
          opportunity_id: string
          shared_sections: string[]
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          talent_id: string
          updated_at: string
        }
        Insert: {
          attachment_paths?: string[]
          cover_note?: string
          id?: string
          opportunity_id: string
          shared_sections?: string[]
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          talent_id: string
          updated_at?: string
        }
        Update: {
          attachment_paths?: string[]
          cover_note?: string
          id?: string
          opportunity_id?: string
          shared_sections?: string[]
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          talent_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: number
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: never
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: never
        }
        Relationships: []
      }
      credentials: {
        Row: {
          created_at: string
          file_path: string | null
          id: string
          issued_on: string
          issuer: string
          reviewed_at: string | null
          status: Database["public"]["Enums"]["credential_status"]
          talent_id: string
          title: string
        }
        Insert: {
          created_at?: string
          file_path?: string | null
          id?: string
          issued_on: string
          issuer: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["credential_status"]
          talent_id: string
          title: string
        }
        Update: {
          created_at?: string
          file_path?: string | null
          id?: string
          issued_on?: string
          issuer?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["credential_status"]
          talent_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      education_records: {
        Row: {
          award: string
          created_at: string
          document_path: string | null
          end_year: string
          id: string
          institution: string
          level: string
          programme: string
          start_year: string
          talent_id: string
        }
        Insert: {
          award: string
          created_at?: string
          document_path?: string | null
          end_year: string
          id?: string
          institution: string
          level: string
          programme: string
          start_year: string
          talent_id: string
        }
        Update: {
          award?: string
          created_at?: string
          document_path?: string | null
          end_year?: string
          id?: string
          institution?: string
          level?: string
          programme?: string
          start_year?: string
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_records_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      experience_records: {
        Row: {
          created_at: string
          end_month: string | null
          id: string
          org_name: string
          role: string
          start_month: string
          summary: string
          talent_id: string
        }
        Insert: {
          created_at?: string
          end_month?: string | null
          id?: string
          org_name: string
          role: string
          start_month: string
          summary?: string
          talent_id: string
        }
        Update: {
          created_at?: string
          end_month?: string | null
          id?: string
          org_name?: string
          role?: string
          start_month?: string
          summary?: string
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_records_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      external_application_clicks: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_application_clicks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          application_id: string | null
          body: string
          created_at: string
          id: string
          opportunity_id: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          application_id?: string | null
          body?: string
          created_at?: string
          id?: string
          opportunity_id?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          application_id?: string | null
          body?: string
          created_at?: string
          id?: string
          opportunity_id?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          category_key: string
          closed_at: string | null
          compensation: string
          created_at: string
          created_by: string | null
          deadline: string
          description: string
          eligibility_summary: string
          eligible_locations: string[]
          eligible_programmes: string[]
          fields: string[]
          funding: string
          id: string
          kind: Database["public"]["Enums"]["opportunity_kind"]
          last_verified: string | null
          location: string
          min_education: string | null
          min_experience_months: number
          official_apply_url: string
          opening_date: string
          org_id: string | null
          provider_name: string | null
          published_at: string | null
          source_id: string | null
          source_url: string
          status: Database["public"]["Enums"]["opportunity_status"]
          summary: string
          title: string
          updated_at: string
          work_arrangement: string
        }
        Insert: {
          category_key: string
          closed_at?: string | null
          compensation?: string
          created_at?: string
          created_by?: string | null
          deadline: string
          description?: string
          eligibility_summary?: string
          eligible_locations?: string[]
          eligible_programmes?: string[]
          fields?: string[]
          funding?: string
          id?: string
          kind?: Database["public"]["Enums"]["opportunity_kind"]
          last_verified?: string | null
          location: string
          min_education?: string | null
          min_experience_months?: number
          official_apply_url?: string
          opening_date: string
          org_id?: string | null
          provider_name?: string | null
          published_at?: string | null
          source_id?: string | null
          source_url?: string
          status?: Database["public"]["Enums"]["opportunity_status"]
          summary: string
          title: string
          updated_at?: string
          work_arrangement: string
        }
        Update: {
          category_key?: string
          closed_at?: string | null
          compensation?: string
          created_at?: string
          created_by?: string | null
          deadline?: string
          description?: string
          eligibility_summary?: string
          eligible_locations?: string[]
          eligible_programmes?: string[]
          fields?: string[]
          funding?: string
          id?: string
          kind?: Database["public"]["Enums"]["opportunity_kind"]
          last_verified?: string | null
          location?: string
          min_education?: string | null
          min_experience_months?: number
          official_apply_url?: string
          opening_date?: string
          org_id?: string | null
          provider_name?: string | null
          published_at?: string | null
          source_id?: string | null
          source_url?: string
          status?: Database["public"]["Enums"]["opportunity_status"]
          summary?: string
          title?: string
          updated_at?: string
          work_arrangement?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_category_key_fkey"
            columns: ["category_key"]
            isOneToOne: false
            referencedRelation: "opportunity_categories"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "opportunities_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "opportunity_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_categories: {
        Row: {
          key: string
          label: string
          sort_order: number
        }
        Insert: {
          key: string
          label: string
          sort_order?: number
        }
        Update: {
          key?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      opportunity_skills: {
        Row: {
          opportunity_id: string
          skill_id: string
        }
        Insert: {
          opportunity_id: string
          skill_id: string
        }
        Update: {
          opportunity_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_skills_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_sources: {
        Row: {
          created_at: string
          id: string
          name: string
          website_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          website_url?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          website_url?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          member_role: Database["public"]["Enums"]["org_member_role"]
          org_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          member_role?: Database["public"]["Enums"]["org_member_role"]
          org_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          member_role?: Database["public"]["Enums"]["org_member_role"]
          org_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          about: string
          created_at: string
          created_by: string | null
          id: string
          location: string
          name: string
          org_type: Database["public"]["Enums"]["org_type"]
          sector: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          website: string
        }
        Insert: {
          about?: string
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string
          name: string
          org_type?: Database["public"]["Enums"]["org_type"]
          sector?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string
        }
        Update: {
          about?: string
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string
          name?: string
          org_type?: Database["public"]["Enums"]["org_type"]
          sector?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string
        }
        Relationships: []
      }
      partnership_activities: {
        Row: {
          created_at: string
          created_by: string | null
          details: string
          id: string
          occurred_on: string
          partnership_id: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          details?: string
          id?: string
          occurred_on?: string
          partnership_id: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          details?: string
          id?: string
          occurred_on?: string
          partnership_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_activities_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_members: {
        Row: {
          joined_at: string
          member_role: string
          org_id: string
          partnership_id: string
        }
        Insert: {
          joined_at?: string
          member_role?: string
          org_id: string
          partnership_id: string
        }
        Update: {
          joined_at?: string
          member_role?: string
          org_id?: string
          partnership_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_members_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "partnerships"
            referencedColumns: ["id"]
          },
        ]
      }
      partnerships: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          lead_org_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          lead_org_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          lead_org_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnerships_lead_org_id_fkey"
            columns: ["lead_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_section_visibility: {
        Row: {
          passport_id: string
          section: string
          updated_at: string
          visibility: Database["public"]["Enums"]["section_visibility"]
        }
        Insert: {
          passport_id: string
          section: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["section_visibility"]
        }
        Update: {
          passport_id?: string
          section?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["section_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "passport_section_visibility_passport_id_fkey"
            columns: ["passport_id"]
            isOneToOne: false
            referencedRelation: "passports"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_shares: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          org_id: string
          passport_id: string
          revoked_at: string | null
          sections: string[]
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          org_id: string
          passport_id: string
          revoked_at?: string | null
          sections?: string[]
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          org_id?: string
          passport_id?: string
          revoked_at?: string | null
          sections?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "passport_shares_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passport_shares_passport_id_fkey"
            columns: ["passport_id"]
            isOneToOne: false
            referencedRelation: "passports"
            referencedColumns: ["id"]
          },
        ]
      }
      passports: {
        Row: {
          created_at: string
          handle: string
          id: string
          talent_id: string
        }
        Insert: {
          created_at?: string
          handle: string
          id?: string
          talent_id: string
        }
        Update: {
          created_at?: string
          handle?: string
          id?: string
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "passports_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: true
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          created_at: string
          id: string
          summary: string
          talent_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          summary: string
          talent_id: string
          title: string
          url?: string
        }
        Update: {
          created_at?: string
          id?: string
          summary?: string
          talent_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["app_role"]
          created_at: string
          display_name: string
          email: string
          id: string
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          display_name?: string
          email?: string
          id: string
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          description: string
          label: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          description?: string
          label: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          description?: string
          label?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          created_at: string
          opportunity_id: string
          talent_id: string
        }
        Insert: {
          created_at?: string
          opportunity_id: string
          talent_id: string
        }
        Update: {
          created_at?: string
          opportunity_id?: string
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_opportunities_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      talent_personal_details: {
        Row: {
          contact_email: string
          district: string
          dob: string | null
          national_id: string
          phone: string
          profile_image_path: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string
          district?: string
          dob?: string | null
          national_id?: string
          phone?: string
          profile_image_path?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string
          district?: string
          dob?: string | null
          national_id?: string
          phone?: string
          profile_image_path?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_personal_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      talent_profiles: {
        Row: {
          about: string
          career_interests: string[]
          created_at: string
          full_name: string
          headline: string
          location: string
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string
          career_interests?: string[]
          created_at?: string
          full_name?: string
          headline?: string
          location?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string
          career_interests?: string[]
          created_at?: string
          full_name?: string
          headline?: string
          location?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_skills: {
        Row: {
          created_at: string
          skill_id: string
          talent_id: string
        }
        Insert: {
          created_at?: string
          skill_id: string
          talent_id: string
        }
        Update: {
          created_at?: string
          skill_id?: string
          talent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talent_skills_talent_id_fkey"
            columns: ["talent_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role"]
          },
        ]
      }
      verification_requests: {
        Row: {
          credential_id: string | null
          details: Json
          document_paths: string[]
          id: string
          kind: Database["public"]["Enums"]["verification_kind"]
          org_id: string | null
          review_note: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["request_status"]
          submitted_at: string
          submitted_by: string | null
        }
        Insert: {
          credential_id?: string | null
          details?: Json
          document_paths?: string[]
          id?: string
          kind: Database["public"]["Enums"]["verification_kind"]
          org_id?: string | null
          review_note?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string
          submitted_by?: string | null
        }
        Update: {
          credential_id?: string | null
          details?: Json
          document_paths?: string[]
          id?: string
          kind?: Database["public"]["Enums"]["verification_kind"]
          org_id?: string | null
          review_note?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          submitted_at?: string
          submitted_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_requests_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_requests_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      application_org_id: { Args: { _application_id: string }; Returns: string }
      can_edit_org: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      can_manage_partnership: {
        Args: { _partnership_id: string; _user_id: string }
        Returns: boolean
      }
      can_recruit: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      can_view_application: {
        Args: { _application_id: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active_user: { Args: { _user_id: string }; Returns: boolean }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_partnership_member: {
        Args: { _partnership_id: string; _user_id: string }
        Returns: boolean
      }
      org_role: {
        Args: { _org_id: string; _user_id: string }
        Returns: Database["public"]["Enums"]["org_member_role"]
      }
      try_uuid: { Args: { _v: string }; Returns: string }
    }
    Enums: {
      account_status: "ACTIVE" | "SUSPENDED"
      app_role: "talent" | "employer" | "partner" | "admin"
      application_status:
        | "SUBMITTED"
        | "UNDER_REVIEW"
        | "SHORTLISTED"
        | "INTERVIEW"
        | "ACCEPTED"
        | "REJECTED"
        | "WITHDRAWN"
      credential_status: "pending" | "verified" | "rejected"
      opportunity_kind: "internal" | "external"
      opportunity_status: "DRAFT" | "PUBLISHED" | "CLOSED"
      org_member_role: "owner" | "admin" | "recruiter" | "viewer"
      org_type: "Employer" | "NGO" | "University" | "Government"
      request_status: "PENDING" | "APPROVED" | "REJECTED"
      section_visibility: "PUBLIC" | "SHARED_ONLY" | "PRIVATE"
      verification_kind: "ORGANIZATION" | "CREDENTIAL"
      verification_status:
        | "NOT_SUBMITTED"
        | "PENDING_REVIEW"
        | "VERIFIED"
        | "REJECTED"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      account_status: ["ACTIVE", "SUSPENDED"],
      app_role: ["talent", "employer", "partner", "admin"],
      application_status: [
        "SUBMITTED",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "INTERVIEW",
        "ACCEPTED",
        "REJECTED",
        "WITHDRAWN",
      ],
      credential_status: ["pending", "verified", "rejected"],
      opportunity_kind: ["internal", "external"],
      opportunity_status: ["DRAFT", "PUBLISHED", "CLOSED"],
      org_member_role: ["owner", "admin", "recruiter", "viewer"],
      org_type: ["Employer", "NGO", "University", "Government"],
      request_status: ["PENDING", "APPROVED", "REJECTED"],
      section_visibility: ["PUBLIC", "SHARED_ONLY", "PRIVATE"],
      verification_kind: ["ORGANIZATION", "CREDENTIAL"],
      verification_status: [
        "NOT_SUBMITTED",
        "PENDING_REVIEW",
        "VERIFIED",
        "REJECTED",
      ],
    },
  },
} as const
