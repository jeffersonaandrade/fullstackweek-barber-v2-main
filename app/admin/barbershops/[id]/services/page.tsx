'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Badge } from '@/app/_components/ui/badge'
import { ArrowLeft, Plus, Edit, Trash2, Package, Clock, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  estimated_time: number
  image_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Barbershop {
  id: string
  name: string
  address: string
  phones: string[]
}

export default function BarbershopServicesPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const barbershopId = params.id as string

  const [services, setServices] = useState<Service[]>([])
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingService, setDeletingService] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user || session.user.role !== 'admin') {
      router.push('/auth/signin')
      return
    }

    if (barbershopId) {
      fetchBarbershop()
      fetchServices()
    }
  }, [session, status, router, barbershopId])

  const fetchBarbershop = async () => {
    try {
      const response = await fetch(`/api/barbershops/${barbershopId}`)
      const data = await response.json()

      if (response.ok) {
        setBarbershop(data.barbershop)
      }
    } catch (error) {
      console.error('Erro ao buscar barbearia:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/barbershops/${barbershopId}/services`)
      const data = await response.json()

      if (response.ok) {
        setServices(data.services || [])
      } else {
        toast.error('Erro ao carregar serviços')
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return
    }

    setDeletingService(serviceId)

    try {
      const response = await fetch(`/api/barbershops/${barbershopId}/services/${serviceId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Serviço excluído com sucesso')
        fetchServices() // Recarregar lista
      } else {
        const data = await response.json()
        toast.error(data.error || 'Erro ao excluir serviço')
      }
    } catch (error) {
      console.error('Erro ao excluir serviço:', error)
      toast.error('Erro ao excluir serviço')
    } finally {
      setDeletingService(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cabelo':
        return 'bg-blue-100 text-blue-800'
      case 'barba':
        return 'bg-orange-100 text-orange-800'
      case 'sobrancelha':
        return 'bg-purple-100 text-purple-800'
      case 'hidratacao':
        return 'bg-green-100 text-green-800'
      case 'acabamento':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando serviços...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/barbershops/${barbershopId}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Gestão de Serviços</h1>
        </div>
        
        {barbershop && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{barbershop.name}</h2>
            <p className="text-muted-foreground">{barbershop.address}</p>
          </div>
        )}

        {/* Estatísticas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Resumo dos Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {services.length}
                </div>
                <p className="text-sm text-muted-foreground">Total de serviços</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {services.filter(s => s.is_active).length}
                </div>
                <p className="text-sm text-muted-foreground">Serviços ativos</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {new Set(services.map(s => s.category)).size}
                </div>
                <p className="text-sm text-muted-foreground">Categorias</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(services.reduce((total, s) => total + s.price, 0))}
                </div>
                <p className="text-sm text-muted-foreground">Valor total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="mb-6">
        <Button
          onClick={() => router.push(`/admin/barbershops/${barbershopId}/services/new`)}
          className="w-full md:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo Serviço
        </Button>
      </div>

      {/* Lista de Serviços */}
      {services.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum serviço cadastrado</CardTitle>
            <CardDescription>
              Esta barbearia ainda não possui serviços cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push(`/admin/barbershops/${barbershopId}/services/new`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Primeiro Serviço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/barbershops/${barbershopId}/services/${service.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={deletingService === service.id}
                    >
                      {deletingService === service.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                {service.description && (
                  <CardDescription className="mt-2">
                    {service.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {/* Imagem do Serviço */}
                {service.image_url && (
                  <div className="mb-4">
                    <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                      <Image
                        src={service.image_url}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Preço:</span>
                    <span className="font-semibold text-lg">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tempo estimado:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.estimated_time} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 