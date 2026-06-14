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
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          changed_columns: string[] | null
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          row_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          changed_columns?: string[] | null
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          row_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          changed_columns?: string[] | null
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          row_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
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
      campaign_settings: {
        Row: {
          cta_label_ar: string | null
          cta_label_en: string | null
          description_ar: string | null
          description_en: string | null
          ends_at: string | null
          headline_ar: string | null
          headline_en: string | null
          id: string
          is_active: boolean
          key: string
          languages: string[]
          paused_message_ar: string | null
          paused_title_ar: string | null
          starts_at: string | null
          subtitle_ar: string | null
          subtitle_en: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          cta_label_ar?: string | null
          cta_label_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          ends_at?: string | null
          headline_ar?: string | null
          headline_en?: string | null
          id?: string
          is_active?: boolean
          key: string
          languages?: string[]
          paused_message_ar?: string | null
          paused_title_ar?: string | null
          starts_at?: string | null
          subtitle_ar?: string | null
          subtitle_en?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          cta_label_ar?: string | null
          cta_label_en?: string | null
          description_ar?: string | null
          description_en?: string | null
          ends_at?: string | null
          headline_ar?: string | null
          headline_en?: string | null
          id?: string
          is_active?: boolean
          key?: string
          languages?: string[]
          paused_message_ar?: string | null
          paused_title_ar?: string | null
          starts_at?: string | null
          subtitle_ar?: string | null
          subtitle_en?: string | null
          updated_at?: string
          updated_by?: string | null
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
          brand: string | null
          campaign_key: string
          created_at: string
          currency: string
          description_ar: string | null
          description_en: string | null
          featured: boolean
          id: string
          image_primary: string | null
          is_live: boolean
          model: string | null
          offer_badge_ar: string | null
          opening_status: string
          price_current: number | null
          price_old: number | null
          promo_code: string | null
          sort_order: number
          source_link: string | null
          source_type: string | null
          specs_short_ar: string | null
          store_id: string | null
          title_ar: string
          title_en: string | null
          updated_at: string
          valid_from: string | null
          valid_to: string | null
          verified: boolean
        }
        Insert: {
          brand?: string | null
          campaign_key?: string
          created_at?: string
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean
          id?: string
          image_primary?: string | null
          is_live?: boolean
          model?: string | null
          offer_badge_ar?: string | null
          opening_status?: string
          price_current?: number | null
          price_old?: number | null
          promo_code?: string | null
          sort_order?: number
          source_link?: string | null
          source_type?: string | null
          specs_short_ar?: string | null
          store_id?: string | null
          title_ar: string
          title_en?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
          verified?: boolean
        }
        Update: {
          brand?: string | null
          campaign_key?: string
          created_at?: string
          currency?: string
          description_ar?: string | null
          description_en?: string | null
          featured?: boolean
          id?: string
          image_primary?: string | null
          is_live?: boolean
          model?: string | null
          offer_badge_ar?: string | null
          opening_status?: string
          price_current?: number | null
          price_old?: number | null
          promo_code?: string | null
          sort_order?: number
          source_link?: string | null
          source_type?: string | null
          specs_short_ar?: string | null
          store_id?: string | null
          title_ar?: string
          title_en?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
          verified?: boolean
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
      downtown_directory_audit: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          field: string | null
          id: string
          merchant_id: string
          new_value: string | null
          note: string | null
          old_value: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          field?: string | null
          id?: string
          merchant_id: string
          new_value?: string | null
          note?: string | null
          old_value?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          field?: string | null
          id?: string
          merchant_id?: string
          new_value?: string | null
          note?: string | null
          old_value?: string | null
        }
        Relationships: []
      }
      downtown_merchants: {
        Row: {
          address: string | null
          address_en: string | null
          branch: string
          category: string | null
          category_secondary: string | null
          confidence_score: number | null
          confirmed_by_team_at: string | null
          cover_image_url: string | null
          created_at: string
          current_status: string | null
          detailed_specialisation: string | null
          email: string | null
          evidence_summary: string | null
          facebook_url: string | null
          floor: string | null
          floor_unit_location: string | null
          google_maps_url: string | null
          id: string
          instagram_url: string | null
          is_active: boolean
          is_marketplace_enabled: boolean
          keywords_ar: string | null
          keywords_en: string | null
          last_evidence_date: string | null
          last_manual_check_date: string | null
          last_verified_at: string | null
          logo_url: string | null
          missing_data: string | null
          name_ar: string
          name_en: string | null
          next_action: string | null
          notes_for_website_team: string | null
          opening_hours: string | null
          original_directory_presence: string | null
          phone: string | null
          products_services: string | null
          products_services_ar: string | null
          products_services_en: string | null
          recommended_badge: string | null
          row_type: string | null
          seo_meta_description_ar: string | null
          seo_meta_description_en: string | null
          seo_title_ar: string | null
          seo_title_en: string | null
          show_verified_publicly: boolean
          slug: string
          social_url: string | null
          sort_order: number
          source_1_label: string | null
          source_1_url: string | null
          source_2_label: string | null
          source_2_url: string | null
          source_3_label: string | null
          source_3_url: string | null
          source_date_quality: string | null
          source_notes: string | null
          source_url: string | null
          summary_ar: string | null
          summary_en: string | null
          tech_related: boolean | null
          tiktok_url: string | null
          unit_number: string | null
          updated_at: string
          verification_notes: string | null
          verification_status: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          address_en?: string | null
          branch?: string
          category?: string | null
          category_secondary?: string | null
          confidence_score?: number | null
          confirmed_by_team_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          current_status?: string | null
          detailed_specialisation?: string | null
          email?: string | null
          evidence_summary?: string | null
          facebook_url?: string | null
          floor?: string | null
          floor_unit_location?: string | null
          google_maps_url?: string | null
          id?: string
          instagram_url?: string | null
          is_active?: boolean
          is_marketplace_enabled?: boolean
          keywords_ar?: string | null
          keywords_en?: string | null
          last_evidence_date?: string | null
          last_manual_check_date?: string | null
          last_verified_at?: string | null
          logo_url?: string | null
          missing_data?: string | null
          name_ar: string
          name_en?: string | null
          next_action?: string | null
          notes_for_website_team?: string | null
          opening_hours?: string | null
          original_directory_presence?: string | null
          phone?: string | null
          products_services?: string | null
          products_services_ar?: string | null
          products_services_en?: string | null
          recommended_badge?: string | null
          row_type?: string | null
          seo_meta_description_ar?: string | null
          seo_meta_description_en?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          show_verified_publicly?: boolean
          slug: string
          social_url?: string | null
          sort_order?: number
          source_1_label?: string | null
          source_1_url?: string | null
          source_2_label?: string | null
          source_2_url?: string | null
          source_3_label?: string | null
          source_3_url?: string | null
          source_date_quality?: string | null
          source_notes?: string | null
          source_url?: string | null
          summary_ar?: string | null
          summary_en?: string | null
          tech_related?: boolean | null
          tiktok_url?: string | null
          unit_number?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          address_en?: string | null
          branch?: string
          category?: string | null
          category_secondary?: string | null
          confidence_score?: number | null
          confirmed_by_team_at?: string | null
          cover_image_url?: string | null
          created_at?: string
          current_status?: string | null
          detailed_specialisation?: string | null
          email?: string | null
          evidence_summary?: string | null
          facebook_url?: string | null
          floor?: string | null
          floor_unit_location?: string | null
          google_maps_url?: string | null
          id?: string
          instagram_url?: string | null
          is_active?: boolean
          is_marketplace_enabled?: boolean
          keywords_ar?: string | null
          keywords_en?: string | null
          last_evidence_date?: string | null
          last_manual_check_date?: string | null
          last_verified_at?: string | null
          logo_url?: string | null
          missing_data?: string | null
          name_ar?: string
          name_en?: string | null
          next_action?: string | null
          notes_for_website_team?: string | null
          opening_hours?: string | null
          original_directory_presence?: string | null
          phone?: string | null
          products_services?: string | null
          products_services_ar?: string | null
          products_services_en?: string | null
          recommended_badge?: string | null
          row_type?: string | null
          seo_meta_description_ar?: string | null
          seo_meta_description_en?: string | null
          seo_title_ar?: string | null
          seo_title_en?: string | null
          show_verified_publicly?: boolean
          slug?: string
          social_url?: string | null
          sort_order?: number
          source_1_label?: string | null
          source_1_url?: string | null
          source_2_label?: string | null
          source_2_url?: string | null
          source_3_label?: string | null
          source_3_url?: string | null
          source_date_quality?: string | null
          source_notes?: string | null
          source_url?: string | null
          summary_ar?: string | null
          summary_en?: string | null
          tech_related?: boolean | null
          tiktok_url?: string | null
          unit_number?: string | null
          updated_at?: string
          verification_notes?: string | null
          verification_status?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      edge_function_logs: {
        Row: {
          created_at: string
          duration_ms: number | null
          error_message: string | null
          error_stack: string | null
          function_name: string
          id: string
          method: string | null
          path: string | null
          request_summary: Json | null
          status: string
          status_code: number | null
        }
        Insert: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          error_stack?: string | null
          function_name: string
          id?: string
          method?: string | null
          path?: string | null
          request_summary?: Json | null
          status?: string
          status_code?: number | null
        }
        Update: {
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          error_stack?: string | null
          function_name?: string
          id?: string
          method?: string | null
          path?: string | null
          request_summary?: Json | null
          status?: string
          status_code?: number | null
        }
        Relationships: []
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
      indexing_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          results: Json
          source: string
          success: boolean
          url_list: string[]
          urls_submitted: number
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          results?: Json
          source?: string
          success?: boolean
          url_list?: string[]
          urls_submitted?: number
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          results?: Json
          source?: string
          success?: boolean
          url_list?: string[]
          urls_submitted?: number
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
      kz_categories: {
        Row: {
          created_at: string
          id: string
          image: string | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image?: string | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kz_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "kz_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kz_product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          product_id: string
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          product_id: string
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "kz_product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "kz_products"
            referencedColumns: ["id"]
          },
        ]
      }
      kz_product_specs: {
        Row: {
          created_at: string
          id: string
          product_id: string
          sort_order: number
          spec_name: string
          spec_value: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          spec_name: string
          spec_value: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          spec_name?: string
          spec_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "kz_product_specs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "kz_products"
            referencedColumns: ["id"]
          },
        ]
      }
      kz_product_variants: {
        Row: {
          color: string | null
          compare_price: number | null
          created_at: string
          id: string
          is_default: boolean
          price: number
          processor: string | null
          product_id: string
          ram: string | null
          sku: string | null
          stock_qty: number
          storage: string | null
          updated_at: string
          variant_name: string | null
        }
        Insert: {
          color?: string | null
          compare_price?: number | null
          created_at?: string
          id?: string
          is_default?: boolean
          price?: number
          processor?: string | null
          product_id: string
          ram?: string | null
          sku?: string | null
          stock_qty?: number
          storage?: string | null
          updated_at?: string
          variant_name?: string | null
        }
        Update: {
          color?: string | null
          compare_price?: number | null
          created_at?: string
          id?: string
          is_default?: boolean
          price?: number
          processor?: string | null
          product_id?: string
          ram?: string | null
          sku?: string | null
          stock_qty?: number
          storage?: string | null
          updated_at?: string
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kz_product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "kz_products"
            referencedColumns: ["id"]
          },
        ]
      }
      kz_products: {
        Row: {
          brand: string | null
          category_id: string | null
          condition: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          product_type: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          product_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          condition?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          product_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kz_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kz_categories"
            referencedColumns: ["id"]
          },
        ]
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
      qr_campaigns: {
        Row: {
          created_at: string
          description_ar: string | null
          destination_path: string
          id: string
          is_active: boolean
          lead_count: number
          name_ar: string
          notes: string | null
          placement: string | null
          scan_count: number
          slug: string
          updated_at: string
          utm_campaign: string
          utm_content: string | null
          utm_medium: string
          utm_source: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          destination_path?: string
          id?: string
          is_active?: boolean
          lead_count?: number
          name_ar: string
          notes?: string | null
          placement?: string | null
          scan_count?: number
          slug: string
          updated_at?: string
          utm_campaign: string
          utm_content?: string | null
          utm_medium?: string
          utm_source?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          destination_path?: string
          id?: string
          is_active?: boolean
          lead_count?: number
          name_ar?: string
          notes?: string | null
          placement?: string | null
          scan_count?: number
          slug?: string
          updated_at?: string
          utm_campaign?: string
          utm_content?: string | null
          utm_medium?: string
          utm_source?: string
        }
        Relationships: []
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
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      social_merchant_sources: {
        Row: {
          account_label: string | null
          check_interval_minutes: number
          created_at: string
          handle: string | null
          id: string
          import_mode: string
          last_checked_at: string | null
          last_detected_at: string | null
          last_error: string | null
          last_success_at: string | null
          merchant_id: string
          monitoring_enabled: boolean
          page_url: string
          platform: string
          source_config: Json
          source_external_id: string | null
          updated_at: string
        }
        Insert: {
          account_label?: string | null
          check_interval_minutes?: number
          created_at?: string
          handle?: string | null
          id?: string
          import_mode?: string
          last_checked_at?: string | null
          last_detected_at?: string | null
          last_error?: string | null
          last_success_at?: string | null
          merchant_id: string
          monitoring_enabled?: boolean
          page_url: string
          platform: string
          source_config?: Json
          source_external_id?: string | null
          updated_at?: string
        }
        Update: {
          account_label?: string | null
          check_interval_minutes?: number
          created_at?: string
          handle?: string | null
          id?: string
          import_mode?: string
          last_checked_at?: string | null
          last_detected_at?: string | null
          last_error?: string | null
          last_success_at?: string | null
          merchant_id?: string
          monitoring_enabled?: boolean
          page_url?: string
          platform?: string
          source_config?: Json
          source_external_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_merchant_sources_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "social_monitored_merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      social_monitored_merchants: {
        Row: {
          admin_notes: string | null
          branch_context: string
          created_at: string
          display_name: string | null
          id: string
          keywords_ar: string[]
          keywords_en: string[]
          logo_url: string | null
          merchant_name: string
          monitoring_enabled: boolean
          monitoring_status: string
          opening_keywords: string[]
          opening_status: string | null
          store_id: string
          store_slug: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          branch_context?: string
          created_at?: string
          display_name?: string | null
          id?: string
          keywords_ar?: string[]
          keywords_en?: string[]
          logo_url?: string | null
          merchant_name: string
          monitoring_enabled?: boolean
          monitoring_status?: string
          opening_keywords?: string[]
          opening_status?: string | null
          store_id: string
          store_slug: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          branch_context?: string
          created_at?: string
          display_name?: string | null
          id?: string
          keywords_ar?: string[]
          keywords_en?: string[]
          logo_url?: string | null
          merchant_name?: string
          monitoring_enabled?: boolean
          monitoring_status?: string
          opening_keywords?: string[]
          opening_status?: string | null
          store_id?: string
          store_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_monitored_merchants_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      social_offer_activity_log: {
        Row: {
          action_label_ar: string | null
          action_type: string
          actor_user_id: string | null
          created_at: string
          id: string
          intake_id: string
          note: string | null
          payload: Json
        }
        Insert: {
          action_label_ar?: string | null
          action_type: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          intake_id: string
          note?: string | null
          payload?: Json
        }
        Update: {
          action_label_ar?: string | null
          action_type?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          intake_id?: string
          note?: string | null
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "social_offer_activity_log_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "social_offer_intake"
            referencedColumns: ["id"]
          },
        ]
      }
      social_offer_intake: {
        Row: {
          branch_context: string
          captured_at: string
          category: string | null
          content_type: string
          created_at: string
          curated_media_assets: Json
          currency: string
          current_price: number | null
          detected_at: string
          detected_keywords: string[]
          duplicate_of: string | null
          expires_at: string | null
          featured: boolean
          id: string
          media_assets: Json
          merchant_id: string
          notes: string | null
          offer_subtitle: string | null
          offer_title: string | null
          old_price: number | null
          opening_related: boolean
          publish_status: string
          published_at: string | null
          published_deal_id: string | null
          raw_payload: Json
          relevance_score: number
          relevance_status: string
          review_status: string
          short_specs: string | null
          source_caption: string | null
          source_capture_method: string
          source_id: string | null
          source_platform: string
          source_post_id: string | null
          source_post_url: string | null
          source_published_at: string | null
          source_thumbnail_url: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          branch_context?: string
          captured_at?: string
          category?: string | null
          content_type?: string
          created_at?: string
          curated_media_assets?: Json
          currency?: string
          current_price?: number | null
          detected_at?: string
          detected_keywords?: string[]
          duplicate_of?: string | null
          expires_at?: string | null
          featured?: boolean
          id?: string
          media_assets?: Json
          merchant_id: string
          notes?: string | null
          offer_subtitle?: string | null
          offer_title?: string | null
          old_price?: number | null
          opening_related?: boolean
          publish_status?: string
          published_at?: string | null
          published_deal_id?: string | null
          raw_payload?: Json
          relevance_score?: number
          relevance_status?: string
          review_status?: string
          short_specs?: string | null
          source_caption?: string | null
          source_capture_method?: string
          source_id?: string | null
          source_platform: string
          source_post_id?: string | null
          source_post_url?: string | null
          source_published_at?: string | null
          source_thumbnail_url?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          branch_context?: string
          captured_at?: string
          category?: string | null
          content_type?: string
          created_at?: string
          curated_media_assets?: Json
          currency?: string
          current_price?: number | null
          detected_at?: string
          detected_keywords?: string[]
          duplicate_of?: string | null
          expires_at?: string | null
          featured?: boolean
          id?: string
          media_assets?: Json
          merchant_id?: string
          notes?: string | null
          offer_subtitle?: string | null
          offer_title?: string | null
          old_price?: number | null
          opening_related?: boolean
          publish_status?: string
          published_at?: string | null
          published_deal_id?: string | null
          raw_payload?: Json
          relevance_score?: number
          relevance_status?: string
          review_status?: string
          short_specs?: string | null
          source_caption?: string | null
          source_capture_method?: string
          source_id?: string | null
          source_platform?: string
          source_post_id?: string | null
          source_post_url?: string | null
          source_published_at?: string | null
          source_thumbnail_url?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_offer_intake_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "social_offer_intake"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_offer_intake_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "social_monitored_merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_offer_intake_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "social_merchant_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_offer_intake_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      social_offer_notifications: {
        Row: {
          action_url: string | null
          body_ar: string | null
          created_at: string
          dismissed_at: string | null
          id: string
          intake_id: string
          merchant_id: string
          notification_type: string
          read_at: string | null
          thumbnail_url: string | null
          title_ar: string
          unread: boolean
        }
        Insert: {
          action_url?: string | null
          body_ar?: string | null
          created_at?: string
          dismissed_at?: string | null
          id?: string
          intake_id: string
          merchant_id: string
          notification_type?: string
          read_at?: string | null
          thumbnail_url?: string | null
          title_ar: string
          unread?: boolean
        }
        Update: {
          action_url?: string | null
          body_ar?: string | null
          created_at?: string
          dismissed_at?: string | null
          id?: string
          intake_id?: string
          merchant_id?: string
          notification_type?: string
          read_at?: string | null
          thumbnail_url?: string | null
          title_ar?: string
          unread?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "social_offer_notifications_intake_id_fkey"
            columns: ["intake_id"]
            isOneToOne: false
            referencedRelation: "social_offer_intake"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_offer_notifications_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "social_monitored_merchants"
            referencedColumns: ["id"]
          },
        ]
      }
      social_offer_settings: {
        Row: {
          admin_notes: string | null
          branch_context: string
          created_at: string
          detection_threshold: number
          global_keywords_ar: string[]
          global_keywords_en: string[]
          homepage_feature_limit: number
          id: string
          last_run_at: string | null
          last_run_error: string | null
          last_run_status: string | null
          monitoring_enabled: boolean
          schedule_cron: string
          schedule_secret: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          branch_context?: string
          created_at?: string
          detection_threshold?: number
          global_keywords_ar?: string[]
          global_keywords_en?: string[]
          homepage_feature_limit?: number
          id?: string
          last_run_at?: string | null
          last_run_error?: string | null
          last_run_status?: string | null
          monitoring_enabled?: boolean
          schedule_cron?: string
          schedule_secret?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          branch_context?: string
          created_at?: string
          detection_threshold?: number
          global_keywords_ar?: string[]
          global_keywords_en?: string[]
          homepage_feature_limit?: number
          id?: string
          last_run_at?: string | null
          last_run_error?: string | null
          last_run_status?: string | null
          monitoring_enabled?: boolean
          schedule_cron?: string
          schedule_secret?: string
          updated_at?: string
        }
        Relationships: []
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
      spin_history: {
        Row: {
          claim_code: string | null
          client_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_grand: boolean
          is_visitor: boolean
          prize_name_ar: string | null
          user_id: string
          won: boolean
        }
        Insert: {
          claim_code?: string | null
          client_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_grand?: boolean
          is_visitor?: boolean
          prize_name_ar?: string | null
          user_id: string
          won?: boolean
        }
        Update: {
          claim_code?: string | null
          client_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_grand?: boolean
          is_visitor?: boolean
          prize_name_ar?: string | null
          user_id?: string
          won?: boolean
        }
        Relationships: []
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
          prize_type: string | null
          qr_data: string | null
          redeemed_at: string | null
          redeemed_by: string | null
          spin_date: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_token: string | null
          visitor_verified: boolean
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
          prize_type?: string | null
          qr_data?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
          spin_date?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_token?: string | null
          visitor_verified?: boolean
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
          prize_type?: string | null
          qr_data?: string | null
          redeemed_at?: string | null
          redeemed_by?: string | null
          spin_date?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_token?: string | null
          visitor_verified?: boolean
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
      store_managers: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_managers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
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
          grand_probability: number
          id: string
          image_url: string | null
          is_active: boolean
          is_grand: boolean
          name_ar: string
          name_en: string | null
          prize_type: string
          probability_weight: number
          redemption_rules_ar: string | null
          redemption_rules_en: string | null
          remaining_stock: number
          total_quantity: number
          updated_at: string
          validity_days: number | null
          visitor_only: boolean
        }
        Insert: {
          active_from?: string | null
          active_to?: string | null
          category?: string | null
          competition_store_id: string
          created_at?: string
          grand_probability?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_grand?: boolean
          name_ar: string
          name_en?: string | null
          prize_type?: string
          probability_weight?: number
          redemption_rules_ar?: string | null
          redemption_rules_en?: string | null
          remaining_stock?: number
          total_quantity?: number
          updated_at?: string
          validity_days?: number | null
          visitor_only?: boolean
        }
        Update: {
          active_from?: string | null
          active_to?: string | null
          category?: string | null
          competition_store_id?: string
          created_at?: string
          grand_probability?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_grand?: boolean
          name_ar?: string
          name_en?: string | null
          prize_type?: string
          probability_weight?: number
          redemption_rules_ar?: string | null
          redemption_rules_en?: string | null
          remaining_stock?: number
          total_quantity?: number
          updated_at?: string
          validity_days?: number | null
          visitor_only?: boolean
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
          admin_notes: string | null
          branch_context: string | null
          category: string | null
          connector_enabled: boolean
          cover_image_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          external_store_handle: string | null
          external_store_type: string
          external_store_url: string | null
          featured: boolean
          floor_id: string | null
          floor_label: string | null
          gallery: Json | null
          hotline: string | null
          id: string
          import_offers: boolean
          import_products: boolean
          is_opening_participant: boolean
          last_sync_at: string | null
          last_sync_error: string | null
          last_sync_result: string | null
          lifecycle_status: string
          logo_url: string | null
          long_description_ar: string | null
          long_description_en: string | null
          map_area_id: string | null
          map_x: number | null
          map_y: number | null
          name_ar: string
          name_en: string | null
          opening_hours: string | null
          opening_status: string | null
          pending_verification: boolean
          phone: string | null
          short_description_ar: string | null
          short_description_en: string | null
          slug: string
          status: string
          sync_log: Json
          sync_mode: string
          sync_notes: string | null
          sync_status: string
          unit_code: string | null
          unit_label: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          admin_notes?: string | null
          branch_context?: string | null
          category?: string | null
          connector_enabled?: boolean
          cover_image_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          external_store_handle?: string | null
          external_store_type?: string
          external_store_url?: string | null
          featured?: boolean
          floor_id?: string | null
          floor_label?: string | null
          gallery?: Json | null
          hotline?: string | null
          id?: string
          import_offers?: boolean
          import_products?: boolean
          is_opening_participant?: boolean
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_result?: string | null
          lifecycle_status?: string
          logo_url?: string | null
          long_description_ar?: string | null
          long_description_en?: string | null
          map_area_id?: string | null
          map_x?: number | null
          map_y?: number | null
          name_ar: string
          name_en?: string | null
          opening_hours?: string | null
          opening_status?: string | null
          pending_verification?: boolean
          phone?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          slug: string
          status?: string
          sync_log?: Json
          sync_mode?: string
          sync_notes?: string | null
          sync_status?: string
          unit_code?: string | null
          unit_label?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          admin_notes?: string | null
          branch_context?: string | null
          category?: string | null
          connector_enabled?: boolean
          cover_image_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          external_store_handle?: string | null
          external_store_type?: string
          external_store_url?: string | null
          featured?: boolean
          floor_id?: string | null
          floor_label?: string | null
          gallery?: Json | null
          hotline?: string | null
          id?: string
          import_offers?: boolean
          import_products?: boolean
          is_opening_participant?: boolean
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_result?: string | null
          lifecycle_status?: string
          logo_url?: string | null
          long_description_ar?: string | null
          long_description_en?: string | null
          map_area_id?: string | null
          map_x?: number | null
          map_y?: number | null
          name_ar?: string
          name_en?: string | null
          opening_hours?: string | null
          opening_status?: string | null
          pending_verification?: boolean
          phone?: string | null
          short_description_ar?: string | null
          short_description_en?: string | null
          slug?: string
          status?: string
          sync_log?: Json
          sync_mode?: string
          sync_notes?: string | null
          sync_status?: string
          unit_code?: string | null
          unit_label?: string | null
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
          media_url: string | null
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
          media_url?: string | null
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
          media_url?: string | null
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
      visitor_verifications: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          issued_by: string | null
          max_uses: number | null
          method: string
          notes: string | null
          token: string
          updated_at: string
          used_count: number
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          issued_by?: string | null
          max_uses?: number | null
          method?: string
          notes?: string | null
          token: string
          updated_at?: string
          used_count?: number
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          issued_by?: string | null
          max_uses?: number | null
          method?: string
          notes?: string | null
          token?: string
          updated_at?: string
          used_count?: number
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_browse_table: {
        Args: { p_limit?: number; p_table: string }
        Returns: Json
      }
      admin_list_columns: {
        Args: { p_table: string }
        Returns: {
          column_default: string
          column_name: string
          data_type: string
          is_nullable: string
        }[]
      }
      admin_list_policies: {
        Args: { p_table: string }
        Returns: {
          cmd: string
          policy_name: string
          qual: string
          roles: string[]
          with_check: string
        }[]
      }
      admin_list_tables: {
        Args: never
        Returns: {
          has_rls: boolean
          row_count: number
          table_name: string
        }[]
      }
      can_manage_content: { Args: { _user_id: string }; Returns: boolean }
      can_review: { Args: { _user_id: string }; Returns: boolean }
      decrement_prize_stock: { Args: { p_prize_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_store_manager: { Args: { _user_id: string }; Returns: boolean }
      manager_store_ids: { Args: { _user_id: string }; Returns: string[] }
      manages_store: {
        Args: { _store_id: string; _user_id: string }
        Returns: boolean
      }
      notify_indexing_ping: { Args: { _urls: Json }; Returns: undefined }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "editor"
        | "reviewer"
        | "store_manager"
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
      app_role: [
        "admin",
        "moderator",
        "user",
        "editor",
        "reviewer",
        "store_manager",
      ],
    },
  },
} as const
