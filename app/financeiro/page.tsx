'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'

interface Pedido {
  id: string
  status: string
  total: number
  criado_em: string
}

export default function Financeiro() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('pedidos').select('*')
      if (data) setPedidos(data)
      setLoading(false)
    }
    carregar()
  }, [])

  const totalFaturado = pedidos
    .filter(p => p.status === 'entregue')
    .reduce((acc, p) => acc + p.total, 0)

  const totalPendente = pedidos
    .filter(p => p.status === 'pendente' || p.status === 'em preparo')
    .reduce((acc, p) => acc + p.total, 0)

  const totalCancelado = pedidos
    .filter(p => p.status === 'cancelado')
    .reduce((acc, p) => acc + p.total, 0)

  const totalPedidos = pedidos.length
  const pedidosEntregues = pedidos.filter(p => p.status === 'entregue').length
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente' || p.status === 'em preparo').length

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar paginaAtiva="/financeiro" />

      <main className="flex-1 p-8 md:p-8 pt-20 md:pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">💰 Financeiro</h2>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm mb-1">Total faturado</p>
            <p className="text-3xl font-bold text-green-400">R$ {totalFaturado.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-1">{pedidosEntregues} pedidos entregues</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm mb-1">Em aberto</p>
            <p className="text-3xl font-bold text-yellow-400">R$ {totalPendente.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-1">{pedidosPendentes} pedidos pendentes</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm mb-1">Cancelados</p>
            <p className="text-3xl font-bold text-red-400">R$ {totalCancelado.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-1">Total de {totalPedidos} pedidos</p>
          </div>
        </div>

        {/* Lista de pedidos */}
        <h3 className="text-xl font-bold text-white mb-4">Histórico de pedidos</h3>
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : pedidos.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <p className="text-4xl mb-4">💰</p>
            <p className="text-gray-400">Nenhum pedido ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Pedido #{pedido.id.slice(0, 8)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    pedido.status === 'entregue' ? 'bg-green-900 text-green-400' :
                    pedido.status === 'cancelado' ? 'bg-red-900 text-red-400' :
                    pedido.status === 'em preparo' ? 'bg-blue-900 text-blue-400' :
                    'bg-yellow-900 text-yellow-400'
                  }`}>
                    {pedido.status}
                  </span>
                  <p className="text-orange-500 font-bold">R$ {pedido.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}