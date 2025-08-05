"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge'
import { ArrowLeft, Users, Clock, MapPin, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface QueueEntry {
  id: string
  position: number
  status: 'waiting' | 'called' | 'in_service' | 'completed' | 'left' | 'timeout'
  estimated_time: number
  joined_at: string
  customer_name: string | null
  customer_phone: string | null
  is_guest: boolean
  user_id: string | null
}

interface Barbershop {
  id: string
  name: string
  address: string
}

interface Statistics {
  totalWaiting: number
  estimatedWaitTime: number
  activeBarbers: number
}

export default function BarberQueuePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const barbershopId = searchParams.get('barbershopId')

  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([])
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null)
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user) {
      router.push("/auth/signin")
      return
    }

    if (session.user.role !== "barber") {
      router.push("/")
      toast.error("Acesso negado. Apenas barbeiros podem acessar esta página.")
      return
    }

    if (!barbershopId) {
      router.push("/dashboard/barber")
      toast.error("Barbearia não especificada.")
      return
    }

    fetchQueueData()
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchQueueData, 30000)
    setRefreshInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [session, status, router, barbershopId])

  const fetchQueueData = async () => {
    try {
      const response = await fetch(`/api/barbers/queue?barbershopId=${barbershopId}`)
      const data = await response.json()

      if (response.ok) {
        setQueueEntries(data.queueEntries || [])
        setBarbershop(data.barbershop)
        setStatistics(data.statistics)
      } else {
        toast.error(data.error || 'Erro ao carregar dados da fila')
      }
    } catch (error) {
      console.error('Erro ao buscar dados da fila:', error)
      toast.error('Erro ao carregar dados da fila')
    } finally {
      setLoading(false)
    }
  }

  const handleCallNext = async () => {
    try {
      const response = await fetch('/api/barbers/next', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barbershopId: barbershopId
        }),
      })

      if (response.ok) {
        toast.success('Próximo cliente chamado!')
        fetchQueueData()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erro ao chamar próximo cliente')
      }
    } catch (error) {
      toast.error('Erro ao chamar próximo cliente')
    }
  }

  const handleTimeout = async (entryId: string) => {
    if (!confirm('Confirmar timeout para este cliente?')) {
      return
    }

    try {
      const response = await fetch('/api/barbers/timeout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entryId: entryId
        }),
      })

      if (response.ok) {
        toast.success('Timeout aplicado com sucesso!')
        fetchQueueData()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erro ao aplicar timeout')
      }
    } catch (error) {
      toast.error('Erro ao aplicar timeout')
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
      return `${diffMinutes} min atrás`
    }
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}h atrás`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Aguardando</Badge>
      case 'called':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Chamado</Badge>
      case 'in_service':
        return <Badge variant="default" className="bg-green-100 text-green-800">Em Atendimento</Badge>
      case 'completed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Concluído</Badge>
      case 'left':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Saiu</Badge>
      case 'timeout':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Timeout</Badge>
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/barber')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Gestão de Fila</h1>
        </div>
        
        {barbershop && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{barbershop.name} - {barbershop.address}</span>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aguardando</p>
                  <p className="text-2xl font-bold">{statistics.totalWaiting}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tempo Estimado</p>
                  <p className="text-2xl font-bold">{formatTime(statistics.estimatedWaitTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barbeiros Ativos</p>
                  <p className="text-2xl font-bold">{statistics.activeBarbers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ações */}
      <div className="mb-6">
        <Button 
          onClick={handleCallNext}
          disabled={!queueEntries.some(entry => entry.status === 'waiting')}
          className="w-full md:w-auto"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Chamar Próximo Cliente
        </Button>
      </div>

      {/* Lista de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes na Fila
          </CardTitle>
          <CardDescription>
            Gerencie os clientes aguardando atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {queueEntries.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum cliente na fila no momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queueEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                      {entry.position}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {entry.customer_name || 'Cliente sem nome'}
                        </p>
                        {entry.is_guest && (
                          <Badge variant="outline" className="text-xs">Visitante</Badge>
                        )}
                        {getStatusBadge(entry.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {entry.customer_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{entry.customer_phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Entrou {formatJoinedTime(entry.joined_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {entry.status === 'waiting' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTimeout(entry.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Timeout
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 