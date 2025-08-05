import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../_lib/auth"
import { supabaseAdmin } from "../../../_lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "../../../_components/ui/card"
import { Button } from "../../../_components/ui/button"
import { Badge } from "../../../_components/ui/badge"
import AdminHeader from "../../../_components/admin-header"
import Link from "next/link"
import { 
  Building2, 
  Edit, 
  Trash2,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  Settings,
  ArrowLeft,
  Package
} from "lucide-react"

interface Barbershop {
  id: string
  name: string
  address: string
  phones: string[]
  description: string | null
  image_url: string | null
  is_active: boolean
  commission_rate: number
  timeout_minutes: number
  created_at: string
  updated_at: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export default async function BarbershopDetails({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/')
  }

  const { id } = params

  // Buscar dados da barbearia
  let barbershop: Barbershop | null = null
  let staff: User[] = []
  let stats = {
    totalStaff: 0,
    barbers: 0,
    receptionists: 0,
    clients: 0
  }
  
  try {
    // Buscar barbearia
    const { data: barbershopData, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('*')
      .eq('id', id)
      .single()

    if (barbershopError) {
      console.error('Erro ao buscar barbearia:', barbershopError)
      redirect('/admin/barbershops')
    }

    if (barbershopData) {
      barbershop = {
        ...barbershopData,
        phones: barbershopData.phones ? JSON.parse(barbershopData.phones) : []
      }
    }

    // Buscar staff da barbearia
    const { data: staffData, error: staffError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('barbershop_id', id)
      .order('created_at', { ascending: false })

    if (!staffError && staffData) {
      staff = staffData
      
      // Calcular estatísticas
      stats = {
        totalStaff: staff.length,
        barbers: staff.filter(u => u.role === 'barber').length,
        receptionists: staff.filter(u => u.role === 'receptionist').length,
        clients: staff.filter(u => u.role === 'client').length
      }
    }

  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    redirect('/admin/barbershops')
  }

  if (!barbershop) {
    redirect('/admin/barbershops')
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <AdminHeader
        title={barbershop.name}
        subtitle="Detalhes da barbearia"
        showBackButton
        backHref="/admin/barbershops"
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/barbershops/${id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/admin/barbershops/${id}/staff`}>
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Staff
            </Link>
          </Button>
        </div>
      </AdminHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Informações Principais */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Card Principal */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {barbershop.name}
                  </CardTitle>
                  <Badge variant={barbershop.is_active ? "default" : "secondary"}>
                    {barbershop.is_active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{barbershop.address}</span>
              </div>
              
              {barbershop.phones && barbershop.phones.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{barbershop.phones.join(', ')}</span>
                </div>
              )}

              {barbershop.description && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    {barbershop.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Taxa de Comissão</p>
                    <p className="text-sm text-muted-foreground">
                      {barbershop.commission_rate}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Timeout de Apresentação</p>
                    <p className="text-sm text-muted-foreground">
                      {barbershop.timeout_minutes} minutos
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Staff ({stats.totalStaff})
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/barbershops/${id}/staff`}>
                    Ver Todos
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {staff.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum funcionário associado a esta barbearia
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {staff.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline">
                        {user.role === 'barber' ? 'Barbeiro' : 
                         user.role === 'receptionist' ? 'Recepcionista' : 
                         user.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </Badge>
                    </div>
                  ))}
                  {staff.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{staff.length - 3} mais funcionários
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Estatísticas */}
        <div className="space-y-4 lg:space-y-6">
          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.totalStaff}</p>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.barbers}</p>
                  <p className="text-sm text-muted-foreground">Barbeiros</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.receptionists}</p>
                  <p className="text-sm text-muted-foreground">Recepcionistas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats.clients}</p>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Criada em</p>
                  <p className="text-muted-foreground">
                    {new Date(barbershop.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Última atualização</p>
                  <p className="text-muted-foreground">
                    {new Date(barbershop.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/barbershops/${id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Barbearia
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/barbershops/${id}/staff`}>
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Staff
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/admin/barbershops/${id}/services`}>
                  <Package className="w-4 h-4 mr-2" />
                  Gerenciar Serviços
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/admin/users/new">
                  <Users className="w-4 h-4 mr-2" />
                  Adicionar Funcionário
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 