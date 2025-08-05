'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge'
import { ArrowLeft, Users, Clock, MapPin, Phone } from 'lucide-react'
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
  const barbershopId = params.barbershopId as string

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
        
        // Por enquanto, escolhe o primeiro barbeiro ativo
        body.selectedBarberId = activeBarbers[0].id
      }

      // Se for guest, precisa de nome e telefone
      if (!session?.user?.id) {
        const customerName = prompt('Digite seu nome:')
        const customerPhone = prompt('Digite seu telefone:')
        
        if (!customerName || !customerPhone) {
          toast.error('Nome e telefone são obrigatórios')
          setJoiningQueue(null)
          return
        }
        
        body.customerName = customerName
        body.customerPhone = customerPhone
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
        <div className="flex items-center gap-4 text-muted-foreground">
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
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {queues.map((queue) => (
          <Card key={queue.id} className="hover:shadow-lg transition-shadow">
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
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Posição atual</span>
                  </div>
                  <span className="font-semibold">{queue.current_position}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Tempo estimado</span>
                  </div>
                  <span className="font-semibold">
                    {queue.current_position * 15} min
                  </span>
                </div>

                {queue.queue_type === 'specific' && activeBarbers.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <p>Barbeiros ativos: {activeBarbers.length}</p>
                  </div>
                )}

                <Button
                  onClick={() => handleJoinQueue(queue.id, queue.queue_type)}
                  disabled={joiningQueue === queue.id}
                  className="w-full"
                >
                  {joiningQueue === queue.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Entrando...
                    </>
                  ) : (
                    'Entrar na fila'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!session?.user?.id && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Não tem conta?</CardTitle>
            <CardDescription>
              Você pode entrar na fila sem criar uma conta, mas algumas funcionalidades podem ser limitadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/auth/signup')}>
                Criar conta
              </Button>
              <Button variant="outline" onClick={() => router.push('/auth/signin')}>
                Fazer login
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 