import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    return proxyRequest({
      endpoint: '/api/agendamentos/cancelar',
      method: 'DELETE',
      body,
      context: 'cancelar-agendamento'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao cancelar agendamento' }, { status: 500 })
  }
}
