'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'

interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  ativo: boolean
}

interface Pedido {
  id: string
  status: string
  total: number
  observacao: string
  criado_em: string
}

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [observacao, setObservacao] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [itensSelecionados, setItensSelecionados] = useState<{ produto_id: string, nome: string, preco: number, quantidade: number }[]>([])

  useEffect(() => {
    async function carregar() {
      const { data: dataPedidos } = await supabase.from('pedidos').select('*')
      if (dataPedidos) setPedidos(dataPedidos)

      const { data: dataProdutos } = await supabase.from('produtos').select('*')
      if (dataProdutos) setProdutos(dataProdutos)

      setLoading(false)
    }
    carregar()
  }, [])

  async function buscarPedidos() {
    const { data } = await supabase.from('pedidos').select('*')
    if (data) setPedidos(data)
  }

  function adicionarItem(produto: Produto) {
    const existente = itensSelecionados.find(i => i.produto_id === produto.id)
    if (existente) {
      setItensSelecionados(itensSelecionados.map(i =>
        i.produto_id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
      ))
    } else {
      setItensSelecionados([...itensSelecionados, {
        produto_id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: 1
      }])
    }
  }

  function removerItem(produto_id: string) {
    setItensSelecionados(itensSelecionados.filter(i => i.produto_id !== produto_id))
  }

  const total = itensSelecionados.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

  async function handleSalvar() {
    if (itensSelecionados.length === 0) {
      setErro('Adicione pelo menos um produto!')
      return
    }

    const { data: pedido, error } = await supabase
      .from('pedidos')
      .insert({ status: 'pendente', total, observacao })
      .select()
      .single()

    if (error || !pedido) {
      setErro('Erro ao salvar pedido!')
      return
    }

    const itens = itensSelecionados.map(i => ({
      pedido_id: pedido.id,
      produto_id: i.produto_id,
      quantidade: i.quantidade,
      preco_unitario: i.preco
    }))

    await supabase.from('itens_pedido').insert(itens)

    setSucesso('Pedido salvo com sucesso!')
    setItensSelecionados([])
    setObservacao('')
    setMostrarForm(false)
    buscarPedidos()
  }

  function statusCor(status: string) {
    switch (status) {
      case 'pendente': return 'bg-yellow-900 text-yellow-400'
      case 'em preparo': return 'bg-blue-900 text-blue-400'
      case 'entregue': return 'bg-green-900 text-green-400'
      case 'cancelado': return 'bg-red-900 text-red-400'
      default: return 'bg-gray-800 text-gray-400'
    }
  }

  async function atualizarStatus(id: string, status: string) {
    await supabase.from('pedidos').update({ status }).eq('id', id)
    buscarPedidos()
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar paginaAtiva="/pedidos" />

      <main className="flex-1 p-8 md:p-8 pt-20 md:pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">📦 Pedidos</h2>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Pedido'}
          </button>
        </div>

        {mostrarForm && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Novo Pedido</h3>

            {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}
            {sucesso && <p className="text-green-400 text-sm mb-4">{sucesso}</p>}

            <p className="text-gray-400 text-sm mb-2">Selecione os produtos:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {produtos.map((produto) => (
                <button
                  key={produto.id}
                  onClick={() => adicionarItem(produto)}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-left hover:border-orange-500 transition"
                >
                  <p className="text-white text-sm font-semibold">{produto.nome}</p>
                  <p className="text-orange-500 text-sm">R$ {produto.preco.toFixed(2)}</p>
                </button>
              ))}
            </div>

            {itensSelecionados.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-gray-400 text-sm mb-2">Itens do pedido:</p>
                {itensSelecionados.map((item) => (
                  <div key={item.produto_id} className="flex justify-between items-center mb-2">
                    <p className="text-white text-sm">{item.nome} x{item.quantidade}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-orange-500 text-sm">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                      <button onClick={() => removerItem(item.produto_id)} className="text-red-400 text-sm">✕</button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between">
                  <p className="text-white font-semibold">Total</p>
                  <p className="text-orange-500 font-bold">R$ {total.toFixed(2)}</p>
                </div>
              </div>
            )}

            <input
              type="text"
              placeholder="Observação (opcional)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 mb-4"
            />

            <button
              onClick={handleSalvar}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Salvar Pedido
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Carregando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-gray-400">Nenhum pedido ainda.</p>
            <p className="text-gray-500 text-sm">Clique em &quot;+ Novo Pedido&quot; para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">Pedido #{pedido.id.slice(0, 8)}</p>
                  {pedido.observacao && <p className="text-gray-400 text-sm">{pedido.observacao}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-orange-500 font-bold">R$ {pedido.total.toFixed(2)}</p>
                  <select
                    value={pedido.status}
                    onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold border-0 focus:outline-none ${statusCor(pedido.status)}`}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em preparo">Em preparo</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}