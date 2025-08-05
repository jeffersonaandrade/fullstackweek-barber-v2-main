import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../../_lib/auth"
import { supabaseAdmin } from "../../_lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "../../_components/ui/card"
import { Button } from "../../_components/ui/button"
import { Badge } from "../../_components/ui/badge"
import AdminHeader from "../../_components/admin-header"
import Link from "next/link"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Building2,
  Mail,
  Phone
} from "lucide-react"

export default async function AdminUsers() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/')
  }

  // Buscar usuários do Supabase diretamente
  let users: any[] = []

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        barbershops!users_barbershop_id_fkey (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar usuários:', error)
    } else {
      users = data || []
    }
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default'
      case 'barber': return 'secondary'
      case 'receptionist': return 'outline'
      case 'client': return 'secondary'
      default: return 'secondary'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'barber': return 'Barbeiro'
      case 'receptionist': return 'Recepcionista'
      case 'client': return 'Cliente'
      default: return role
    }
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <AdminHeader
        title="Gestão de Usuários"
        subtitle="Cadastre e gerencie barbeiros, recepcionistas e clientes"
        showBackButton
        backHref="/admin"
      >
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Link>
        </Button>
      </AdminHeader>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum usuário cadastrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece cadastrando barbeiros e recepcionistas para sua barbearia.
            </p>
            <Button asChild>
              <Link href="/admin/users/new">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Usuário
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {user.name}
                    </CardTitle>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}

                {user.barbershop && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{user.barbershop.name}</span>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Criado em:</span>
                    <span className="font-medium">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Gerenciar Permissões
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 