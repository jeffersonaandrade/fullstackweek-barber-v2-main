"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../_components/ui/card"
import { Button } from "../../../_components/ui/button"
import { Input } from "../../../_components/ui/input"
import { Label } from "../../../_components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../_components/ui/select"
import AdminHeader from "../../../_components/admin-header"
import { toast } from "sonner"
import { Users, Save } from "lucide-react"
import Link from "next/link"

interface Barbershop {
  id: string
  name: string
}

export default function NewUser() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [barbershops, setBarbershops] = useState<Barbershop[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "barber" as 'client' | 'barber' | 'receptionist' | 'admin',
    barbershop_id: ""
  })

  // Buscar barbearias disponíveis
  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        const response = await fetch("/api/admin/barbershops")
        if (response.ok) {
          const data = await response.json()
          setBarbershops(data)
        }
      } catch (error) {
        console.error('Erro ao buscar barbearias:', error)
      }
    }

    fetchBarbershops()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    if (formData.role !== 'admin' && !formData.barbershop_id) {
      toast.error("Selecione uma barbearia para usuários não-admin")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          barbershop_id: formData.barbershop_id || null
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar usuário")
      }

      toast.success("Usuário criado com sucesso!")
      router.push("/admin/users")
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao criar usuário")
    } finally {
      setIsLoading(false)
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
        title="Novo Usuário"
        subtitle="Cadastre um novo usuário no sistema"
        showBackButton
        backHref="/admin/users"
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Senha segura"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Mínimo 6 caracteres
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Usuário *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: 'client' | 'barber' | 'receptionist' | 'admin') => 
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="barber">Barbeiro</SelectItem>
                    <SelectItem value="receptionist">Recepcionista</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {formData.role === 'admin' 
                    ? 'Administradores têm acesso total ao sistema'
                    : formData.role === 'barber'
                    ? 'Barbeiros podem se ativar em qualquer barbearia da rede'
                    : 'Recepcionistas precisam estar associados a uma barbearia específica'
                  }
                </p>
              </div>

              {formData.role === 'receptionist' && (
                <div className="space-y-2">
                  <Label htmlFor="barbershop_id">Barbearia *</Label>
                  <Select
                    value={formData.barbershop_id}
                    onValueChange={(value) => setFormData({ ...formData, barbershop_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma barbearia" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbershops.map((barbershop) => (
                        <SelectItem key={barbershop.id} value={barbershop.id}>
                          {barbershop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {barbershops.length === 0 
                      ? 'Nenhuma barbearia cadastrada. Crie uma barbearia primeiro.'
                      : 'Selecione a barbearia onde o recepcionista trabalhará'
                    }
                  </p>
                </div>
              )}

              {formData.role === 'barber' && (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Nota:</strong> Barbeiros podem se ativar e desativar em qualquer barbearia da rede. 
                    Eles não precisam estar vinculados permanentemente a uma barbearia específica.
                  </p>
                </div>
              )}

              {formData.role === 'admin' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Nota:</strong> Administradores não precisam estar associados a uma barbearia específica, 
                    pois têm acesso a todas as barbearias do sistema.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Criando..." : "Criar Usuário"}
          </Button>
        </div>
      </form>
    </div>
  )
} 