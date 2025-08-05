"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "../../../_components/ui/card"
import { Button } from "../../../_components/ui/button"
import { Input } from "../../../_components/ui/input"
import { Label } from "../../../_components/ui/label"
import { Textarea } from "../../../_components/ui/textarea"
import { Switch } from "../../../_components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft, Building2, Save } from "lucide-react"
import Link from "next/link"

export default function NewBarbershop() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phones: [""],
    description: "",
    is_active: true,
    commission_rate: 30,
    timeout_minutes: 10
  })

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...formData.phones]
    newPhones[index] = value
    setFormData({ ...formData, phones: newPhones })
  }

  const addPhone = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, ""]
    })
  }

  const removePhone = (index: number) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index)
      setFormData({ ...formData, phones: newPhones })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.address) {
      toast.error("Preencha os campos obrigatórios")
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implementar criação no Supabase
      const response = await fetch("/api/admin/barbershops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phones: formData.phones.filter(phone => phone.trim() !== "")
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar barbearia")
      }

      toast.success("Barbearia criada com sucesso!")
      router.push("/admin/barbershops")
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao criar barbearia")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/barbershops">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Nova Barbearia</h1>
          <p className="text-muted-foreground">
            Crie uma nova barbearia na sua rede
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Barbearia *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Barbearia Central"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Telefones</Label>
                {formData.phones.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                    {formData.phones.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhone(index)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhone}
                >
                  + Adicionar Telefone
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua barbearia..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Barbearia Ativa</Label>
                  <p className="text-sm text-muted-foreground">
                    Clientes podem ver e agendar nesta barbearia
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commission_rate">Taxa de Comissão (%)</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.commission_rate}
                  onChange={(e) => setFormData({ ...formData, commission_rate: Number(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">
                  Percentual que os barbeiros recebem por atendimento
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout_minutes">Timeout de Apresentação (minutos)</Label>
                <Input
                  id="timeout_minutes"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.timeout_minutes}
                  onChange={(e) => setFormData({ ...formData, timeout_minutes: Number(e.target.value) })}
                />
                <p className="text-sm text-muted-foreground">
                  Tempo que o cliente tem para se apresentar após ser chamado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <Button variant="outline" asChild>
            <Link href="/admin/barbershops">
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Criando..." : "Criar Barbearia"}
          </Button>
        </div>
      </form>
    </div>
  )
} 