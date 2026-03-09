import { NextRequest, NextResponse } from 'next/server'
import { proxyRequest } from '@/lib/proxy-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const data = searchParams.get('data')
  const barbeiro = searchParams.get('barbeiro')
  const servicoIds = searchParams.get('servico_ids')

  if (!data) {
    return NextResponse.json({ error: 'Data e obrigatoria' }, { status: 400 })
  }

  const params = new URLSearchParams({ data })
  if (barbeiro) params.set('barbeiro', barbeiro)
  if (servicoIds) params.set('servico_ids', servicoIds)

  return proxyRequest({
    endpoint: `/api/agendamentos/horarios-disponiveis?${params.toString()}`,
    context: 'horarios-disponiveis'
  })
}
