"use client"

import { useState, useRef } from "react"
import { Button } from "./button"
import { Label } from "./label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  label?: string
  value?: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  className?: string
}

export function ImageUpload({
  label = "Imagem",
  value,
  onChange,
  placeholder = "Clique para fazer upload",
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validação do arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Formato de arquivo não suportado. Use JPG, PNG ou WebP.')
      return
    }

    if (file.size > maxSize) {
      alert('Arquivo muito grande. Tamanho máximo: 5MB.')
      return
    }

    setIsUploading(true)

    try {
      // TODO: Implementar upload para Supabase Storage
      // Por enquanto, vamos simular com uma URL temporária
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem.')
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <div className="space-y-3">
        {/* Preview da imagem */}
        {value && (
          <div className="relative">
            <div className="relative h-32 w-full rounded-lg overflow-hidden border">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Botão de upload */}
        {!value && (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Fazendo upload..." : "Selecionar imagem"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {placeholder}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG ou WebP (máx 5MB)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
} 