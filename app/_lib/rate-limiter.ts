import { AuditLogger } from './audit-logger'

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  message?: string
}

export interface RateLimitEntry {
  count: number
  resetTime: number
}

// Configurações de rate limiting otimizadas para melhor experiência do usuário
export const RATE_LIMIT_CONFIGS = {
  PUBLIC: {
    maxRequests: 1000, // 1000 requests por janela (mais permissivo para páginas públicas)
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Muitas requisições. Tente novamente em alguns minutos.'
  },
  AUTHENTICATED: {
    maxRequests: 500, // 500 requests por janela
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Limite de requisições excedido. Tente novamente em alguns minutos.'
  },
  ADMIN: {
    maxRequests: 1000, // 1000 requests por janela
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Limite de requisições administrativas excedido.'
  },
  UPLOAD: {
    maxRequests: 20, // 20 uploads por janela
    windowMs: 60 * 60 * 1000, // 1 hora
    message: 'Limite de uploads excedido. Tente novamente em uma hora.'
  },
  AUTH: {
    maxRequests: 10, // 10 tentativas de login por janela
    windowMs: 15 * 60 * 1000, // 15 minutos
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  }
} as const

export class RateLimiter {
  private static instance: RateLimiter
  private cache: Map<string, RateLimitEntry> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  private constructor() {
    // Limpar cache a cada 30 minutos para evitar vazamento de memória
    this.cleanupInterval = setInterval(() => {
      this.cleanupCache()
    }, 30 * 60 * 1000)
  }

  public static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  private cleanupCache(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.resetTime) {
        this.cache.delete(key)
      }
    }
  }

  public checkRateLimit(
    key: string,
    config: RateLimitConfig
  ): RateLimitResult {
    const now = Date.now()
    const entry = this.cache.get(key)

    if (!entry || now > entry.resetTime) {
      // Primeira requisição ou janela expirada
      this.cache.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      })

      return {
        success: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }

    if (entry.count >= config.maxRequests) {
      // Limite excedido
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
        message: config.message
      }
    }

    // Incrementar contador
    entry.count++
    this.cache.set(key, entry)

    return {
      success: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    }
  }

  public async checkRateLimitWithUser(
    userId: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `user:${userId}`
    const result = this.checkRateLimit(key, config)

    if (!result.success) {
      // Log de auditoria para rate limit excedido
      const auditLogger = AuditLogger.getInstance()
      await auditLogger.logSecurityEvent(
        userId,
        'RATE_LIMIT_EXCEEDED',
        {
          limitType: 'USER',
          maxRequests: config.maxRequests,
          windowMs: config.windowMs,
          resetTime: result.resetTime
        },
        'Rate limit exceeded by user'
      )
    }

    return result
  }

  public async checkRateLimitWithIP(
    ip: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `ip:${ip}`
    const result = this.checkRateLimit(key, config)

    if (!result.success) {
      // Log de auditoria para rate limit excedido por IP
      const auditLogger = AuditLogger.getInstance()
      await auditLogger.logSecurityEvent(
        null,
        'RATE_LIMIT_EXCEEDED',
        {
          limitType: 'IP',
          ip,
          maxRequests: config.maxRequests,
          windowMs: config.windowMs,
          resetTime: result.resetTime
        },
        'Rate limit exceeded by IP address'
      )
    }

    return result
  }

  public clearCache(): void {
    this.cache.clear()
  }

  public getCacheStats(): { size: number; entries: Array<{ key: string; entry: RateLimitEntry }> } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({ key, entry }))
    }
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cache.clear()
  }
} 