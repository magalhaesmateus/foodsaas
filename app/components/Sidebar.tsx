'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

interface SidebarProps {
  paginaAtiva: string
}

export default function Sidebar({ paginaAtiva }: SidebarProps) {
  const [menuAberto, setMenuAberto] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const links = [
    { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/cardapio', icon: '🍔', label: 'Cardápio' },
    { href: '/pedidos', icon: '📦', label: 'Pedidos' },
    { href: '/clientes', icon: '👥', label: 'Clientes' },
    { href: '/financeiro', icon: '💰', label: 'Financeiro' },
  ]

  return (
    <>
      {/* Topbar mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-orange-500">🍟 FoodSaaS</h1>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="text-white text-2xl"
        >
          {menuAberto ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu mobile overlay */}
      {menuAberto && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-60"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64 bg-gray-900 flex flex-col border-r border-gray-800
        transform transition-transform duration-300
        ${menuAberto ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="p-6 border-b border-gray-800 hidden md:block">
          <h1 className="text-xl font-bold text-orange-500">🍟 FoodSaaS</h1>
        </div>

        {/* Espaço pro topbar no mobile */}
        <div className="md:hidden h-16" />

        <nav className="flex flex-col gap-2 p-4 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                paginaAtiva === link.href
                  ? 'bg-gray-800 text-orange-500 font-semibold'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-orange-500'
              }`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full p-3 rounded-lg text-red-400 hover:bg-gray-800 transition text-left font-semibold"
          >
            🚪 Sair
          </button>
        </div>
      </aside>
    </>
  )
}