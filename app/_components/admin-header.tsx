import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface AdminHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backHref?: string
  children?: React.ReactNode
}

export default function AdminHeader({
  title,
  subtitle,
  showBackButton = false,
  backHref = "/admin",
  children
}: AdminHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Botão Voltar */}
      {showBackButton && (
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link href={backHref}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>
      )}
      
      {/* Título e Botões de Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children && (
          <div className="flex flex-col sm:flex-row gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  )
} 