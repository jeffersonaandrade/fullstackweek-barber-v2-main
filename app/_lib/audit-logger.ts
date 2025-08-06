import { supabaseAdmin } from './supabase'

export interface AuditLogEntry {
  id?: string
  user_id?: string | null
  user_email?: string | null
  action: string
  resource_type?: string
  resource_id?: string
  details?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at?: string
}

// Ações de auditoria mais específicas e menos verbosas
export const AUDIT_ACTIONS = {
  // Ações de usuário importantes
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  
  // Ações administrativas críticas
  ADMIN_ACCESS: 'ADMIN_ACCESS',
  BARBERSHOP_CREATED: 'BARBERSHOP_CREATED',
  BARBERSHOP_UPDATED: 'BARBERSHOP_UPDATED',
  BARBERSHOP_DELETED: 'BARBERSHOP_DELETED',
  
  // Ações de segurança
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  
  // Ações de negócio importantes
  BOOKING_CREATED: 'BOOKING_CREATED',
  BOOKING_CANCELLED: 'BOOKING_CANCELLED',
  PAYMENT_PROCESSED: 'PAYMENT_PROCESSED'
} as const

export const RESOURCE_TYPES = {
  USER: 'user',
  BARBERSHOP: 'barbershop',
  SERVICE: 'service',
  BOOKING: 'booking',
  PAYMENT: 'payment',
  SECURITY: 'security'
} as const

// Configuração para controlar o volume de logs
const AUDIT_CONFIG = {
  // Log apenas eventos críticos por padrão
  LOG_LEVEL: process.env.AUDIT_LOG_LEVEL || 'CRITICAL', // CRITICAL, IMPORTANT, ALL
  MAX_LOGS_PER_HOUR: 100, // Limite de logs por hora
  CLEANUP_DAYS: 30, // Manter logs por apenas 30 dias
  BATCH_SIZE: 10 // Processar logs em lotes
}

export class AuditLogger {
  private static instance: AuditLogger
  private logCount = 0
  private lastReset = Date.now()
  private logQueue: AuditLogEntry[] = []
  private processingQueue = false

  private constructor() {
    // Reset contador a cada hora
    setInterval(() => {
      this.logCount = 0
      this.lastReset = Date.now()
    }, 60 * 60 * 1000)
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  private shouldLog(action: string): boolean {
    // Verificar limite por hora
    if (this.logCount >= AUDIT_CONFIG.MAX_LOGS_PER_HOUR) {
      console.warn('Audit log limit reached for this hour')
      return false
    }

    // Filtrar por nível de log
    switch (AUDIT_CONFIG.LOG_LEVEL) {
      case 'CRITICAL':
        return [
          AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
          AUDIT_ACTIONS.SUSPICIOUS_ACTIVITY,
          AUDIT_ACTIONS.ADMIN_ACCESS,
          AUDIT_ACTIONS.BARBERSHOP_DELETED,
          AUDIT_ACTIONS.PAYMENT_PROCESSED
        ].includes(action as any)
      
      case 'IMPORTANT':
        return [
          AUDIT_ACTIONS.USER_LOGIN,
          AUDIT_ACTIONS.USER_REGISTER,
          AUDIT_ACTIONS.BARBERSHOP_CREATED,
          AUDIT_ACTIONS.BARBERSHOP_UPDATED,
          AUDIT_ACTIONS.BOOKING_CREATED,
          AUDIT_ACTIONS.RATE_LIMIT_EXCEEDED
        ].includes(action as any) || this.shouldLog(action)
      
      case 'ALL':
        return true
      
      default:
        return false
    }
  }

  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.logQueue.length === 0) return

    this.processingQueue = true

    try {
      const batch = this.logQueue.splice(0, AUDIT_CONFIG.BATCH_SIZE)
      
      if (batch.length > 0) {
        const { error } = await supabaseAdmin
          .from('audit_logs')
          .insert(batch)

        if (error) {
          console.error('Erro ao inserir logs de auditoria:', error)
          // Recolocar logs na fila em caso de erro
          this.logQueue.unshift(...batch)
        }
      }
    } catch (error) {
      console.error('Erro ao processar fila de logs:', error)
    } finally {
      this.processingQueue = false
      
      // Processar próximo lote se houver mais logs
      if (this.logQueue.length > 0) {
        setTimeout(() => this.processQueue(), 1000)
      }
    }
  }

  public async log(entry: AuditLogEntry): Promise<void> {
    if (!this.shouldLog(entry.action)) {
      return
    }

    this.logCount++
    
    const logEntry: AuditLogEntry = {
      ...entry,
      created_at: new Date().toISOString()
    }

    this.logQueue.push(logEntry)
    this.processQueue()
  }

  public async logUserAction(
    userId: string | null,
    userEmail: string | null,
    action: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      user_id: userId,
      user_email: userEmail,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    })
  }

  public async logSecurityEvent(
    userId: string | null,
    action: string,
    details?: Record<string, any>,
    description?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await this.log({
      user_id: userId,
      action,
      resource_type: RESOURCE_TYPES.SECURITY,
      details: {
        ...details,
        description
      },
      ip_address: ipAddress,
      user_agent: userAgent
    })
  }

  public async getAuditLogs(
    filters: {
      userId?: string
      action?: string
      resourceType?: string
      startDate?: string
      endDate?: string
      limit?: number
    } = {}
  ): Promise<{ data: AuditLogEntry[] | null; error: any }> {
    let query = supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters.action) {
      query = query.eq('action', filters.action)
    }

    if (filters.resourceType) {
      query = query.eq('resource_type', filters.resourceType)
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    } else {
      query = query.limit(100) // Limite padrão
    }

    return await query
  }

  public async cleanupOldLogs(): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - AUDIT_CONFIG.CLEANUP_DAYS)

    const { error } = await supabaseAdmin
      .from('audit_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())

    if (error) {
      console.error('Erro ao limpar logs antigos:', error)
    } else {
      console.log(`Logs antigos removidos (mais de ${AUDIT_CONFIG.CLEANUP_DAYS} dias)`)
    }
  }

  public getStats(): {
    logCount: number
    queueLength: number
    config: typeof AUDIT_CONFIG
  } {
    return {
      logCount: this.logCount,
      queueLength: this.logQueue.length,
      config: AUDIT_CONFIG
    }
  }
} 