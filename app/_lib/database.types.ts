export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          password: string | null
          role: 'client' | 'barber' | 'receptionist' | 'admin'
          barbershop_id: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          password?: string | null
          role?: 'client' | 'barber' | 'receptionist' | 'admin'
          barbershop_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          password?: string | null
          role?: 'client' | 'barber' | 'receptionist' | 'admin'
          barbershop_id?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          }
        ]
      }
      barbershops: {
        Row: {
          id: string
          name: string
          address: string | null
          phones: string | null
          description: string | null
          image_url: string | null
          is_active: boolean
          admin_id: string | null
          commission_rate: number | null
          timeout_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phones?: string | null
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          admin_id?: string | null
          commission_rate?: number | null
          timeout_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phones?: string | null
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          admin_id?: string | null
          commission_rate?: number | null
          timeout_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barbershops_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      queues: {
        Row: {
          id: string
          barbershop_id: string
          name: string
          description: string | null
          queue_type: 'general' | 'specific'
          is_active: boolean
          max_capacity: number | null
          current_position: number
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          name?: string
          description?: string | null
          queue_type?: 'general' | 'specific'
          is_active?: boolean
          max_capacity?: number | null
          current_position?: number
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          name?: string
          description?: string | null
          queue_type?: 'general' | 'specific'
          is_active?: boolean
          max_capacity?: number | null
          current_position?: number
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "queues_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queues_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      queue_entries: {
        Row: {
          id: string
          queue_id: string
          user_id: string | null
          position: number
          status: 'waiting' | 'called' | 'in_service' | 'completed' | 'left' | 'timeout'
          estimated_time: number | null
          selected_barber_id: string | null
          customer_name: string | null
          customer_phone: string | null
          is_guest: boolean
          parent_phone: string | null
          joined_at: string
          left_at: string | null
          called_at: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          queue_id: string
          user_id?: string | null
          position: number
          status?: 'waiting' | 'called' | 'in_service' | 'completed' | 'left' | 'timeout'
          estimated_time?: number | null
          selected_barber_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          is_guest?: boolean
          parent_phone?: string | null
          joined_at?: string
          left_at?: string | null
          called_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          queue_id?: string
          user_id?: string | null
          position?: number
          status?: 'waiting' | 'called' | 'in_service' | 'completed' | 'left' | 'timeout'
          estimated_time?: number | null
          selected_barber_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          is_guest?: boolean
          parent_phone?: string | null
          joined_at?: string
          left_at?: string | null
          called_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_entries_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_entries_selected_barber_id_fkey"
            columns: ["selected_barber_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      barber_status: {
        Row: {
          id: string
          barber_id: string
          barbershop_id: string
          is_active: boolean
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barber_id: string
          barbershop_id: string
          is_active?: boolean
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barber_id?: string
          barbershop_id?: string
          is_active?: boolean
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_status_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "barber_status_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          queue_entry_id: string
          barber_id: string
          amount: number
          commission_rate: number
          commission_amount: number
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix'
          created_at: string
        }
        Insert: {
          id?: string
          queue_entry_id: string
          barber_id: string
          amount: number
          commission_rate: number
          commission_amount: number
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix'
          created_at?: string
        }
        Update: {
          id?: string
          queue_entry_id?: string
          barber_id?: string
          amount?: number
          commission_rate?: number
          commission_amount?: number
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_queue_entry_id_fkey"
            columns: ["queue_entry_id"]
            isOneToOne: false
            referencedRelation: "queue_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string | null
          barber_id: string
          barbershop_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          barber_id: string
          barbershop_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          barber_id?: string
          barbershop_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_barbershop_id_fkey"
            columns: ["barbershop_id"]
            isOneToOne: false
            referencedRelation: "barbershops"
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