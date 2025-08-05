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
          created_at?: string
          updated_at?: string
        }
      }
      dependents: {
        Row: {
          id: string
          user_id: string
          name: string
          relationship: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          relationship: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          relationship?: string
          created_at?: string
          updated_at?: string
        }
      }
      barbershops: {
        Row: {
          id: string
          name: string
          address: string | null
          phones: string[] | null
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
          phones?: string[] | null
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
          phones?: string[] | null
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          admin_id?: string | null
          commission_rate?: number | null
          timeout_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      barbershop_services: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          price: number
          barbershop_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          price: number
          barbershop_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          price?: number
          barbershop_id?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_id: string
          date: string
          status: 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_id: string
          date: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_id?: string
          date?: string
          status?: 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
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
          current_position: number | null
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          name: string
          description?: string | null
          queue_type?: 'general' | 'specific'
          is_active?: boolean
          max_capacity?: number | null
          current_position?: number | null
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
          current_position?: number | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
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
        }
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
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix'
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
        }
        Insert: {
          id?: string
          barber_id: string
          barbershop_id: string
          is_active?: boolean
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          barber_id?: string
          barbershop_id?: string
          is_active?: boolean
          started_at?: string
          ended_at?: string | null
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          barber_id: string
          barbershop_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          barber_id: string
          barbershop_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          barber_id?: string
          barbershop_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          barbershop_id: string
          name: string
          description: string | null
          price: number
          cost_price: number
          stock_quantity: number
          min_stock: number
          category: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          name: string
          description?: string | null
          price: number
          cost_price: number
          stock_quantity?: number
          min_stock?: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          name?: string
          description?: string | null
          price?: number
          cost_price?: number
          stock_quantity?: number
          min_stock?: number
          category?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_sales: {
        Row: {
          id: string
          barbershop_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          seller_id: string
          customer_name: string | null
          customer_phone: string | null
          payment_method: 'cash' | 'credit_card' | 'debit_card' | 'pix'
          created_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          seller_id: string
          customer_name?: string | null
          customer_phone?: string | null
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix'
          created_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          seller_id?: string
          customer_name?: string | null
          customer_phone?: string | null
          payment_method?: 'cash' | 'credit_card' | 'debit_card' | 'pix'
          created_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          barbershop_id: string
          product_id: string
          movement_type: 'in' | 'out' | 'adjustment'
          quantity: number
          previous_stock: number
          new_stock: number
          reason: string | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          product_id: string
          movement_type?: 'in' | 'out' | 'adjustment'
          quantity: number
          previous_stock: number
          new_stock: number
          reason?: string | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          product_id?: string
          movement_type?: 'in' | 'out' | 'adjustment'
          quantity?: number
          previous_stock?: number
          new_stock?: number
          reason?: string | null
          user_id?: string | null
          created_at?: string
        }
      }
      whatsapp_configs: {
        Row: {
          id: string
          barbershop_id: string
          device_name: string
          is_connected: boolean
          last_connection: string | null
          qr_code: string | null
          session_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          device_name: string
          is_connected?: boolean
          last_connection?: string | null
          qr_code?: string | null
          session_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          device_name?: string
          is_connected?: boolean
          last_connection?: string | null
          qr_code?: string | null
          session_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      cash_flow: {
        Row: {
          id: string
          barbershop_id: string
          type: 'income' | 'expense'
          category: 'service' | 'product' | 'commission' | 'expense' | 'other'
          amount: number
          description: string | null
          reference_id: string | null
          reference_type: string | null
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          barbershop_id: string
          type?: 'income' | 'expense'
          category?: 'service' | 'product' | 'commission' | 'expense' | 'other'
          amount: number
          description?: string | null
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          barbershop_id?: string
          type?: 'income' | 'expense'
          category?: 'service' | 'product' | 'commission' | 'expense' | 'other'
          amount?: number
          description?: string | null
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string | null
          created_at?: string
        }
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
  }
} 