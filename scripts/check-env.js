#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🔍 Verificando configuração do ambiente...\n')

// Verificar se o arquivo .env existe
const envPath = path.join(process.cwd(), '.env')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('❌ Arquivo .env não encontrado!')
  console.log('📝 Crie um arquivo .env na raiz do projeto com as seguintes variáveis:\n')
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]
  
  requiredVars.forEach(varName => {
    console.log(`${varName}=sua_valor_aqui`)
  })
  
  console.log('\n💡 Veja o arquivo env-variables.txt para mais detalhes')
  process.exit(1)
}

// Carregar variáveis do .env
require('dotenv').config()

// Verificar variáveis obrigatórias
const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': 'URL do Supabase',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Chave anônima do Supabase',
  'SUPABASE_SERVICE_ROLE_KEY': 'Chave service role do Supabase',
  'NEXTAUTH_SECRET': 'Chave secreta do NextAuth',
  'NEXTAUTH_URL': 'URL do NextAuth'
}

const missingVars = []
const invalidVars = []

Object.entries(requiredVars).forEach(([varName, description]) => {
  const value = process.env[varName]
  
  if (!value) {
    missingVars.push({ name: varName, description })
  } else if (value === 'sua_valor_aqui' || value.includes('sua_')) {
    invalidVars.push({ name: varName, description, value })
  }
})

if (missingVars.length > 0) {
  console.log('❌ Variáveis de ambiente obrigatórias não encontradas:\n')
  missingVars.forEach(({ name, description }) => {
    console.log(`  - ${name}: ${description}`)
  })
  console.log()
}

if (invalidVars.length > 0) {
  console.log('⚠️  Variáveis de ambiente com valores padrão (precisam ser configuradas):\n')
  invalidVars.forEach(({ name, description, value }) => {
    console.log(`  - ${name}: ${description} (valor atual: ${value})`)
  })
  console.log()
}

if (missingVars.length === 0 && invalidVars.length === 0) {
  console.log('✅ Todas as variáveis de ambiente estão configuradas corretamente!')
  
  // Verificar se as URLs parecem válidas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const nextAuthUrl = process.env.NEXTAUTH_URL
  
  if (supabaseUrl && !supabaseUrl.includes('supabase.co')) {
    console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL não parece ser uma URL válida do Supabase')
  }
  
  if (nextAuthUrl && !nextAuthUrl.includes('localhost') && !nextAuthUrl.includes('http')) {
    console.log('⚠️  NEXTAUTH_URL não parece ser uma URL válida')
  }
  
  console.log('\n🚀 Você pode iniciar o servidor com: npm run dev')
} else {
  console.log('📝 Configure as variáveis acima no arquivo .env e tente novamente')
  process.exit(1)
} 