'use client'
import { useState } from 'react'

export default function EmailCapture({ role, city }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role, city })
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setStatus('success')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-green-600 text-sm font-medium">
        You are subscribed. We will alert you when {role} salaries in {city} are updated.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        {loading ? 'Subscribing...' : 'Notify me'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-xs mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  )
}