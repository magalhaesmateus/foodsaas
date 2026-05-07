'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Cadastro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  async function handleCadastro() {
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { nome }
      }
    })

    if (error) {
      setErro(error.message)
    } else {
      setSucesso('Cadastro realizado! Verifique seu email para confirmar.')
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-orange-500 mb-6 text-center">
          🍟 Criar conta
        </h1>

        {erro && (
          <p className="text-red-500 text-sm mb-4 text-center">{erro}</p>
        )}

        {sucesso && (
          <p className="text-green-500 text-sm mb-4 text-center">{sucesso}</p>
        )}

        <input
          type="text"
          placeholder="Nome do seu negócio"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-orange-400 placeholder-gray-500 text-gray-800"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:border-orange-400 placeholder-gray-500 text-gray-800"
        />

        <div className="relative mb-6">
          <input
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-orange-400 placeholder-gray-500 text-gray-800"
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        </div>

        <button
          onClick={handleCadastro}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Cadastrar
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem conta?{' '}
          <Link href="/" className="text-orange-500 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}