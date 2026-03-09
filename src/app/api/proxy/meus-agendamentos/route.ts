import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const telefone = request.nextUrl.searchParams.get('telefone')

  if (!telefone) {
    return NextResponse.json({ error: 'Telefone e obrigatorio' }, { status: 400 })
  }

  return proxyRequest({
    endpoint: `/api/clientes/meus-agendamentos?telefone=${encodeURIComponent(telefone)}`,
    context: 'meus-agendamentos'
  })
}
