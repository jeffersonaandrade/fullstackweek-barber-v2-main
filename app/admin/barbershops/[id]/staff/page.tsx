import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../_lib/auth"
import { supabaseAdmin } from "../../../../_lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../_components/ui/card"
import { Button } from "../../../../_components/ui/button"
import { Badge } from "../../../../_components/ui/badge"
import AdminHeader from "../../../../_components/admin-header"
import Link from "next/link"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Building2,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Filter
} from "lucide-react"

interface Barbershop {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  avatar_url: string | null
  created_at: string
}

export default async function BarbershopStaff({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/')
  }

  const { id } = params

  // Buscar dados da barbearia e staff
  let barbershop: Barbershop | null = null
  let staff: User[] = []
  let allUsers: User[] = []
  
  try {
    // Buscar barbearia
    const { data: barbershopData, error: barbershopError } = await supabaseAdmin
      .from('barbershops')
      .select('id, name')
      .eq('id', id)
      .single()

    if (barbershopError) {
      console.error('Erro ao buscar barbearia:', barbershopError)
      redirect('/admin/barbershops')
    }

    barbershop = barbershopData

    // Buscar staff da barbearia
    const { data: staffData, error: staffError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, phone, role, avatar_url, created_at')
      .eq('barbershop_id', id)
      .order('created_at', { ascending: false })

    if (!staffError && staffData) {
      staff = staffData
    }

    // Buscar todos os usuários (para adicionar à barbearia)
    const { data: allUsersData, error: allUsersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, phone, role, avatar_url, created_at')
      .or(`role.eq.barber,role.eq.receptionist`)
      .order('name', { ascending: true })

    if (!allUsersError && allUsersData) {
      allUsers = allUsersData.filter(user => 
        user.role === 'barber' || user.role === 'receptionist'
      )
    }

  } catch (error) {
    console.error('Erro ao buscar dados:', error)
    redirect('/admin/barbershops')
  }

  if (!barbershop) {
    redirect('/admin/barbershops')
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'barber': return 'secondary'
      case 'receptionist': return 'outline'
      default: return 'secondary'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'barber': return 'Barbeiro'
      case 'receptionist': return 'Recepcionista'
      default: return role
    }
  }

  const stats = {
    total: staff.length,
    barbers: staff.filter(u => u.role === 'barber').length,
    receptionists: staff.filter(u => u.role === 'receptionist').length
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <AdminHeader
        title={`Staff - ${barbershop.name}`}
        subtitle="Gerencie os funcionários desta barbearia"
        showBackButton
        backHref={`/admin/barbershops/${id}`}
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/users/new">
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Funcionário
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/users">
              <Users className="w-4 h-4 mr-2" />
              Ver Todos os Usuários
            </Link>
          </Button>
        </div>
      </AdminHeader>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total de Staff</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.barbers}</p>
              <p className="text-sm text-muted-foreground">Barbeiros</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.receptionists}</p>
              <p className="text-sm text-muted-foreground">Recepcionistas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Staff */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Funcionários ({stats.total})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum funcionário associado</h3>
              <p className="text-muted-foreground mb-6">
                Esta barbearia ainda não possui funcionários associados.
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link href="/admin/users/new">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Cadastrar Funcionário
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/users">
                    Ver Todos os Usuários
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {staff.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usuários Disponíveis para Adicionar */}
      {allUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Usuários Disponíveis para Adicionar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allUsers
                .filter(user => !staff.find(s => s.id === user.id))
                .slice(0, 5)
                .map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                ))}
              
              {allUsers.filter(user => !staff.find(s => s.id === user.id)).length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" asChild>
                    <Link href="/admin/users">
                      Ver Todos os Usuários
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 