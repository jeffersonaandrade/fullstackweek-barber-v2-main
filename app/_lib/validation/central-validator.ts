import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { createClient } from '@supabase/supabase-js'
import { ServiceSchema, BarbershopSchema } from './schemas'

export interface ValidationContext {
  userId?: string
  userRole?: string
  barbershopId?: string
  serviceId?: string
}

export interface ValidationResult {
  success: boolean
  data?: any
  error?: string
  context?: ValidationContext
}

export class CentralValidator {
  private static supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  private static instance: CentralValidator
  private validationCache = new Map<string, ValidationResult>()

  static getInstance(): CentralValidator {
    if (!CentralValidator.instance) {
      CentralValidator.instance = new CentralValidator()
    }
    return CentralValidator.instance
  }

  // Validação de autenticação
  static async validateAuth(): Promise<ValidationResult> {
    try {
      const session = await getServerSession(authOptions)
      
      if (!session?.user) {
        return {
          success: false,
          error: 'Unauthorized - User not authenticated'
        }
      }

      return {
        success: true,
        context: {
          userId: session.user.id,
          userRole: session.user.role
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Authentication validation failed'
      }
    }
  }

  // Validação de propriedade (ownership)
  static async validateOwnership(
    barbershopId: string, 
    userId: string
  ): Promise<ValidationResult> {
    try {
      const { data: barbershop } = await this.supabase
        .from('barbershops')
        .select('id, owner_id')
        .eq('id', barbershopId)
        .single()

      if (!barbershop || barbershop.owner_id !== userId) {
        return {
          success: false,
          error: 'Forbidden - User does not own this resource'
        }
      }

      return {
        success: true,
        context: { barbershopId }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Ownership validation failed'
      }
    }
  }

  // Validação de dados com Zod
  static validateData<T>(
    schema: z.ZodSchema<T>, 
    data: any
  ): ValidationResult {
    try {
      const validatedData = schema.parse(data)
      return {
        success: true,
        data: validatedData
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: `Validation failed: ${error.errors.map(e => e.message).join(', ')}`
        }
      }
      return {
        success: false,
        error: 'Data validation failed'
      }
    }
  }

  // Validação completa para endpoints
  static async validateEndpoint<T>({
    requireAuth = true,
    requireOwnership = false,
    barbershopId,
    schema,
    data
  }: {
    requireAuth?: boolean
    requireOwnership?: boolean
    barbershopId?: string
    schema?: z.ZodSchema<T>
    data?: any
  }): Promise<ValidationResult> {
    const context: ValidationContext = {}

    // 1. Validação de autenticação
    if (requireAuth) {
      const authResult = await this.validateAuth()
      if (!authResult.success) {
        return authResult
      }
      Object.assign(context, authResult.context)
    }

    // 2. Validação de propriedade
    if (requireOwnership && barbershopId && context.userId) {
      const ownershipResult = await this.validateOwnership(barbershopId, context.userId)
      if (!ownershipResult.success) {
        return ownershipResult
      }
      Object.assign(context, ownershipResult.context)
    }

    // 3. Validação de dados
    if (schema && data) {
      const dataResult = this.validateData(schema, data)
      if (!dataResult.success) {
        return dataResult
      }
      return {
        success: true,
        data: dataResult.data,
        context
      }
    }

    return {
      success: true,
      context
    }
  }

  // Métodos de instância para cache (mantidos para compatibilidade)
  async validateService(data: any): Promise<ValidationResult> {
    const cacheKey = `service_${JSON.stringify(data)}`
    
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!
    }

    try {
      const validatedData = ServiceSchema.parse(data)
      const result = { success: true, data: validatedData }
      this.validationCache.set(cacheKey, result)
      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        const result = { success: false, error: errors.join(', ') }
        this.validationCache.set(cacheKey, result)
        return result
      }
      return { success: false, error: 'Erro interno de validação' }
    }
  }

  async validateBarbershop(data: any): Promise<ValidationResult> {
    const cacheKey = `barbershop_${JSON.stringify(data)}`
    
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!
    }

    try {
      const validatedData = BarbershopSchema.parse(data)
      const result = { success: true, data: validatedData }
      this.validationCache.set(cacheKey, result)
      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        const result = { success: false, error: errors.join(', ') }
        this.validationCache.set(cacheKey, result)
        return result
      }
      return { success: false, error: 'Erro interno de validação' }
    }
  }

  async validateRateLimit(identifier: string): Promise<ValidationResult> {
    // Implementação com Redis ou cache em memória
    // Por enquanto, retorna sucesso
    return { success: true }
  }

  clearCache(): void {
    this.validationCache.clear()
  }
} 