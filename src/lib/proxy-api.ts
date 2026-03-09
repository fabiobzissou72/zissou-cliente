import { NextResponse } from 'next/server'

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0'
}

type ProxyConfig = {
  baseUrl: string
  token: string
}

type ProxyRequestOptions = {
  endpoint: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  context: string
}

function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim()
  const withoutDocs = trimmed.replace(/\/api-docs.*$/i, '')
  return withoutDocs.replace(/\/+$/, '')
}

function getProxyConfig(): { config: ProxyConfig } | { errorResponse: NextResponse } {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const token = process.env.NEXT_PUBLIC_API_TOKEN

  if (!rawBaseUrl) {
    return {
      errorResponse: NextResponse.json(
        {
          error: 'erro de config',
          detalhe: 'NEXT_PUBLIC_API_BASE_URL nao configurada'
        },
        { status: 500, headers: NO_STORE_HEADERS }
      )
    }
  }

  if (!token) {
    return {
      errorResponse: NextResponse.json(
        {
          error: 'erro de config',
          detalhe: 'NEXT_PUBLIC_API_TOKEN nao configurado'
        },
        { status: 500, headers: NO_STORE_HEADERS }
      )
    }
  }

  const baseUrl = normalizeBaseUrl(rawBaseUrl)

  try {
    // Validacao para evitar URL invalida em runtime.
    new URL(baseUrl)
  } catch {
    return {
      errorResponse: NextResponse.json(
        {
          error: 'erro de config',
          detalhe: 'NEXT_PUBLIC_API_BASE_URL invalida'
        },
        { status: 500, headers: NO_STORE_HEADERS }
      )
    }
  }

  return { config: { baseUrl, token } }
}

async function parseUpstreamBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return {}
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json().catch(() => ({}))
  }

  const text = await response.text().catch(() => '')
  return text ? { raw: text } : {}
}

export async function proxyRequest(options: ProxyRequestOptions): Promise<NextResponse> {
  const { endpoint, method = 'GET', body, context } = options
  const configResult = getProxyConfig()

  if ('errorResponse' in configResult) {
    return configResult.errorResponse
  }

  const { baseUrl, token } = configResult.config
  const endpointNormalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const upstreamUrl = `${baseUrl}${endpointNormalized}`

  try {
    const response = await fetch(upstreamUrl, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store'
    })

    const upstreamBody = await parseUpstreamBody(response)

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'erro upstream',
          context,
          upstream_status: response.status,
          upstream_status_text: response.statusText,
          upstream_url: upstreamUrl,
          upstream_response: upstreamBody
        },
        { status: response.status, headers: NO_STORE_HEADERS }
      )
    }

    return NextResponse.json(upstreamBody, {
      status: response.status,
      headers: NO_STORE_HEADERS
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'erro de conexao com API',
        context,
        upstream_url: upstreamUrl,
        detalhe: error instanceof Error ? error.message : 'erro desconhecido'
      },
      { status: 502, headers: NO_STORE_HEADERS }
    )
  }
}
