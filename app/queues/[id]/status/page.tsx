'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge'
import { ArrowLeft, Users, Clock, MapPin, Phone, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Queue {
  id: string
  name: string
  queue_type: 'general' | 'specific'
  barbershops: {
    id: string
    name: string
    address: string | null
    phones: string | null
  }
}

interface QueueEntry {
  id: string
  position: number
  status: 'waiting' | 'called' | 'in_service' | 'completed' | 'left' | 'timeout'
  estimated_time: number
  joined_at: string
  customer_name: string | null
  customer_phone: string | null
  is_guest: boolean
}

interface Statistics {
  totalWaiting: number
  estimatedWaitTime: number
  activeBarbers: number
}

export default function QueueStatusPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const queueId = params.id as string

  const [queue, setQueue] = useState<Queue | null>(null)
  const [clientEntry, setClientEntry] = useState<QueueEntry | null>(null)
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [leavingQueue, setLeavingQueue] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (queueId) {
      fetchQueueStatus()
      
      // Atualizar status a cada 30 segundos
      const interval = setInterval(fetchQueueStatus, 30000)
      setRefreshInterval(interval)

      return () => {
        if (interval) clearInterval(interval)
      }
    }
  }, [queueId])

  const fetchQueueStatus = async () => {
    try {
      const url = new URL(`/api/queues/${queueId}/status`, window.location.origin)
      
      // Se não estiver logado, usar telefone do localStorage
      if (!session?.user?.id) {
        const guestPhone = localStorage.getItem('guestPhone')
        if (guestPhone) {
          url.searchParams.set('phone', guestPhone)
        }
      }

      const response = await fetch(url.toString())
      const data = await response.json()

      if (response.ok) {
        setQueue(data.queue)
        setClientEntry(data.clientEntry)
        setStatistics(data.statistics)
      } else {
        toast.error(data.error || 'Erro ao carregar status da fila')
      }
    } catch (error) {
      console.error('Erro ao buscar status da fila:', error)
      toast.error('Erro ao carregar status da fila')
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveQueue = async () => {
    if (!confirm('Tem certeza que deseja sair da fila?')) {
      return
    }

    setLeavingQueue(true)

    try {
      const body: any = {}
      
      // Se não estiver logado, usar telefone do localStorage
      if (!session?.user?.id) {
        const guestPhone = localStorage.getItem('guestPhone')
        if (guestPhone) {
          body.customerPhone = guestPhone
        }
      }

      const response = await fetch(`/api/queues/${queueId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        router.push('/')
      } else {
        toast.error(data.error || 'Erro ao sair da fila')
      }
    } catch (error) {
      console.error('Erro ao sair da fila:', error)
      toast.error('Erro ao sair da fila')
    } finally {
      setLeavingQueue(false)
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  const formatJoinedTime = (joinedAt: string) => {
    const joined = new Date(joinedAt)
    const now = new Date()
    const diffMs = now.getTime() - joined.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`
    }
    const hours = Math.floor(diffMinutes / 60)
    const remainingMinutes = diffMinutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando status da fila...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!queue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Fila não encontrada</CardTitle>
            <CardDescription>
              A fila que você está procurando não existe ou foi removida.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!clientEntry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Você não está nesta fila</CardTitle>
            <CardDescription>
              Você não possui uma entrada ativa nesta fila.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(`/queues/${queue.barbershops.id}`)}>
              Entrar na fila
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push('/')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Status da Fila</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{queue.barbershops.name}</span>
          </div>
          {queue.barbershops.phones && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{queue.barbershops.phones}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status do Cliente */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sua Posição
            </CardTitle>
            <CardDescription>
              {queue.name} - {queue.queue_type === 'general' ? 'Fila Geral' : 'Fila Específica'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  #{clientEntry.position}
                </div>
                <p className="text-muted-foreground">Posição na fila</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-semibold">
                    {formatTime(clientEntry.estimated_time)}
                  </div>
                  <p className="text-sm text-muted-foreground">Tempo estimado</p>
                </div>
                <div>
                  <div className="text-2xl font-semibold">
                    {formatJoinedTime(clientEntry.joined_at)}
                  </div>
                  <p className="text-sm text-muted-foreground">Tempo na fila</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleLeaveQueue}
                  disabled={leavingQueue}
                  variant="outline"
                  className="flex-1"
                >
                  {leavingQueue ? 'Saindo...' : 'Sair da fila'}
                </Button>
                <Button
                  onClick={fetchQueueStatus}
                  variant="outline"
                  size="icon"
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas da Fila */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Estatísticas da Fila
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{statistics?.totalWaiting || 0}</div>
                  <p className="text-sm text-muted-foreground">Pessoas na fila</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{statistics?.activeBarbers || 0}</div>
                  <p className="text-sm text-muted-foreground">Barbeiros ativos</p>
                </div>
              </div>

              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-lg font-semibold">
                  Tempo estimado total: {formatTime(statistics?.estimatedWaitTime || 0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Baseado em 15 minutos por atendimento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Você será notificado via WhatsApp quando for sua vez</p>
            <p>• Chegue alguns minutos antes do horário estimado</p>
            <p>• Se não se apresentar no tempo, pode perder sua vez</p>
            <p>• Você pode sair da fila a qualquer momento</p>
            {clientEntry.is_guest && (
              <p className="text-orange-600 font-medium">
                • Você está na fila como cliente sem conta. Para mais funcionalidades, crie uma conta.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Atualização automática */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Status atualizado automaticamente a cada 30 segundos</p>
      </div>
    </div>
  )
} 