'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const roles = [
  'Software Engineer', 'Senior Software Engineer', 'Product Manager',
  'Data Analyst', 'Finance Manager', 'HR Manager',
  'Marketing Manager', 'Business Analyst', 'DevOps Engineer', 'Data Scientist'
]

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Noida', 'Gurgaon'
]

export default function Home() {
  const router = useRouter()
  const [role, setRole] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')

  const handleSearch = () => {
    if (!role || !city) {
      setError('Please select both a role and a city.')
      return
    }
    const roleSlug = role.toLowerCase().replace(/ /g, '-')
    const citySlug = city.toLowerCase().replace(/ /g, '-')
    router.push(`/salary/${roleSlug}-salary-${citySlug}`)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">CompTrack</h1>
          <a href="/submit" className="text-sm text-blue-600 hover:underline">
            Submit your salary
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Know your market worth
        </h2>
        <p className="text-lg text-gray-500 mb-12">
          Real salary data from verified professionals across India.
          See where you stand in seconds.
        </p>

        {/* Search box */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-left">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a role...</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a city...</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            See salary benchmarks →
          </button>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-t border-gray-100 py-10">
        <div className="max-w-2xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">10+</p>
            <p className="text-sm text-gray-500 mt-1">Job roles tracked</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">10</p>
            <p className="text-sm text-gray-500 mt-1">Cities covered</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">Free</p>
            <p className="text-sm text-gray-500 mt-1">Always free to use</p>
          </div>
        </div>
      </section>
    </main>
  )
}