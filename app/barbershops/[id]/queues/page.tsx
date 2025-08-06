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

  useEffect(() => {
    if (barbershopId) {
      fetchActiveBarbers()
    }
  }, [barbershopId])

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

        {/* Status da barbearia - NOVO */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Barbearia Aberta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-green-700">
                {activeBarbers.length} barbeiro{activeBarbers.length > 1 ? 's' : ''} ativo{activeBarbers.length > 1 ? 's' : ''}
              </span>
              <Badge variant="outline" className="border-green-300 text-green-700">
                Disponível para filas
              </Badge>
            </div>
          </CardContent>
        </Card>

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
                    onClick={() => handleJoinQueue(queue.id, queue.queue_type, queue.name)}
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
  )
} 