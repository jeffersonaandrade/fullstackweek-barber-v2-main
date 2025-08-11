'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge'
import { ArrowLeft, Users, Clock, MapPin, Phone, AlertCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTrigger } from '@/app/_components/ui/dialog'
import GuestFormDialog from '@/app/_components/guest-form-dialog'
import { BarberCard } from '@/app/_components/barber-card'
import { QueueTypeCard } from '@/app/_components/queue-type-card'
import { StatusIndicator } from '@/app/_components/status-indicator'
import { QueueStatsGrid } from '@/app/_components/queue-stats-grid'

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
  const [barbershopInfo, setBarbershopInfo] = useState<any>(null)
  const [guestDialogOpen, setGuestDialogOpen] = useState(false)
  const [selectedQueue, setSelectedQueue] = useState<{ id: string; type: 'general' | 'specific'; name: string } | null>(null)
  const [barberStats, setBarberStats] = useState<{ [key: string]: any }>({})

  useEffect(() => {
    if (barbershopId) {
      fetchActiveBarbers()
    }
  }, [barbershopId])

  useEffect(() => {
    // Buscar estatísticas dos barbeiros quando eles são carregados
    activeBarbers.forEach(barber => {
      if (!barberStats[barber.id]) {
        fetchBarberStats(barber.id)
      }
    })
  }, [activeBarbers])

  const fetchActiveBarbers = async () => {
    try {
      const response = await fetch(`/api/barbershops/${barbershopId}/active-barbers`)
      const data = await response.json()

      if (response.ok) {
        setActiveBarbers(data.barbers || [])
        
        // Se há barbeiros ativos, buscar filas
        if (data.barbers && data.barbers.length > 0) {
          fetchQueues()
        } else {
          // Se não há barbeiros ativos, buscar informações da barbearia para mostrar mensagem
          fetchBarbershopInfo()
        }
      } else {
        toast.error('Erro ao verificar disponibilidade da barbearia')
      }
    } catch (error) {
      console.error('Erro ao buscar barbeiros ativos:', error)
      toast.error('Erro ao verificar disponibilidade da barbearia')
    } finally {
      setLoading(false)
    }
  }

  const fetchBarbershopInfo = async () => {
    try {
      const response = await fetch(`/api/barbershops/${barbershopId}`)
      const data = await response.json()

      if (response.ok) {
        setBarbershopInfo(data.barbershop)
      }
    } catch (error) {
      console.error('Erro ao buscar informações da barbearia:', error)
    }
  }

  const fetchQueues = async () => {
    try {
      // Usar a nova API que cria filas automaticamente
      const response = await fetch(`/api/barbershops/${barbershopId}/queues`)
      const data = await response.json()

      if (response.ok) {
        if (data.queues && data.queues.length > 0) {
          setQueues(data.queues)
        } else {
          toast.error('Nenhuma fila disponível')
        }
      } else {
        toast.error('Erro ao carregar filas')
      }
    } catch (error) {
      console.error('Erro ao buscar filas:', error)
      toast.error('Erro ao carregar filas')
    }
  }

  const fetchBarberStats = async (barberId: string) => {
    try {
      const response = await fetch(`/api/barbers/${barberId}/reviews`)
      const data = await response.json()

      if (response.ok) {
        setBarberStats(prev => ({
          ...prev,
          [barberId]: data
        }))
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas do barbeiro:', error)
    }
  }

  const handleJoinQueue = async (queueId: string, queueType: 'general' | 'specific', queueName: string) => {
    // Se não estiver logado, mostrar modal para coletar dados
    if (!session?.user?.id) {
      setSelectedQueue({ id: queueId, type: queueType, name: queueName })
      setGuestDialogOpen(true)
      return
    }

    // Se estiver logado, entrar diretamente na fila
    await joinQueue(queueId, queueType)
  }

  const joinQueue = async (queueId: string, queueType: 'general' | 'specific', guestData?: { 
    customerName: string; 
    customerPhone: string;
    selectedBarberId?: string;
    selectedServiceId?: string;
  }) => {
    setJoiningQueue(queueId)

    try {
      const body: any = {
        isGuest: !session?.user?.id
      }

      // Se for guest, adicionar dados do cliente
      if (guestData) {
        body.customerName = guestData.customerName
        body.customerPhone = guestData.customerPhone
        
        // Adicionar barbeiro selecionado se fornecido
        if (guestData.selectedBarberId) {
          body.selectedBarberId = guestData.selectedBarberId
        }
        
        // Adicionar serviço selecionado se fornecido
        if (guestData.selectedServiceId) {
          body.selectedServiceId = guestData.selectedServiceId
        }
      }

      // Se for fila específica e não foi selecionado barbeiro, usar o primeiro disponível
      if (queueType === 'specific' && !body.selectedBarberId) {
        if (activeBarbers.length === 0) {
          toast.error('Nenhum barbeiro ativo no momento')
          setJoiningQueue(null)
          return
        }
        
        // Usar o primeiro barbeiro ativo
        body.selectedBarberId = activeBarbers[0].id
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
        
        // Se for guest, salvar telefone no localStorage para acompanhar status
        if (guestData?.customerPhone) {
          localStorage.setItem('guestPhone', guestData.customerPhone)
        }
        
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

  const handleGuestFormSuccess = async (guestData: { 
    customerName: string; 
    customerPhone: string;
    selectedBarberId?: string;
    selectedServiceId?: string;
  }) => {
    if (selectedQueue) {
      setGuestDialogOpen(false)
      await joinQueue(selectedQueue.id, selectedQueue.type, guestData)
    }
  }

  const handleGuestFormCancel = () => {
    setGuestDialogOpen(false)
    setSelectedQueue(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Verificando disponibilidade da barbearia...</p>
          </div>
        </div>
      </div>
    )
  }

  // Verificar se há barbeiros ativos - Regra de Negócio implementada
  if (activeBarbers.length === 0) {
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
        
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Barbearia Fechada</CardTitle>
            <CardDescription>
              No momento não há barbeiros ativos nesta barbearia.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Para entrar na fila, é necessário que pelo menos um barbeiro esteja ativo.</p>
              <p className="mt-2">Tente novamente mais tarde ou entre em contato com a barbearia.</p>
            </div>
            
            {barbershopInfo && (
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">{barbershopInfo.name}</h4>
                {barbershopInfo.phones && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{barbershopInfo.phones}</span>
                  </div>
                )}
              </div>
            )}
            
            <Button onClick={() => router.back()} className="w-full">
              Voltar para barbearia
            </Button>
          </CardContent>
        </Card>
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
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Hero Section - Imagem de fundo da barbearia */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url(" + (barbershopInfo?.image_url || "") + ")" }}></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold mb-2 text-yellow-400">{barbershop?.name || "Escolha sua fila"}</h1>
          <div className="flex items-center justify-center gap-4 text-gray-300 mb-6">
            {barbershop?.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{barbershop.address}</span>
              </div>
            )}
            {barbershop?.phones && (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>{barbershop.phones}</span>
              </div>
            )}
          </div>

          {/* Status da barbearia - NOVO */}
          <Card className="mb-6 border-green-200 bg-green-50/20 text-green-100 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2 text-green-400">
                <StatusIndicator status={true} />
                Barbearia Aberta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <span className="text-green-300">
                  {activeBarbers.length} barbeiro{activeBarbers.length > 1 ? 's' : ''} ativo{activeBarbers.length > 1 ? 's' : ''}
                </span>
                <Badge variant="outline" className="ml-4 border-green-300 text-green-300 bg-transparent">
                  Disponível para filas
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Barbeiros Ativos */}
        <h2 className="text-3xl font-bold mb-4 text-yellow-400 text-center">Conheça Nossos Barbeiros</h2>
        <p className="text-center text-gray-300 mb-6">Escolha entre a fila geral ou a fila específica de um barbeiro</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {activeBarbers.map((barber) => {
            const stats = barberStats[barber.id]
            
            return (
              <BarberCard
                key={barber.id}
                barber={{
                  id: barber.id,
                  name: barber.users.name,
                  avatar_url: barber.users.avatar_url,
                  rating: stats?.averageRating || 4.5,
                  reviews_count: stats?.totalReviews || 0,
                  specialties: stats?.specialties || ["Corte", "Barba"],
                  avg_service_time: stats?.avgServiceTime || 25,
                  clients_today: stats?.clientsToday || 0,
                }}
                onSelectBarber={undefined}
                isSelected={false}
              />
            )
          })}
        </div>

        {/* Resumo geral das filas */}
        <QueueStatsGrid
          queuesLength={queues.length}
          totalInQueue={queues.reduce((total, queue) => total + queue.current_position, 0)}
          activeBarbersCount={activeBarbers.length}
          estimatedTotalMinutes={Math.ceil(queues.reduce((total, queue) => total + queue.current_position, 0) * 15 / Math.max(activeBarbers.length, 1))}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Escolha Sua Fila</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {queues.map((queue) => {
            const estimatedTime = Math.ceil(queue.current_position * 15 / Math.max(activeBarbers.length, 1))

            return (
              <QueueTypeCard
                key={queue.id}
                queue={queue}
                estimatedTime={estimatedTime}
                activeBarbersCount={activeBarbers.length}
                joiningQueue={joiningQueue}
                onJoinQueue={handleJoinQueue}
              />
            )
          })}
        </div>

        {/* Informações importantes */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-gray-300">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-400">
            <AlertCircle className="h-5 w-5" />
            Informações importantes
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Você será notificado via WhatsApp quando for sua vez</li>
            <li>Chegue alguns minutos antes do horário estimado</li>
            <li>Se não se apresentar no tempo, pode perder sua vez</li>
            <li>Você pode sair da fila a qualquer momento</li>
            {!session?.user?.id && (
              <li className="text-orange-400 font-medium">
                Você está entrando como cliente sem conta. Para mais funcionalidades, faça login.
              </li>
            )}
          </ul>
        </div>

        {/* Modal para usuários guest */}
        <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <GuestFormDialog
              onSuccess={handleGuestFormSuccess}
              onCancel={handleGuestFormCancel}
              queueName={selectedQueue?.name}
              barbershopId={barbershopId}
              queueType={selectedQueue?.type}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 