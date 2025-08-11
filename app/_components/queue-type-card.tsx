import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge'
import { Users, Clock, AlertCircle } from 'lucide-react'

interface QueueTypeCardProps {
  queue: {
    id: string
    name: string
    description: string | null
    queue_type: 'general' | 'specific'
    max_capacity: number | null
    current_position: number
    is_active: boolean
  }
  estimatedTime: number
  activeBarbersCount: number
  joiningQueue: string | null
  onJoinQueue: (queueId: string, queueType: 'general' | 'specific', queueName: string) => void
}

export function QueueTypeCard({
  queue,
  estimatedTime,
  activeBarbersCount,
  joiningQueue,
  onJoinQueue,
}: QueueTypeCardProps) {
  const isQueueBusy = queue.current_position > 10
  const isQueueModerate = queue.current_position > 5 && queue.current_position <= 10
  const isQueueLight = queue.current_position <= 5

  const statusText = isQueueBusy ? 'Movimentada' : isQueueModerate ? 'Moderada' : 'Tranquila'
  const statusColorClass = isQueueBusy ? 'text-red-600' : isQueueModerate ? 'text-yellow-600' : 'text-green-600'
  const statusBgClass = isQueueBusy ? 'bg-red-50 border-red-200' : isQueueModerate ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
  const statusDotClass = isQueueBusy ? 'bg-red-500' : isQueueModerate ? 'bg-yellow-500' : 'bg-green-500'

  const getStatusIcon = () => {
    if (isQueueBusy) return '🔴'
    if (isQueueModerate) return '🟡'
    return '🟢'
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStatusIcon()}</span>
            <CardTitle className="text-xl">{queue.name}</CardTitle>
          </div>
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
              <div className="text-2xl font-bold text-green-600">{activeBarbersCount}</div>
              <p className="text-xs text-muted-foreground">Barbeiros ativos</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Math.ceil(15 / Math.max(activeBarbersCount, 1))}
              </div>
              <p className="text-xs text-muted-foreground">Min por cliente</p>
            </div>
          </div>

          {/* Tempo estimado - Melhorado */}
          <div className={`text-center p-4 rounded-lg border-2 ${statusBgClass}`}>
            <div className="text-xl font-bold mb-1">
              {estimatedTime} minutos
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Tempo estimado de espera
            </p>
            <div className="flex items-center justify-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${statusDotClass}`}></div>
              <span className={statusColorClass}>Fila {statusText}</span>
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
            onClick={() => onJoinQueue(queue.id, queue.queue_type, queue.name)}
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
}
