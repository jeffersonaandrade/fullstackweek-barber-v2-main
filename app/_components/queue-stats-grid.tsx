import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Users, Clock, BarChart2 } from 'lucide-react'

interface QueueStatsGridProps {
  queuesLength: number
  totalInQueue: number
  activeBarbersCount: number
  estimatedTotalMinutes: number
}

export function QueueStatsGrid({
  queuesLength,
  totalInQueue,
  activeBarbersCount,
  estimatedTotalMinutes,
}: QueueStatsGridProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Resumo das Filas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {queuesLength}
            </div>
            <p className="text-sm text-muted-foreground">Filas disponíveis</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {totalInQueue}
            </div>
            <p className="text-sm text-muted-foreground">Total na fila</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {activeBarbersCount}
            </div>
            <p className="text-sm text-muted-foreground">Barbeiros ativos</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {estimatedTotalMinutes}
            </div>
            <p className="text-sm text-muted-foreground">Min estimados</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
