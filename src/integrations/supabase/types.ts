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
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          category: string
          created_at: string
          currency: string
          id: string
          period: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          currency?: string
          id?: string
          period?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          currency?: string
          id?: string
          period?: string
          user_id?: string
        }
        Relationships: []
      }
      business_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          id: string
          notes: string | null
          title: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          title: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          last_order_date: string | null
          name: string
          notes: string | null
          phone: string | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          last_order_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          last_order_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      goal_collaborators: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_collaborators_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_invitations: {
        Row: {
          created_at: string
          expires_at: string
          goal_id: string
          id: string
          invitee_id: string
          inviter_id: string
          status: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          goal_id: string
          id?: string
          invitee_id: string
          inviter_id: string
          status: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          goal_id?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_invitations_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "savings_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_reminders: {
        Row: {
          created_at: string | null
          id: string
          invoice_id: string
          is_sent: boolean | null
          message: string | null
          reminder_date: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invoice_id: string
          is_sent?: boolean | null
          message?: string | null
          reminder_date: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invoice_id?: string
          is_sent?: boolean | null
          message?: string | null
          reminder_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          customer_id: string
          discount: number
          id: string
          invoice_number: string
          items: Json
          notes: string | null
          payment_due_date: string
          payment_method: string | null
          payment_proof_url: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          discount?: number
          id?: string
          invoice_number: string
          items?: Json
          notes?: string | null
          payment_due_date: string
          payment_method?: string | null
          payment_proof_url?: string | null
          status?: string
          subtotal: number
          tax?: number
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          discount?: number
          id?: string
          invoice_number?: string
          items?: Json
          notes?: string | null
          payment_due_date?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_data: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_data?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          action_data?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          order_date: string
          payment_method: string
          payment_proof_url: string | null
          pos_transaction_id: string | null
          products: Json
          status: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          order_date?: string
          payment_method: string
          payment_proof_url?: string | null
          pos_transaction_id?: string | null
          products?: Json
          status?: string
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          order_date?: string
          payment_method?: string
          payment_proof_url?: string | null
          pos_transaction_id?: string | null
          products?: Json
          status?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_pos_transaction_id_fkey"
            columns: ["pos_transaction_id"]
            isOneToOne: false
            referencedRelation: "pos_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_records: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          payment_method: string | null
          reference_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_method?: string | null
          reference_id: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          payment_method?: string | null
          reference_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pos_transactions: {
        Row: {
          created_at: string
          id: string
          metode_pembayaran: string
          nama_pembeli: string | null
          produk: Json
          total: number
          user_id: string
          waktu_transaksi: string
        }
        Insert: {
          created_at?: string
          id?: string
          metode_pembayaran: string
          nama_pembeli?: string | null
          produk?: Json
          total: number
          user_id: string
          waktu_transaksi?: string
        }
        Update: {
          created_at?: string
          id?: string
          metode_pembayaran?: string
          nama_pembeli?: string | null
          produk?: Json
          total?: number
          user_id?: string
          waktu_transaksi?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          cost: number
          created_at: string
          id: string
          image_url: string | null
          is_best_seller: boolean
          name: string
          price: number
          status: boolean
          stock: number
          type: string
          user_id: string
        }
        Insert: {
          category: string
          cost: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_best_seller?: boolean
          name: string
          price: number
          status?: boolean
          stock?: number
          type: string
          user_id: string
        }
        Update: {
          category?: string
          cost?: number
          created_at?: string
          id?: string
          image_url?: string | null
          is_best_seller?: boolean
          name?: string
          price?: number
          status?: boolean
          stock?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          entrepreneur_onboarding_completed: boolean
          full_name: string
          id: string
          onboarding_completed: boolean
          role: Database["public"]["Enums"]["user_role"]
          subscription_expiry: string | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          entrepreneur_onboarding_completed?: boolean
          full_name: string
          id: string
          onboarding_completed?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          subscription_expiry?: string | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          entrepreneur_onboarding_completed?: boolean
          full_name?: string
          id?: string
          onboarding_completed?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          subscription_expiry?: string | null
          subscription_id?: string | null
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          currency: string
          emoji: string | null
          has_collaborators: boolean | null
          id: string
          saved_amount: number
          target_amount: number
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          currency?: string
          emoji?: string | null
          has_collaborators?: boolean | null
          id?: string
          saved_amount?: number
          target_amount: number
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          currency?: string
          emoji?: string | null
          has_collaborators?: boolean | null
          id?: string
          saved_amount?: number
          target_amount?: number
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          currency: string
          date: string
          description: string | null
          id: string
          is_business: boolean
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          currency?: string
          date?: string
          description?: string | null
          id?: string
          is_business?: boolean
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          currency?: string
          date?: string
          description?: string | null
          id?: string
          is_business?: boolean
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          business_name: string | null
          created_at: string
          custom_settings: Json | null
          id: string
          invoice_logo_url: string | null
          preferred_currency: string
          preferred_language: string
          show_invoice_logo: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          custom_settings?: Json | null
          id?: string
          invoice_logo_url?: string | null
          preferred_currency?: string
          preferred_language?: string
          show_invoice_logo?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          custom_settings?: Json | null
          id?: string
          invoice_logo_url?: string | null
          preferred_currency?: string
          preferred_language?: string
          show_invoice_logo?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_assign_admin_role: {
        Args: { _target_user_id: string }
        Returns: boolean
      }
      admin_create_user: {
        Args: {
          _email: string
          _password: string
          _full_name: string
          _role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: string
      }
      admin_delete_user: {
        Args: { _user_id: string }
        Returns: boolean
      }
      admin_send_notification: {
        Args: {
          _title: string
          _message: string
          _type?: string
          _user_id?: string
        }
        Returns: number
      }
      admin_update_user: {
        Args: {
          _user_id: string
          _full_name?: string
          _role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      check_user_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      create_activity_log: {
        Args: {
          _user_id: string
          _action: string
          _entity_type?: string
          _entity_id?: string
        }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      validate_json_array: {
        Args: { _json_data: Json; _required_fields: string[] }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "free" | "premium" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["free", "premium", "admin"],
    },
  },
} as const
