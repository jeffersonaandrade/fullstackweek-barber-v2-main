import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "../_components/ui/card"
import { Button } from "../_components/ui/button"
import AdminHeader from "../_components/admin-header"
import Link from "next/link"
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  Settings,
  Plus,
  UserPlus
} from "lucide-react"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <AdminHeader
        title="Dashboard Administrativo"
        subtitle="Gerencie sua rede de barbearias"
        showBackButton
        backHref="/"
      >
        <Button asChild>
          <Link href="/admin/barbershops/new">
            <Plus className="w-4 h-4 mr-2" />
            Nova Barbearia
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/users/new">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Link>
        </Button>
      </AdminHeader>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barbearias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              +1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seções Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Gestão de Barbearias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Crie e gerencie suas barbearias, configure comissões e timeouts.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild size="sm">
                <Link href="/admin/barbershops">
                  Ver Todas
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/barbershops/new">
                  Nova Barbearia
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestão de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Cadastre barbeiros, recepcionistas e gerencie suas permissões.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild size="sm">
                <Link href="/admin/users">
                  Ver Todos
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/admin/users/new">
                  Novo Usuário
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/admin/barbershops/new">
                <Building2 className="h-6 w-6" />
                <span>Criar Barbearia</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/admin/users/new">
                <UserPlus className="h-6 w-6" />
                <span>Cadastrar Barbeiro</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/admin/reports">
                <TrendingUp className="h-6 w-6" />
                <span>Ver Relatórios</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 