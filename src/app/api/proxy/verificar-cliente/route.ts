import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const clienteId = body?.cliente_id

    if (!clienteId) {
      return NextResponse.json({ existe: false })
    }

    return proxyRequest({
      endpoint: '/api/clientes/verificar',
      method: 'POST',
      body: { cliente_id: clienteId },
      context: 'verificar-cliente'
    })
  } catch {
    return NextResponse.json({ existe: false, error: 'Erro ao verificar cliente' }, { status: 500 })
  }
}
