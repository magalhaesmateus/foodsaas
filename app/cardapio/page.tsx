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

export default function Cardapio() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [preco, setPreco] = useState('')
  const [categoria, setCategoria] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function buscarProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')

    console.log('produtos:', data)
    console.log('erro:', error)

    if (!error && data) setProdutos(data)
    setLoading(false)
  }

  useEffect(() => {
   // eslint-disable-next-line react-hooks/set-state-in-effect
   buscarProdutos()
  }, [])

  async function handleSalvar() {
    if (!nome || !preco || !categoria) {
      setErro('Preencha todos os campos obrigatórios!')
      return
    }

    const { data, error } = await supabase.from('produtos').insert({
      nome,
      descricao,
      preco: parseFloat(preco),
      categoria,
      ativo: true,
    })

    console.log('data:', data)
    console.log('error:', error)

    if (error) {
      setErro(error.message)
    } else {
      setSucesso('Produto salvo com sucesso!')
      setNome('')
      setDescricao('')
      setPreco('')
      setCategoria('')
      setMostrarForm(false)
      buscarProdutos()
    }
  }

  async function toggleAtivo(id: string, ativo: boolean) {
    await supabase.from('produtos').update({ ativo: !ativo }).eq('id', id)
    buscarProdutos()
  }

  async function handleDeletar(id: string) {
    await supabase.from('produtos').delete().eq('id', id)
    buscarProdutos()
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar paginaAtiva="/cardapio" />

      <main className="flex-1 p-8 md:p-8 pt-20 md:pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🍔 Cardápio</h2>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Produto'}
          </button>
        </div>

        {mostrarForm && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Novo Produto</h3>

            {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}
            {sucesso && <p className="text-green-400 text-sm mb-4">{sucesso}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome do produto *"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="number"
                placeholder="Preço *"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">Categoria *</option>
                <option value="Batata Recheada">Batata Recheada</option>
                <option value="Hambúrguer">Hambúrguer</option>
                <option value="Bebida">Bebida</option>
                <option value="Combo">Combo</option>
                <option value="Adicional">Adicional</option>
              </select>
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleSalvar}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Salvar Produto
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <p className="text-4xl mb-4">🍔</p>
            <p className="text-gray-400">Nenhum produto cadastrado ainda.</p>
            <p className="text-gray-500 text-sm">Clique em &quot;+ Novo Produto&quot; para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {produtos.map((produto) => (
              <div key={produto.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{produto.nome}</p>
                  <p className="text-gray-400 text-sm">{produto.categoria}</p>
                  {produto.descricao && <p className="text-gray-500 text-sm">{produto.descricao}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-orange-500 font-bold">R$ {produto.preco.toFixed(2)}</p>
                  <button onClick={() => toggleAtivo(produto.id, produto.ativo)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${produto.ativo ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}
                  >
                    {produto.ativo ? 'Ativo' : 'Inativo'}
                  </button>
                  <button
                    onClick={() => handleDeletar(produto.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}