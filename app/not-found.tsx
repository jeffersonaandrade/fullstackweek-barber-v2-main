import Link from "next/link"
import { Button } from "./_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./_components/ui/card"
import { ArrowLeft, Home, Search, AlertTriangle } from "lucide-react"
import Header from "./_components/header"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          {/* Card principal */}
          <Card className="w-full max-w-md">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <CardTitle className="text-2xl lg:text-3xl font-bold">
                Página não encontrada
              </CardTitle>
              <p className="text-muted-foreground">
                A página que você está procurando não existe ou foi movida.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Voltar ao Início
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/barbershops">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Barbearias
                  </Link>
                </Button>
              </div>
              
              {/* Botão voltar */}
              <Button variant="ghost" size="sm" asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Informações adicionais */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Código de erro: 404
            </p>
            <p className="text-xs text-muted-foreground">
              Se você acredita que isso é um erro, entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 