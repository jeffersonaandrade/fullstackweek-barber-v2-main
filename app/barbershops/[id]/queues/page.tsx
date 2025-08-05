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
  description: string | null
  queue_type: 'general' | 'specific'
  is_active: boolean
  max_capacity: number | null
  current_position: number
  barbershops: {
    id: string
    name: string
    address: string | null
    phones: string | null
  }
}

interface ActiveBarber {
  id: string
  users: {
    id: string
    name: string
    avatar_url: string | null
  }
}

export default function QueueSelectionPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const barbershopId = params.id as string

  const [queues, setQueues] = useState<Queue[]>([])
  const [activeBarbers, setActiveBarbers] = useState<ActiveBarber[]>([])
  const [loading, setLoading] = useState(true)
  const [joiningQueue, setJoiningQueue] = useState<string | null>(null)

  useEffect(() => {
    if (barbershopId) {
      fetchQueues()
      fetchActiveBarbers()
    }
  }, [barbershopId])

  const fetchQueues = async () => {
    try {
      const response = await fetch(`/api/queues?barbershopId=${barbershopId}`)
      const data = await response.json()

      if (response.ok) {
        setQueues(data.queues || [])
      } else {
        toast.error('Erro ao carregar filas')
      }
    } catch (error) {
      console.error('Erro ao buscar filas:', error)
      toast.error('Erro ao carregar filas')
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveBarbers = async () => {
    try {
      const response = await fetch(`/api/barbershops/${barbershopId}/active-barbers`)
      const data = await response.json()

      if (response.ok) {
        setActiveBarbers(data.barbers || [])
      }
    } catch (error) {
      console.error('Erro ao buscar barbeiros ativos:', error)
    }
  }

  const handleJoinQueue = async (queueId: string, queueType: 'general' | 'specific') => {
    setJoiningQueue(queueId)

    try {
      const body: any = {
        isGuest: !session?.user?.id
      }

      // Se for fila específica, precisa escolher barbeiro
      if (queueType === 'specific') {
        if (activeBarbers.length === 0) {
          toast.error('Nenhum barbeiro ativo no momento')
          setJoiningQueue(null)
          return
        }
        
        // Por enquanto, usar o primeiro barbeiro ativo
        body.barberId = activeBarbers[0].id
      }

      const response = await fetch(`/api/queues/${queueId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        // Redirecionar para página de status da fila
        router.push(`/queues/${queueId}/status`)
      } else {
        toast.error(data.error || 'Erro ao entrar na fila')
      }
    } catch (error) {
      console.error('Erro ao entrar na fila:', error)
      toast.error('Erro ao entrar na fila')
    } finally {
      setJoiningQueue(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando filas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (queues.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma fila disponível</CardTitle>
            <CardDescription>
              Não há filas ativas nesta barbearia no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()}>
              Voltar para barbearia
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const barbershop = queues[0]?.barbershops

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Escolha sua fila</h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{barbershop?.name}</span>
          </div>
          {barbershop?.phones && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{barbershop.phones}</span>
            </div>
          )}
        </div>

        {/* Resumo geral das filas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resumo das Filas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {queues.length}
                </div>
                <p className="text-sm text-muted-foreground">Filas disponíveis</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {queues.reduce((total, queue) => total + queue.current_position, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Total na fila</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {activeBarbers.length}
                </div>
                <p className="text-sm text-muted-foreground">Barbeiros ativos</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.ceil(queues.reduce((total, queue) => total + queue.current_position, 0) * 15 / Math.max(activeBarbers.length, 1))}
                </div>
                <p className="text-sm text-muted-foreground">Min estimados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {queues.map((queue) => {
          const estimatedTime = Math.ceil(queue.current_position * 15 / Math.max(activeBarbers.length, 1))
          const isQueueBusy = queue.current_position > 10
          const isQueueModerate = queue.current_position > 5 && queue.current_position <= 10
          const isQueueLight = queue.current_position <= 5

          return (
            <Card key={queue.id} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{queue.name}</CardTitle>
                  <Badge variant={queue.queue_type === 'general' ? 'default' : 'secondary'}>
                    {queue.queue_type === 'general' ? 'Geral' : 'Específica'}
                  </Badge>
                </div>
                {queue.description && (
                  <CardDescription>{queue.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status da fila - Melhorado */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{queue.current_position}</div>
                      <p className="text-xs text-muted-foreground">Pessoas na fila</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{activeBarbers.length}</div>
                      <p className="text-xs text-muted-foreground">Barbeiros ativos</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.ceil(15 / Math.max(activeBarbers.length, 1))}
                      </div>
                      <p className="text-xs text-muted-foreground">Min por cliente</p>
                    </div>
                  </div>

                  {/* Tempo estimado - Melhorado */}
                  <div className={`text-center p-4 rounded-lg border-2 ${
                    isQueueBusy ? 'bg-red-50 border-red-200' : 
                    isQueueModerate ? 'bg-yellow-50 border-yellow-200' : 
                    'bg-green-50 border-green-200'
                  }`}>
                    <div className="text-xl font-bold mb-1">
                      {estimatedTime} minutos
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tempo estimado de espera
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      {isQueueBusy && (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-700">Fila movimentada</span>
                        </>
                      )}
                      {isQueueModerate && (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-700">Fila moderada</span>
                        </>
                      )}
                      {isQueueLight && (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">Fila tranquila</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Capacidade máxima:</span>
                      <span className="font-medium">
                        {queue.max_capacity ? `${queue.max_capacity} pessoas` : 'Sem limite'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={`font-medium ${queue.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {queue.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>

                  {/* Botão de entrar na fila */}
                  <Button
                    onClick={() => handleJoinQueue(queue.id, queue.queue_type)}
                    disabled={joiningQueue === queue.id || !queue.is_active}
                    className="w-full"
                    variant={isQueueBusy ? "destructive" : "default"}
                  >
                    {joiningQueue === queue.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 mr-2" />
                        {isQueueBusy ? 'Entrar na Fila (Movimentada)' : 'Entrar na Fila'}
                      </>
                    )}
                  </Button>

                  {!queue.is_active && (
                    <div className="text-center text-sm text-orange-600 bg-orange-50 p-2 rounded-lg">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      Fila temporariamente inativa
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Informações importantes */}
      <Card className="mt-8">
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
            {!session?.user?.id && (
              <p className="text-orange-600 font-medium">
                • Você está entrando como cliente sem conta. Para mais funcionalidades, faça login.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 