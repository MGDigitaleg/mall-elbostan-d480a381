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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          category: string | null
          content_ar: string | null
          content_en: string | null
          cover_image_url: string | null
          created_at: string
          excerpt_ar: string | null
          excerpt_en: string | null
          featured: boolean
          id: string
          published_at: string | null
          seo_description_ar: string | null
          seo_description_en: string | null
          seo_title_ar: string | null
          seo_title_en: string | null
          slug: string
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          content_ar?: string | null
          content_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          seo_description_ar?: string | null
          seo_description_en?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          slug: string
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          content_ar?: string | null
          content_en?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt_ar?: string | null
          excerpt_en?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          seo_description_ar?: string | null
          seo_description_en?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          slug?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      competition_stores: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          participation_note: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          participation_note?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          participation_note?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_stores_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          featured: boolean
          id: string
          is_live: boolean
          promo_code: string | null
          store_id: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean
          id?: string
          is_live?: boolean
          promo_code?: string | null
          store_id?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean
          id?: string
          is_live?: boolean
          promo_code?: string | null
          store_id?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          end_time: string | null
          event_date: string | null
          featured: boolean
          id: string
          image_url: string | null
          speaker_or_guest: string | null
          start_time: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          end_time?: string | null
          event_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          speaker_or_guest?: string | null
          start_time?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          end_time?: string | null
          event_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          speaker_or_guest?: string | null
          start_time?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer_ar: string
          answer_en: string | null
          category: string | null
          created_at: string
          id: string
          question_ar: string
          question_en: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_ar: string
          answer_en?: string | null
          category?: string | null
          created_at?: string
          id?: string
          question_ar: string
          question_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_ar?: string
          answer_en?: string | null
          category?: string | null
          created_at?: string
          id?: string
          question_ar?: string
          question_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      floors: {
        Row: {
          created_at: string
          id: string
          name_ar: string
          name_en: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_ar: string
          name_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_deadline: string | null
          apply_email: string | null
          company_or_store: string | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          job_type: string | null
          status: string
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          apply_email?: string | null
          company_or_store?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          job_type?: string | null
          status?: string
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          apply_email?: string | null
          company_or_store?: string | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          job_type?: string | null
          status?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          lead_type: string
          message: string | null
          metadata: Json | null
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          lead_type: string
          message?: string | null
          metadata?: Json | null
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          lead_type?: string
          message?: string | null
          metadata?: Json | null
          phone?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name_ar: string
          name_en: string | null
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name_ar: string
          name_en?: string | null
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name_ar?: string
          name_en?: string | null
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category_id: string | null
          created_at: string
          external_buy_url: string | null
          featured: boolean
          gallery: Json | null
          id: string
          image_url: string | null
          long_description_ar: string | null
          name_ar: string
          name_en: string | null
          price: number | null
          price_note: string | null
          short_description_ar: string | null
          short_description_en: string | null
          sku: string | null
          slug: string
          status: string
          store_id: string | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          external_buy_url?: string | null
          featured?: boolean
          gallery?: Json | null
          id?: string
          image_url?: string | null
          long_description_ar?: string | null
          name_ar: string
          name_en?: string | null
          price?: number | null
          price_note?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          sku?: string | null
          slug: string
          status?: string
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          created_at?: string
          external_buy_url?: string | null
          featured?: boolean
          gallery?: Json | null
          id?: string
          image_url?: string | null
          long_description_ar?: string | null
          name_ar?: string
          name_en?: string | null
          price?: number | null
          price_note?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          sku?: string | null
          slug?: string
          status?: string
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          active_from: string | null
          active_to: string | null
          claim_rules_ar: string | null
          claim_rules_en: string | null
          created_at: string
          id: string
          is_active: boolean
          probability_weight: number
          reward_type: string
          sponsor_store_id: string | null
          stock: number
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          active_from?: string | null
          active_to?: string | null
          claim_rules_ar?: string | null
          claim_rules_en?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          probability_weight?: number
          reward_type: string
          sponsor_store_id?: string | null
          stock?: number
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          active_from?: string | null
          active_to?: string | null
          claim_rules_ar?: string | null
          claim_rules_en?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          probability_weight?: number
          reward_type?: string
          sponsor_store_id?: string | null
          stock?: number
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_sponsor_store_id_fkey"
            columns: ["sponsor_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      spin_entries: {
        Row: {
          claim_status: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          opening_day_verified: boolean
          phone: string
          phone_hash: string
          prize_id: string | null
          social_follow_confirmed: boolean
          won_at: string | null
        }
        Insert: {
          claim_status?: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          opening_day_verified?: boolean
          phone: string
          phone_hash: string
          prize_id?: string | null
          social_follow_confirmed?: boolean
          won_at?: string | null
        }
        Update: {
          claim_status?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          opening_day_verified?: boolean
          phone?: string
          phone_hash?: string
          prize_id?: string | null
          social_follow_confirmed?: boolean
          won_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spin_entries_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      spin_sessions: {
        Row: {
          claim_code: string | null
          claim_status: string
          competition_store_id: string | null
          created_at: string
          email: string | null
          expires_at: string | null
          full_name: string
          id: string
          phone: string
          phone_hash: string
          prize_id: string | null
          qr_data: string | null
          redeemed_at: string | null
          redeemed_by: string | null
          spin_date: string
        }
        Insert: {
          claim_code?: string | null
          claim_status?: string
          competition_store_id?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          full_name: string
          id?: string
          phone: string
          phone_hash: string
          prize_id?: string | null
          qr_data?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
          spin_date?: string
        }
        Update: {
          claim_code?: string | null
          claim_status?: string
          competition_store_id?: string | null
          created_at?: string
          email?: string | null
          expires_at?: string | null
          full_name?: string
          id?: string
          phone?: string
          phone_hash?: string
          prize_id?: string | null
          qr_data?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
          spin_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "spin_sessions_competition_store_id_fkey"
            columns: ["competition_store_id"]
            isOneToOne: false
            referencedRelation: "competition_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spin_sessions_prize_id_fkey"
            columns: ["prize_id"]
            isOneToOne: false
            referencedRelation: "store_prizes"
            referencedColumns: ["id"]
          },
        ]
      }
      store_prizes: {
        Row: {
          active_from: string | null
          active_to: string | null
          category: string | null
          competition_store_id: string
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          name_ar: string
          name_en: string | null
          probability_weight: number
          redemption_rules_ar: string | null
          redemption_rules_en: string | null
          remaining_stock: number
          total_quantity: number
          updated_at: string
          validity_days: number | null
        }
        Insert: {
          active_from?: string | null
          active_to?: string | null
          category?: string | null
          competition_store_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar: string
          name_en?: string | null
          probability_weight?: number
          redemption_rules_ar?: string | null
          redemption_rules_en?: string | null
          remaining_stock?: number
          total_quantity?: number
          updated_at?: string
          validity_days?: number | null
        }
        Update: {
          active_from?: string | null
          active_to?: string | null
          category?: string | null
          competition_store_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          name_ar?: string
          name_en?: string | null
          probability_weight?: number
          redemption_rules_ar?: string | null
          redemption_rules_en?: string | null
          remaining_stock?: number
          total_quantity?: number
          updated_at?: string
          validity_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "store_prizes_competition_store_id_fkey"
            columns: ["competition_store_id"]
            isOneToOne: false
            referencedRelation: "competition_stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          category: string | null
          cover_image_url: string | null
          created_at: string
          email: string | null
          featured: boolean
          floor_id: string | null
          gallery: Json | null
          id: string
          logo_url: string | null
          long_description_ar: string | null
          long_description_en: string | null
          map_area_id: string | null
          map_x: number | null
          map_y: number | null
          name_ar: string
          name_en: string | null
          opening_hours: string | null
          phone: string | null
          short_description_ar: string | null
          short_description_en: string | null
          slug: string
          status: string
          unit_code: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          email?: string | null
          featured?: boolean
          floor_id?: string | null
          gallery?: Json | null
          id?: string
          logo_url?: string | null
          long_description_ar?: string | null
          long_description_en?: string | null
          map_area_id?: string | null
          map_x?: number | null
          map_y?: number | null
          name_ar: string
          name_en?: string | null
          opening_hours?: string | null
          phone?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          slug: string
          status?: string
          unit_code?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          email?: string | null
          featured?: boolean
          floor_id?: string | null
          gallery?: Json | null
          id?: string
          logo_url?: string | null
          long_description_ar?: string | null
          long_description_en?: string | null
          map_area_id?: string | null
          map_x?: number | null
          map_y?: number | null
          name_ar?: string
          name_en?: string | null
          opening_hours?: string | null
          phone?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          slug?: string
          status?: string
          unit_code?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stores_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "floors"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_logo_assets: {
        Row: {
          approved_for_final_export: boolean
          asset_type: string | null
          background_removal_needed: boolean
          brand_key: string
          created_at: string
          crop_needed: boolean
          execution_note: string | null
          final_export_name: string | null
          final_export_path: string | null
          final_file_path: string | null
          id: string
          last_follow_up_note: string | null
          normalized_display_name: string
          raw_file_path: string | null
          requested_source_type: string | null
          review_file_path: string | null
          review_status: string
          reviewer_notes: string | null
          safe_margin_applied: boolean
          source_file_name: string | null
          source_file_path: string | null
          square_artboard_ready: boolean
          tenant_provided_name: string
          transparent_export_ready: boolean
          units: string[]
          updated_at: string
        }
        Insert: {
          approved_for_final_export?: boolean
          asset_type?: string | null
          background_removal_needed?: boolean
          brand_key: string
          created_at?: string
          crop_needed?: boolean
          execution_note?: string | null
          final_export_name?: string | null
          final_export_path?: string | null
          final_file_path?: string | null
          id?: string
          last_follow_up_note?: string | null
          normalized_display_name: string
          raw_file_path?: string | null
          requested_source_type?: string | null
          review_file_path?: string | null
          review_status?: string
          reviewer_notes?: string | null
          safe_margin_applied?: boolean
          source_file_name?: string | null
          source_file_path?: string | null
          square_artboard_ready?: boolean
          tenant_provided_name: string
          transparent_export_ready?: boolean
          units?: string[]
          updated_at?: string
        }
        Update: {
          approved_for_final_export?: boolean
          asset_type?: string | null
          background_removal_needed?: boolean
          brand_key?: string
          created_at?: string
          crop_needed?: boolean
          execution_note?: string | null
          final_export_name?: string | null
          final_export_path?: string | null
          final_file_path?: string | null
          id?: string
          last_follow_up_note?: string | null
          normalized_display_name?: string
          raw_file_path?: string | null
          requested_source_type?: string | null
          review_file_path?: string | null
          review_status?: string
          reviewer_notes?: string | null
          safe_margin_applied?: boolean
          source_file_name?: string | null
          source_file_path?: string | null
          square_artboard_ready?: boolean
          tenant_provided_name?: string
          transparent_export_ready?: boolean
          units?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      units: {
        Row: {
          activity_suggestion: string | null
          area_sqm: number | null
          created_at: string
          description_ar: string | null
          description_en: string | null
          featured: boolean
          floor_id: string | null
          id: string
          map_area_id: string | null
          price_note: string | null
          status: string
          unit_code: string
          updated_at: string
        }
        Insert: {
          activity_suggestion?: string | null
          area_sqm?: number | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean
          floor_id?: string | null
          id?: string
          map_area_id?: string | null
          price_note?: string | null
          status?: string
          unit_code: string
          updated_at?: string
        }
        Update: {
          activity_suggestion?: string | null
          area_sqm?: number | null
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean
          floor_id?: string | null
          id?: string
          map_area_id?: string | null
          price_note?: string | null
          status?: string
          unit_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "floors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
