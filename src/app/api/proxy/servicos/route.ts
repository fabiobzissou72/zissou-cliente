import { proxyRequest } from '@/lib/proxy-api'

export async function GET() {
  return proxyRequest({
    endpoint: '/api/servicos',
    context: 'servicos'
  })
}
