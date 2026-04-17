export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          images: string[] | null
          location: string | null
          price: number
          title: string
          user_id: string
          seller_phone: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location?: string | null
          price: number
          title: string
          user_id: string
          seller_phone?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          location?: string | null
          price?: number
          title?: string
          user_id?: string
          seller_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          created_at: string | null
          product_id: string
          buyer_id: string | null
          buyer_name: string
          buyer_address: string
          buyer_phone: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string | null
          product_id: string
          buyer_id?: string | null
          buyer_name: string
          buyer_address: string
          buyer_phone: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string | null
          product_id?: string
          buyer_id?: string | null
          buyer_name?: string
          buyer_address?: string
          buyer_phone?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}