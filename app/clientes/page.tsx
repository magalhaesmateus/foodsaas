'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../lib/supabase'

interface Cliente {
  id: string
  nome: string
  telefone: string
  endereco: string
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('clientes').select('*')
      if (data) setClientes(data)
      setLoading(false)
    }
    carregar()
  }, [])

  async function buscarClientes() {
    const { data } = await supabase.from('clientes').select('*')
    if (data) setClientes(data)
  }

  async function handleSalvar() {
    if (!nome || !telefone) {
      setErro('Nome e telefone são obrigatórios!')
      return
    }

    const { error } = await supabase.from('clientes').insert({
      nome,
      telefone,
      endereco,
    })

    if (error) {
      setErro(error.message)
    } else {
      setSucesso('Cliente salvo com sucesso!')
      setNome('')
      setTelefone('')
      setEndereco('')
      setMostrarForm(false)
      buscarClientes()
    }
  }

  async function handleDeletar(id: string) {
    await supabase.from('clientes').delete().eq('id', id)
    buscarClientes()
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar paginaAtiva="/clientes" />

      <main className="flex-1 p-8 md:p-8 pt-20 md:pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">👥 Clientes</h2>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Cliente'}
          </button>
        </div>

        {mostrarForm && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">Novo Cliente</h3>

            {erro && <p className="text-red-400 text-sm mb-4">{erro}</p>}
            {sucesso && <p className="text-green-400 text-sm mb-4">{sucesso}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nome *"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Telefone *"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              />
              <input
                type="text"
                placeholder="Endereço (opcional)"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 md:col-span-2"
              />
            </div>

            <button
              onClick={handleSalvar}
              className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Salvar Cliente
            </button>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Carregando clientes...</p>
        ) : clientes.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
            <p className="text-4xl mb-4">👥</p>
            <p className="text-gray-400">Nenhum cliente cadastrado ainda.</p>
            <p className="text-gray-500 text-sm">Clique em &quot;+ Novo Cliente&quot; para começar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{cliente.nome}</p>
                  <p className="text-gray-400 text-sm">📱 {cliente.telefone}</p>
                  {cliente.endereco && <p className="text-gray-500 text-sm">📍 {cliente.endereco}</p>}
                </div>
                <button
                  onClick={() => handleDeletar(cliente.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}