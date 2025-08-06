#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🧹 Limpando cache do Next.js...')

const cacheDirs = [
  '.next',
  'node_modules/.cache',
  '.turbo'
]

cacheDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir)
  if (fs.existsSync(fullPath)) {
    console.log(`Removendo: ${dir}`)
    try {
      fs.rmSync(fullPath, { recursive: true, force: true })
    } catch (error) {
      console.log(`Erro ao remover ${dir}:`, error.message)
    }
  }
})

console.log('✅ Cache limpo com sucesso!')
console.log('💡 Execute "npm run dev" para reiniciar o servidor.') 