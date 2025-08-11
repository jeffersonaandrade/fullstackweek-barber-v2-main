import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Users, Clock, Scissors, TrendingUp } from 'lucide-react'

interface QueueStatisticsProps {
  totalQueues: number
  totalPeopleInQueue: number
  activeBarbers: number
  estimatedTotalTime: number
}

export function QueueStatistics({
  totalQueues,
  totalPeopleInQueue,
  activeBarbers,
  estimatedTotalTime
}: QueueStatisticsProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}min`
  }

  const getQueueStatus = () => {
    if (totalPeopleInQueue > 20) return { text: 'Movimentada', color: 'text-red-600', bg: 'bg-red-50' }
    if (totalPeopleInQueue > 10) return { text: 'Moderada', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { text: 'Tranquila', color: 'text-green-600', bg: 'bg-green-50' }
  }

  const status = getQueueStatus()

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Resumo das Filas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {/* Filas disponíveis */}
          <div className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">
              {totalQueues}
            </div>
            <p className="text-sm text-muted-foreground">Filas disponíveis</p>
          </div>

          {/* Total na fila */}
          <div className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {totalPeopleInQueue}
            </div>
            <p className="text-sm text-muted-foreground">Total na fila</p>
          </div>

          {/* Barbeiros ativos */}
          <div className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <div className="flex items-center justify-center mb-2">
              <Scissors className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {activeBarbers}
            </div>
            <p className="text-sm text-muted-foreground">Barbeiros ativos</p>
          </div>

          {/* Tempo estimado */}
          <div className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(estimatedTotalTime)}
            </div>
            <p className="text-sm text-muted-foreground">Tempo estimado</p>
          </div>
        </div>

        {/* Status geral */}
        <div className={`mt-4 p-3 rounded-lg border ${status.bg}`}>
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status.color.replace('text-', 'bg-')}`}></div>
            <span className={`font-medium ${status.color}`}>
              Status geral: {status.text}
            </span>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-1">
            Baseado em {activeBarbers} barbeiro{activeBarbers > 1 ? 's' : ''} ativo{activeBarbers > 1 ? 's' : ''} e {totalPeopleInQueue} pessoa{totalPeopleInQueue > 1 ? 's' : ''} na fila
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
