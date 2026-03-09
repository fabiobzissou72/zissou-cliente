import { proxyRequest } from '@/lib/proxy-api'

export async function GET() {
  return proxyRequest({
    endpoint: '/api/produtos/listar?ativo=true',
    context: 'produtos'
  })
}
