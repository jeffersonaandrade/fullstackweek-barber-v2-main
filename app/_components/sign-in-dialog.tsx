"use client"

import { signIn } from "next-auth/react"
import { Button } from "./ui/button"
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

interface SignInDialogProps {
  onSuccess?: () => void
}

const SignInDialog = ({ onSuccess }: SignInDialogProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Preencha todos os campos")
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/"
      })

      if (result?.error) {
        console.error("Erro no login:", result.error)
        toast.error("Email ou senha incorretos")
      } else if (result?.ok) {
        toast.success("Login realizado com sucesso!")
        
        // Limpar campos
        setEmail("")
        setPassword("")
        
        // Chamar callback de sucesso (para fechar o dialog)
        if (onSuccess) {
          onSuccess()
        }
        
        // Recarregar a página para atualizar o estado da sessão
        window.location.reload()
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast.error("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription id="signin-dialog-description">
          Digite suas credenciais para acessar sua conta.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Credenciais de teste:</p>
        <p className="font-mono text-xs">
          admin@barbearia.com / admin123
        </p>
        <div className="mt-4 pt-4 border-t">
          <p>Não tem uma conta?</p>
          <Button variant="outline" size="sm" asChild className="mt-2">
            <Link href="/auth/signup">
              Cadastre-se
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}

export default SignInDialog
