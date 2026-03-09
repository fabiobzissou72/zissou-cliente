/**
 * Configuracao da API do dashboard.
 */

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api-docs.*$/i, '').replace(/\/+$/, '')

export const API_CONFIG = {
  BASE_URL: baseUrl || '',
  TOKEN: process.env.NEXT_PUBLIC_API_TOKEN || '',
  ENDPOINTS: {
    AGENDAMENTOS_LISTAR: '/api/agendamentos',
    AGENDAMENTOS_HORARIOS_DISPONIVEIS: '/api/agendamentos/horarios-disponiveis',
    AGENDAMENTOS_CRIAR: '/api/agendamentos/criar',
    AGENDAMENTOS_CONFIRMAR: '/api/agendamentos/confirmar-comparecimento',
    AGENDAMENTOS_CHECKIN: '/api/agendamentos/checkin',
    AGENDAMENTOS_REAGENDAR: '/api/agendamentos/reagendar',
    AGENDAMENTOS_CANCELAR: '/api/agendamentos/cancelar',
    CLIENTES_CRIAR: '/api/clientes/criar',
    CLIENTES_ATUALIZAR: '/api/clientes/atualizar',
    CLIENTES_HISTORICO: '/api/clientes/historico',
    CLIENTES_MEUS_AGENDAMENTOS: '/api/clientes/meus-agendamentos',
    BARBEIROS_LISTAR: '/api/barbeiros/listar',
    BARBEIROS_MEUS_AGENDAMENTOS: '/api/barbeiros/meus-agendamentos',
    SERVICOS_LISTAR: '/api/servicos',
    PRODUTOS_LISTAR: '/api/produtos/listar',
    PRODUTOS_CRIAR: '/api/produtos/criar',
    PRODUTOS_ATUALIZAR: '/api/produtos/atualizar',
    PLANOS_LISTAR: '/api/planos/listar',
    PLANOS_CRIAR: '/api/planos/criar',
    PLANOS_ATUALIZAR: '/api/planos/atualizar'
  }
}

export function getAuthHeaders() {
  return {
    Authorization: `Bearer ${API_CONFIG.TOKEN}`,
    'Content-Type': 'application/json'
  }
}

export async function apiGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  if (!API_CONFIG.BASE_URL || !API_CONFIG.TOKEN) {
    throw new Error('Configuracao de API incompleta (NEXT_PUBLIC_API_BASE_URL ou NEXT_PUBLIC_API_TOKEN)')
  }

  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function apiPost<T>(endpoint: string, data: unknown): Promise<T> {
  if (!API_CONFIG.BASE_URL || !API_CONFIG.TOKEN) {
    throw new Error('Configuracao de API incompleta (NEXT_PUBLIC_API_BASE_URL ou NEXT_PUBLIC_API_TOKEN)')
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error((errorData as { error?: string }).error || `API Error: ${response.status}`)
  }

  return response.json()
}

export async function apiDelete<T>(endpoint: string, data?: unknown): Promise<T> {
  if (!API_CONFIG.BASE_URL || !API_CONFIG.TOKEN) {
    throw new Error('Configuracao de API incompleta (NEXT_PUBLIC_API_BASE_URL ou NEXT_PUBLIC_API_TOKEN)')
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: data ? JSON.stringify(data) : undefined
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error((errorData as { error?: string }).error || `API Error: ${response.status}`)
  }

  return response.json()
}
