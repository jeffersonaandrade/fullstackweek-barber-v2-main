'use client'

/**
 * CurrencyInput - Componente de input com máscara de moeda brasileira
 * 
 * IMPORTANTE: Este componente espera e retorna valores em CENTAVOS
 * 
 * Exemplo de uso:
 * ```tsx
 * const [priceInCents, setPriceInCents] = useState("3000") // R$ 30,00
 * 
 * <CurrencyInput
 *   value={priceInCents}
 *   onChange={(cents) => setPriceInCents(cents)}
 *   placeholder="0,00"
 * />
 * ```
 * 
 * - value: string em centavos (ex: "3000" = R$ 30,00)
 * - onChange: recebe string em centavos
 * - Exibe: R$ 30,00 (formato brasileiro)
 * - Salva: 3000 (centavos no banco)
 */

import { useState, useEffect, useRef } from 'react'
import { Input } from './input'
import { cn } from '@/app/_lib/utils'

interface CurrencyInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  id?: string
  name?: string
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0,00",
  className,
  disabled = false,
  required = false,
  id,
  name
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Converter centavos para formato brasileiro
  const formatDisplay = (cents: string): string => {
    if (!cents || cents === '0') return ''
    
    const valueInCents = parseInt(cents) || 0
    const valueInReais = valueInCents / 100
    
    return valueInReais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Converter input do usuário para centavos
  const parseInput = (input: string): string => {
    if (!input) return ''
    
    // Remover tudo exceto números, vírgula e ponto
    const clean = input.replace(/[^\d,.-]/g, '')
    
    // Se tem vírgula, tratar como formato brasileiro
    if (clean.includes(',')) {
      const parts = clean.split(',')
      const reais = parts[0].replace(/\D/g, '') || '0'
      const centavos = parts[1]?.replace(/\D/g, '').padEnd(2, '0').slice(0, 2) || '00'
      const result = (parseInt(reais) * 100 + parseInt(centavos)).toString()
      return result
    }
    
    // Se tem ponto, tratar como formato americano
    if (clean.includes('.')) {
      const parts = clean.split('.')
      const reais = parts[0].replace(/\D/g, '') || '0'
      const centavos = parts[1]?.replace(/\D/g, '').padEnd(2, '0').slice(0, 2) || '00'
      const result = (parseInt(reais) * 100 + parseInt(centavos)).toString()
      return result
    }
    
    // Se não tem vírgula nem ponto, tratar como reais inteiros
    const reais = clean.replace(/\D/g, '') || '0'
    const result = (parseInt(reais) * 100).toString()
    return result
  }

  // Atualizar display apenas quando não estiver editando
  useEffect(() => {
    if (!isEditing) {
      const formatted = formatDisplay(value)
      setDisplayValue(formatted)
    }
  }, [value, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Remover prefixo R$ se o usuário digitou
    const cleanInput = inputValue.replace(/^R\$\s*/, '')
    
    // Atualizar display com o valor digitado
    setDisplayValue(cleanInput)
    
    // Converter para centavos e notificar componente pai
    const cents = parseInput(cleanInput)
    onChange(cents)
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(true)
    e.target.select()
  }

  const handleBlur = () => {
    setIsEditing(false)
    // Formatar corretamente ao perder foco
    const formatted = formatDisplay(value)
    setDisplayValue(formatted)
  }

  return (
    <div className="relative">
      {/* Prefixo fixo R$ */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
        R$
      </span>
      
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={cn("pl-10 text-right", className)}
        disabled={disabled}
        required={required}
        id={id}
        name={name}
      />
    </div>
  )
} 