import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Rota de teste do barbeiro funcionando!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({
    message: 'POST funcionando!',
    receivedData: body,
    timestamp: new Date().toISOString()
  })
} 