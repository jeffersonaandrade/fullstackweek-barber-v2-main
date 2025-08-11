"use client"

import { useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useEffect, useState } from "react"

const WelcomeSection = () => {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = useState(false)

  // Garantir que o componente só renderiza no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mostrar loading enquanto verifica a sessão
  if (!isClient || status === 'loading') {
    return (
      <div>
        <h2 className="text-xl font-bold lg:text-2xl xl:text-3xl">Carregando...</h2>
        <p className="text-sm lg:text-base">
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* TEXTO */}
      <h2 className="text-xl font-bold lg:text-2xl xl:text-3xl">
        Olá, {session?.user ? session.user.name : "bem vindo"}!
      </h2>
      <p className="text-sm lg:text-base">
        <span className="capitalize">
          {format(new Date(), "EEEE, dd", { locale: ptBR })}
        </span>
        <span>&nbsp;de&nbsp;</span>
        <span className="capitalize">
          {format(new Date(), "MMMM", { locale: ptBR })}
        </span>
      </p>

      {/* BOTÕES DE LOGIN/REGISTRO */}
      {status === 'unauthenticated' && (
        <div className="mt-4 flex gap-2 lg:gap-3">
          <Button asChild variant="outline" size="sm" className="lg:text-sm">
            <Link href="/auth/signin">
              Entrar
            </Link>
          </Button>
          <Button asChild size="sm" className="lg:text-sm">
            <Link href="/auth/signup">
              Criar Conta
            </Link>
          </Button>
        </div>
      )}

      {/* INFORMAÇÕES DO USUÁRIO LOGADO */}
      {session?.user && (
        <div className="mt-4 p-3 bg-muted rounded-lg lg:p-4">
          <p className="text-sm text-muted-foreground lg:text-base">
            Logado como: <span className="font-medium">{session.user.email}</span>
          </p>
          <p className="text-xs text-muted-foreground lg:text-sm">
            Role: <span className="font-medium">{session.user.role}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default WelcomeSection 