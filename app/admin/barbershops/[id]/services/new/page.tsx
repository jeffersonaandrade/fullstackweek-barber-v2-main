'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Label } from '@/app/_components/ui/label'
import { Textarea } from '@/app/_components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/_components/ui/select'
import { Switch } from '@/app/_components/ui/switch'
import { ImageUpload } from '@/app/_components/ui/image-upload'
import { ArrowLeft, Save, Package } from 'lucide-react'
import { toast } from 'sonner'

interface Barbershop {
  id: string
  name: string
  address: string
  phones: string[]
}

const SERVICE_CATEGORIES = [
  { value: 'cabelo', label: 'Cabelo' },
  { value: 'barba', label: 'Barba' },
  { value: 'sobrancelha', label: 'Sobrancelha' },
  { value: 'hidratacao', label: 'Hidratação' },
  { value: 'acabamento', label: 'Acabamento' },
  { value: 'massagem', label: 'Massagem' },
  { value: 'outros', label: 'Outros' }
]

export default function NewServicePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const barbershopId = params.id as string

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    estimated_time: '15',
    is_active: true,
    image_url: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user || session.user.role !== 'admin') {
      router.push('/auth/signin')
      return
    }

    if (barbershopId) {
      fetchBarbershop()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Nome, categoria e preço são obrigatórios')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/barbershops/${barbershopId}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          estimated_time: parseInt(formData.estimated_time),
          is_active: formData.is_active,
          image_url: formData.image_url
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Serviço criado com sucesso!')
        router.push(`/admin/barbershops/${barbershopId}/services`)
      } else {
        toast.error(data.error || 'Erro ao criar serviço')
      }
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      toast.error('Erro ao criar serviço')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando...</p>
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
            onClick={() => router.push(`/admin/barbershops/${barbershopId}/services`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Novo Serviço</h1>
        </div>
        
        {barbershop && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{barbershop.name}</h2>
            <p className="text-muted-foreground">{barbershop.address}</p>
          </div>
        )}
      </div>

      {/* Formulário */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informações do Serviço
          </CardTitle>
          <CardDescription>
            Preencha as informações para criar um novo serviço nesta barbearia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Serviço */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Serviço *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Corte com tesoura e máquina"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva o serviço em detalhes..."
                rows={3}
              />
            </div>

            {/* Imagem do Serviço */}
            <div className="space-y-2">
              <ImageUpload
                label="Imagem do Serviço"
                value={formData.image_url}
                onChange={(value) => handleInputChange('image_url', value || '')}
                placeholder="Clique para fazer upload da imagem do serviço"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            {/* Tempo Estimado */}
            <div className="space-y-2">
              <Label htmlFor="estimated_time">Tempo Estimado (minutos)</Label>
              <Input
                id="estimated_time"
                type="number"
                min="1"
                value={formData.estimated_time}
                onChange={(e) => handleInputChange('estimated_time', e.target.value)}
                placeholder="15"
              />
            </div>

            {/* Status Ativo */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Serviço Ativo</Label>
                <p className="text-sm text-muted-foreground">
                  Serviços inativos não aparecem para os clientes
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Criar Serviço
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/barbershops/${barbershopId}/services`)}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 