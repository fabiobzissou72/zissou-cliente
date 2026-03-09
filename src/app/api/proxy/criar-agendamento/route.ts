import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return proxyRequest({
      endpoint: '/api/agendamentos/criar',
      method: 'POST',
      body,
      context: 'criar-agendamento'
    })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 })
  }
}
