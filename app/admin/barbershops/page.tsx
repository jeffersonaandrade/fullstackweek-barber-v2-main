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
  Building2, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  MapPin,
  Phone
} from "lucide-react"

export default async function AdminBarbershops() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/')
  }

  // Buscar barbearias do Supabase diretamente
  let barbershops: any[] = []
  
  try {
    const { data, error } = await supabaseAdmin
      .from('barbershops')
      .select(`
        *,
        users!barbershops_admin_id_fkey (
          id,
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar barbearias:', error)
    } else {
      barbershops = data || []
    }
  } catch (error) {
    console.error('Erro ao buscar barbearias:', error)
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <AdminHeader
        title="Gestão de Barbearias"
        subtitle="Crie e gerencie suas barbearias"
        showBackButton
        backHref="/admin"
      >
        <Button asChild>
          <Link href="/admin/barbershops/new">
            <Plus className="w-4 h-4 mr-2" />
            Nova Barbearia
          </Link>
        </Button>
      </AdminHeader>

      {barbershops.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma barbearia cadastrada</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece criando sua primeira barbearia para gerenciar barbeiros e clientes.
            </p>
            <Button asChild>
              <Link href="/admin/barbershops/new">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Barbearia
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {barbershops.map((barbershop) => (
            <Card key={barbershop.id}>
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
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/barbershops/${barbershop.id}/edit`}>
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
                  <MapPin className="h-4 w-4" />
                  <span>{barbershop.address}</span>
                </div>
                
                {barbershop.phones && barbershop.phones.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{barbershop.phones[0]}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{barbershop.staff_count || 0} funcionários</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Comissão:</span>
                    <span className="font-medium">
                      {barbershop.commission_rate || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Timeout:</span>
                    <span className="font-medium">
                      {barbershop.timeout_minutes || 5} min
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/admin/barbershops/${barbershop.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/admin/barbershops/${barbershop.id}/staff`}>
                      Gerenciar Staff
                    </Link>
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