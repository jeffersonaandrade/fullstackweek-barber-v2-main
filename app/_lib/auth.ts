import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from "./supabase"
import bcrypt from "bcryptjs"

export interface User {
  id: string
  name: string
  email: string
  role: 'client' | 'barber' | 'receptionist' | 'admin'
  barbershop_id?: string
  phone?: string
}

declare module "next-auth" {
  interface Session {
    user: User
  }
  
  interface User {
    id: string
    name: string
    email: string
    role: 'client' | 'barber' | 'receptionist' | 'admin'
    barbershop_id?: string
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    barbershop_id?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Buscar usuário no Supabase
          const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single()

          if (error || !user) {
            console.error('Usuário não encontrado:', error)
            return null
          }

          // Verificar senha
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            console.error('Senha inválida')
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            barbershop_id: user.barbershop_id,
            phone: user.phone
          }
        } catch (error) {
          console.error('Erro na autenticação:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.barbershop_id = user.barbershop_id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as 'client' | 'barber' | 'receptionist' | 'admin'
        session.user.barbershop_id = token.barbershop_id
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  secret: process.env.NEXTAUTH_SECRET
}

// Função para criar hash de senha
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Função para verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Função para criar usuário
export async function createUser(userData: {
  name: string
  email: string
  password: string
  role: 'client' | 'barber' | 'receptionist' | 'admin'
  barbershop_id?: string
  phone?: string
}) {
  try {
    const hashedPassword = await hashPassword(userData.password)
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        barbershop_id: userData.barbershop_id,
        phone: userData.phone
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
