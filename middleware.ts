import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { RateLimiter, RATE_LIMIT_CONFIGS } from './app/_lib/rate-limiter'
import { AuditLogger, AUDIT_ACTIONS } from './app/_lib/audit-logger'

// Inicializar instâncias
const rateLimiter = RateLimiter.getInstance()
const auditLogger = AuditLogger.getInstance()

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  // Excluir páginas estáticas e assets do rate limiting
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') || 
      pathname.startsWith('/public/') ||
      pathname.includes('.') || // Arquivos com extensão
      pathname === '/') { // Página inicial
    return NextResponse.next()
  }

  // Rate limiting APENAS para rotas de API e páginas dinâmicas
  if (pathname.startsWith('/api/')) {
    let rateLimitConfig = RATE_LIMIT_CONFIGS.PUBLIC

    if (pathname.startsWith('/api/admin')) {
      rateLimitConfig = RATE_LIMIT_CONFIGS.ADMIN
    } else if (pathname.startsWith('/api/auth')) {
      rateLimitConfig = RATE_LIMIT_CONFIGS.AUTH
    } else if (!pathname.startsWith('/api/auth')) {
      rateLimitConfig = RATE_LIMIT_CONFIGS.AUTHENTICATED
    }

    const rateLimitResult = await rateLimiter.checkRateLimitWithIP(ip, rateLimitConfig)

    if (!rateLimitResult.success) {
      // Log de auditoria para rate limit excedido
      await auditLogger.logSecurityEvent(
        null,
        AUDIT_ACTIONS.RATE_LIMIT_EXCEEDED,
        {
          ip,
          path: pathname,
          method: request.method,
          limitType: 'IP',
          maxRequests: rateLimitConfig.maxRequests,
          windowMs: rateLimitConfig.windowMs
        },
        'Rate limit exceeded by IP address',
        ip,
        userAgent
      )

      return new NextResponse(
        JSON.stringify({ 
          error: rateLimitResult.message || 'Muitas requisições. Tente novamente em alguns minutos.' 
        }),
        { 
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitConfig.maxRequests.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }
  }

  // Verificar autenticação para rotas protegidas
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard/barber')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      // Log de auditoria para acesso não autorizado
      await auditLogger.logSecurityEvent(
        null,
        AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
        {
          path: pathname,
          method: request.method,
          expectedRole: pathname.startsWith('/admin') ? 'admin' : 'barber',
          actualRole: 'none'
        },
        'Unauthorized access attempt to protected route',
        ip,
        userAgent
      )

      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // Verificar roles específicas
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
      await auditLogger.logSecurityEvent(
        token.sub || null,
        AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
        {
          path: pathname,
          method: request.method,
          expectedRole: 'admin',
          actualRole: token.role,
          userEmail: token.email
        },
        'User attempted to access admin area without proper role',
        ip,
        userAgent
      )

      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/dashboard/barber') && token.role !== 'barber') {
      await auditLogger.logSecurityEvent(
        token.sub || null,
        AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
        {
          path: pathname,
          method: request.method,
          expectedRole: 'barber',
          actualRole: token.role,
          userEmail: token.email
        },
        'User attempted to access barber dashboard without proper role',
        ip,
        userAgent
      )

      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Adicionar headers de segurança
  const response = NextResponse.next()
  
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - assets and static files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|.*\\.).*)',
  ],
} 