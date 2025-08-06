"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from "sonner"
import { User, Phone, Scissors, Package } from "lucide-react"
import Image from "next/image"

interface ActiveBarber {
  id: string
  users: {
    id: string
    name: string
    avatar_url: string | null
  }
}

interface BarbershopService {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface GuestFormDialogProps {
  onSuccess: (data: { 
    customerName: string; 
    customerPhone: string;
    selectedBarberId?: string;
    selectedServiceId?: string;
  }) => void
  onCancel: () => void
  queueName?: string
  barbershopId?: string
  queueType?: 'general' | 'specific'
}

const GuestFormDialog = ({ 
  onSuccess, 
  onCancel, 
  queueName, 
  barbershopId,
  queueType 
}: GuestFormDialogProps) => {
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [selectedBarberId, setSelectedBarberId] = useState<string>("")
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeBarbers, setActiveBarbers] = useState<ActiveBarber[]>([])
  const [services, setServices] = useState<BarbershopService[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (barbershopId) {
      fetchBarbershopData()
    } else {
      setLoadingData(false)
    }
  }, [barbershopId])

  const fetchBarbershopData = async () => {
    try {
      setLoadingData(true)
      
      // Buscar barbeiros ativos
      if (barbershopId) {
        const barbersResponse = await fetch(`/api/barbershops/${barbershopId}/active-barbers`)
        if (barbersResponse.ok) {
          const barbersData = await barbersResponse.json()
          setActiveBarbers(barbersData.barbers || [])
        }
      }

      // Buscar serviços da barbearia
      if (barbershopId) {
        const servicesResponse = await fetch(`/api/barbershops/${barbershopId}/services`)
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json()
          setServices(servicesData.services || [])
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados da barbearia:', error)
      toast.error('Erro ao carregar dados da barbearia')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Preencha todos os campos obrigatórios")
      return
    }

    // Validação básica do telefone (pelo menos 10 dígitos)
    const phoneDigits = customerPhone.replace(/\D/g, '')
    if (phoneDigits.length < 10) {
      toast.error("Digite um telefone válido")
      return
    }

    // Se for fila específica, verificar se escolheu um barbeiro
    if (queueType === 'specific' && activeBarbers.length > 0 && !selectedBarberId) {
      toast.error("Escolha um barbeiro para a fila específica")
      return
    }

    setIsLoading(true)

    try {
      // Simular validação (pode ser expandida)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onSuccess({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        selectedBarberId: selectedBarberId || undefined,
        selectedServiceId: selectedServiceId || undefined
      })
      
      toast.success("Dados coletados com sucesso!")
    } catch (error) {
      console.error("Erro ao processar dados:", error)
      toast.error("Erro ao processar dados")
    } finally {
      setIsLoading(false)
    }
  }

  if (loadingData) {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Carregando dados...
          </DialogTitle>
          <DialogDescription>
            Aguarde enquanto carregamos as informações da barbearia.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Entrar na Fila como Cliente
        </DialogTitle>
        <DialogDescription>
          {queueName ? `Para entrar na fila "${queueName}", precisamos de algumas informações:` : 
           "Para entrar na fila, precisamos de algumas informações:"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informações básicas do cliente */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Informações Pessoais</h3>
          
          <div className="space-y-2">
            <Label htmlFor="customerName">Nome Completo *</Label>
            <Input
              id="customerName"
              type="text"
              placeholder="Seu nome completo"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Telefone *</Label>
            <Input
              id="customerPhone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Você receberá notificações via WhatsApp neste número
            </p>
          </div>
        </div>

        {/* Seleção de barbeiro (se for fila específica e há barbeiros ativos) */}
        {queueType === 'specific' && activeBarbers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Escolha seu Barbeiro *
            </h3>
            
            <div className="space-y-2">
              <Select value={selectedBarberId} onValueChange={setSelectedBarberId} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um barbeiro" />
                </SelectTrigger>
                <SelectContent>
                  {activeBarbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id}>
                      <div className="flex items-center gap-2">
                        {barber.users.avatar_url ? (
                          <Image
                            src={barber.users.avatar_url}
                            alt={barber.users.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 text-gray-500" />
                          </div>
                        )}
                        <span>{barber.users.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Escolha o barbeiro que você prefere para o atendimento
              </p>
            </div>
          </div>
        )}

        {/* Seleção de serviço (se há serviços disponíveis) */}
        {services.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Serviço Desejado (Opcional)
            </h3>
            
            <div className="space-y-2">
              <Select value={selectedServiceId} onValueChange={setSelectedServiceId} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum serviço específico</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(Number(service.price))}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Informar o serviço ajuda a otimizar o tempo de atendimento
              </p>
            </div>
          </div>
        )}

        {/* Informações importantes */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Importante:</strong> Como cliente sem conta, você terá acesso limitado. 
            Para mais funcionalidades, considere fazer login.
          </p>
        </div>

        {/* Resumo da seleção */}
        {(selectedBarberId || selectedServiceId) && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Resumo da sua seleção:</h4>
            <div className="space-y-1 text-sm text-gray-700">
              {selectedBarberId && (
                <div className="flex items-center gap-2">
                  <Scissors className="h-3 w-3" />
                  <span>
                    Barbeiro: {activeBarbers.find(b => b.id === selectedBarberId)?.users.name}
                  </span>
                </div>
              )}
              {selectedServiceId && (
                <div className="flex items-center gap-2">
                  <Package className="h-3 w-3" />
                  <span>
                    Serviço: {services.find(s => s.id === selectedServiceId)?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <Phone className="h-4 w-4 mr-2" />
                Entrar na Fila
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  )
}

export default GuestFormDialog 