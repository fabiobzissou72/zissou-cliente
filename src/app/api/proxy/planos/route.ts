import { proxyRequest } from '@/lib/proxy-api'

export async function GET() {
  return proxyRequest({
    endpoint: '/api/planos/listar?ativo=true',
    context: 'planos'
  })
}
