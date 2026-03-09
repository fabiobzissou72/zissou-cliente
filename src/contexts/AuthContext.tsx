'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Cliente } from '@/lib/supabase'
import { AuthResponse, cadastrarCliente, loginCliente } from '@/lib/auth'

interface AuthContextType {
  cliente: Cliente | null
  loading: boolean
  login: (telefone: string, senha: string) => Promise<AuthResponse>
  cadastrar: (dados: any) => Promise<AuthResponse>
  logout: () => void
  atualizarCliente: (cliente: Cliente) => void
  setClienteLogado: (cliente: Cliente) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const STORAGE_KEY = 'appbarbearia_cliente'
const LEGACY_STORAGE_KEY = 'vinci_cliente'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)

  const verificarClienteExiste = async (clienteId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/proxy/verificar-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId })
      })
      const data = await response.json()
      return data.existe === true
    } catch (error) {
      console.error('Erro ao verificar cliente:', error)
      return true
    }
  }

  useEffect(() => {
    const carregarCliente = () => {
      const clienteSalvo = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY)
      if (clienteSalvo) {
        try {
          const clienteData = JSON.parse(clienteSalvo)
          setCliente(clienteData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(clienteData))
          localStorage.removeItem(LEGACY_STORAGE_KEY)
        } catch (error) {
          console.error('Erro ao carregar cliente:', error)
          localStorage.removeItem(STORAGE_KEY)
          localStorage.removeItem(LEGACY_STORAGE_KEY)
        }
      }
      setLoading(false)
    }

    carregarCliente()
  }, [])

  useEffect(() => {
    if (!cliente) return

    const intervalo = setInterval(async () => {
      const existe = await verificarClienteExiste(cliente.id)
      if (!existe) {
        console.log('Cliente removido do banco - logout automatico')
        setCliente(null)
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
      }
    }, 10 * 60 * 1000)

    return () => clearInterval(intervalo)
  }, [cliente])

  useEffect(() => {
    if (cliente) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cliente))
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    }
  }, [cliente])

  const login = async (telefone: string, senha: string): Promise<AuthResponse> => {
    const resultado = await loginCliente(telefone, senha)
    if (resultado.success && resultado.cliente) {
      setCliente(resultado.cliente)
    }
    return resultado
  }

  const cadastrar = async (dados: any): Promise<AuthResponse> => {
    const resultado = await cadastrarCliente(dados)
    if (resultado.success && resultado.cliente) {
      setCliente(resultado.cliente)
    }
    return resultado
  }

  const logout = () => {
    setCliente(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  }

  const atualizarCliente = (clienteAtualizado: Cliente) => {
    setCliente(clienteAtualizado)
  }

  const setClienteLogado = (clienteLogado: Cliente) => {
    setCliente(clienteLogado)
  }

  return (
    <AuthContext.Provider value={{ cliente, loading, login, cadastrar, logout, atualizarCliente, setClienteLogado }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
