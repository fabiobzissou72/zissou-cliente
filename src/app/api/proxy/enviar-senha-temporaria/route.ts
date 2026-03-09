import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const telefone = body?.telefone

    if (!telefone) {
      return NextResponse.json({ error: 'Telefone e obrigatorio' }, { status: 400 })
    }

    return proxyRequest({
      endpoint: '/api/clientes/enviar-senha-temporaria',
      method: 'POST',
      body: { telefone },
      context: 'enviar-senha-temporaria'
    })
  } catch {
    return NextResponse.json({ error: 'Erro ao enviar senha temporaria' }, { status: 500 })
  }
}
