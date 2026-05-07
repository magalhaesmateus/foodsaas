'use client'

import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar paginaAtiva="/dashboard" />

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 md:p-8 pt-20 md:pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Resumo do dia</h2>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm mb-1">Pedidos hoje</p>
            <p className="text-3xl font-bold text-orange-500">0</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm mb-1">Faturamento hoje</p>
            <p className="text-3xl font-bold text-orange-500">R$ 0,00</p>
          </div>
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <p className="text-gray-400 text-sm mb-1">Clientes ativos</p>
            <p className="text-3xl font-bold text-orange-500">0</p>
          </div>
        </div>

        {/* Atalhos */}
        <h2 className="text-xl font-bold text-white mb-4">Atalhos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/pedidos" className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-orange-500 transition flex items-center gap-4">
            <span className="text-4xl">📦</span>
            <div>
              <p className="font-semibold text-white">Novo Pedido</p>
              <p className="text-sm text-gray-400">Registrar um novo pedido</p>
            </div>
          </a>
          <a href="/clientes" className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-orange-500 transition flex items-center gap-4">
            <span className="text-4xl">👥</span>
            <div>
              <p className="font-semibold text-white">Novo Cliente</p>
              <p className="text-sm text-gray-400">Cadastrar um novo cliente</p>
            </div>
          </a>
          <a href="/cardapio" className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-orange-500 transition flex items-center gap-4">
            <span className="text-4xl">🍔</span>
            <div>
              <p className="font-semibold text-white">Cardápio</p>
              <p className="text-sm text-gray-400">Gerenciar produtos</p>
            </div>
          </a>
          <a href="/financeiro" className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-orange-500 transition flex items-center gap-4">
            <span className="text-4xl">💰</span>
            <div>
              <p className="font-semibold text-white">Financeiro</p>
              <p className="text-sm text-gray-400">Ver receitas e despesas</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  )
}