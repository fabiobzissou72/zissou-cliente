import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return proxyRequest({
      endpoint: '/api/compras/criar',
      method: 'POST',
      body,
      context: 'criar-compra'
    })
  } catch {
    return NextResponse.json({ error: 'Erro ao processar compra' }, { status: 500 })
  }
}
