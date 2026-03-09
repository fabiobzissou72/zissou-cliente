import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const telefone = request.nextUrl.searchParams.get('telefone')

  if (!telefone) {
    return NextResponse.json({ error: 'Telefone obrigatorio' }, { status: 400 })
  }

  return proxyRequest({
    endpoint: `/api/clientes/historico?telefone=${encodeURIComponent(telefone)}`,
    context: 'clientes-historico'
  })
}
