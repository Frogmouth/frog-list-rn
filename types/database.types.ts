export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: number
          is_default: boolean | null
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_default?: boolean | null
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_default?: boolean | null
          name?: string | null
        }
        Relationships: []
      }
      list_items: {
        Row: {
          attributes: Json | null
          created_at: string
          id: number
          is_dropped: boolean
          is_picked: boolean
          is_purchesed: boolean
          list: number
          product: number
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          created_at?: string
          id?: number
          is_dropped?: boolean
          is_picked?: boolean
          is_purchesed?: boolean
          list: number
          product: number
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          created_at?: string
          id?: number
          is_dropped?: boolean
          is_picked?: boolean
          is_purchesed?: boolean
          list?: number
          product?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "list_items_list_fkey"
            columns: ["list"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_items_product_fkey"
            columns: ["product"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          closed_at: string | null
          created_at: string
          id: number
          is_default: boolean
          is_deleted: boolean
          is_shopping: boolean | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          id?: number
          is_default?: boolean
          is_deleted?: boolean
          is_shopping?: boolean | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          id?: number
          is_default?: boolean
          is_deleted?: boolean
          is_shopping?: boolean | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: number | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          category?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          category?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "categories"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
