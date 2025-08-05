"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card"
import { Button } from "@/app/_components/ui/button"
import { Badge } from "@/app/_components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select"
import { Scissors, Users, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface BarberStatus {
  id: string
  barber_id: string
  barbershop_id: string
  is_active: boolean
  started_at: string
  ended_at: string | null
  barbershop: {
    id: string
    name: string
    address: string
  }
}

interface Barbershop {
  id: string
  name: string
  address: string
  is_active: boolean
}

export default function BarberDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [barberStatus, setBarberStatus] = useState<BarberStatus | null>(null)
  const [barbershops, setBarbershops] = useState<Barbershop[]>([])
  const [selectedBarbershopId, setSelectedBarbershopId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)

  // Verificar se é barbeiro
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

    fetchBarberStatus()
    fetchBarbershops()
  }, [session, status, router])

  // Selecionar primeira barbearia quando as barbearias forem carregadas
  useEffect(() => {
    if (barbershops.length > 0 && !selectedBarbershopId) {
      setSelectedBarbershopId(barbershops[0].id)
    }
  }, [barbershops, selectedBarbershopId])

  const fetchBarberStatus = async () => {
    try {
      const response = await fetch(`/api/barbers/status`)
      if (response.ok) {
        const data = await response.json()
        setBarberStatus(data.status)
      }
    } catch (error) {
      console.error("Erro ao buscar status:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBarbershops = async () => {
    try {
      console.log("Buscando barbearias...")
      const response = await fetch('/api/barbershops')
      if (response.ok) {
        const data = await response.json()
        console.log("Barbearias recebidas:", data)
        const activeBarbershops = data.barbershops.filter((shop: Barbershop) => shop.is_active)
        console.log("Barbearias ativas:", activeBarbershops)
        setBarbershops(activeBarbershops)
        // Sempre selecionar a primeira barbearia se não houver nenhuma selecionada
        if (activeBarbershops.length > 0) {
          setSelectedBarbershopId(activeBarbershops[0].id)
          console.log("Barbearia selecionada:", activeBarbershops[0].id)
        }
      } else {
        console.error("Erro na resposta da API:", response.status)
      }
    } catch (error) {
      console.error("Erro ao buscar barbearias:", error)
    }
  }

  const handleActivateStatus = async () => {
    setActivating(true)
    try {
      const response = await fetch("/api/barbers/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barbershopId: selectedBarbershopId
        }),
      })

      if (response.ok) {
        toast.success("Status ativado com sucesso!")
        fetchBarberStatus()
      } else {
        const error = await response.json()
        toast.error(error.message || "Erro ao ativar status")
      }
    } catch (error) {
      toast.error("Erro ao ativar status")
    } finally {
      setActivating(false)
    }
  }

  const handleDeactivateStatus = async () => {
    try {
      const response = await fetch("/api/barbers/deactivate", {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Status desativado com sucesso!")
        fetchBarberStatus()
      } else {
        const error = await response.json()
        toast.error(error.message || "Erro ao desativar status")
      }
    } catch (error) {
      toast.error("Erro ao desativar status")
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
        <h1 className="text-3xl font-bold mb-2">Dashboard do Barbeiro</h1>
        <p className="text-muted-foreground">
          Gerencie seu status de trabalho e atendimentos
        </p>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Status de Trabalho
          </CardTitle>
          <CardDescription>
            Ative seu status para começar a atender clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {barberStatus?.is_active ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Status: Ativo</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Trabalhando
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Barbearia Atual</p>
                  <p className="font-medium">{barberStatus.barbershop.name}</p>
                  <p className="text-sm text-muted-foreground">{barberStatus.barbershop.address}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Início do Expediente</p>
                  <p className="font-medium">
                    {new Date(barberStatus.started_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleDeactivateStatus}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Desativar Status
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => router.push(`/dashboard/barber/queue?barbershopId=${barberStatus.barbershop_id}`)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Fila
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium">Status: Inativo</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  Fora de Serviço
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Ative seu status para começar a receber clientes na fila
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Selecionar Barbearia:</label>
                  {barbershops.length > 0 ? (
                    <Select value={selectedBarbershopId} onValueChange={setSelectedBarbershopId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha uma barbearia" />
                      </SelectTrigger>
                      <SelectContent>
                        {barbershops.map((barbershop) => (
                          <SelectItem key={barbershop.id} value={barbershop.id}>
                            {barbershop.name} - {barbershop.address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Nenhuma barbearia ativa encontrada. Entre em contato com o administrador.
                      </p>
                    </div>
                  )}

                </div>

                <Button 
                  onClick={handleActivateStatus}
                  disabled={activating || !selectedBarbershopId}
                  className="w-full"
                >
                  {activating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Ativando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Ativar Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {barberStatus?.is_active && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => router.push(`/dashboard/barber/next?barbershopId=${barberStatus.barbershop_id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Chamar Próximo</h3>
                  <p className="text-sm text-muted-foreground">Chamar próximo cliente da fila</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/barber/timeout?barbershopId=${barberStatus.barbershop_id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Timeout</h3>
                  <p className="text-sm text-muted-foreground">Gerenciar clientes que não se apresentaram</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/dashboard/barber/queue?barbershopId=${barberStatus.barbershop_id}`)}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Scissors className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Ver Fila</h3>
                  <p className="text-sm text-muted-foreground">Visualizar fila atual</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Informações Importantes */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Ative seu status apenas quando estiver disponível para atender</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Desative o status ao final do expediente ou quando não puder atender</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Gerencie clientes que não se apresentaram para manter a fila fluindo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 