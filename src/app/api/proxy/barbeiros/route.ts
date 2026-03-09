import { proxyRequest } from '@/lib/proxy-api'

export const dynamic = 'force-dynamic'

export async function GET() {
  return proxyRequest({
    endpoint: '/api/barbeiros/listar?ativo=true',
    context: 'barbeiros'
  })
}
