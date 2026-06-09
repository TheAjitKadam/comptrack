'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const roles = [
  'Software Engineer', 'Senior Software Engineer', 'Product Manager',
  'Data Analyst', 'Finance Manager', 'HR Manager',
  'Marketing Manager', 'Business Analyst', 'DevOps Engineer', 'Data Scientist'
]

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Noida', 'Gurgaon'
]

const roleSlugs = {
  'Software Engineer': 'software-engineer',
  'Senior Software Engineer': 'senior-software-engineer',
  'Product Manager': 'product-manager',
  'Data Analyst': 'data-analyst',
  'Finance Manager': 'finance-manager',
  'HR Manager': 'hr-manager',
  'Marketing Manager': 'marketing-manager',
  'Business Analyst': 'business-analyst',
  'DevOps Engineer': 'devops-engineer',
  'Data Scientist': 'data-scientist'
}

export default function SubmitPage() {
  const [form, setForm] = useState({
    role_title: '',
    company_name: '',
    city: '',
    experience_years: '',
    base_salary: '',
    bonus: '',
    total_comp: '',
    website: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.website) {
      setSubmitted(true)
      return
    }

    if (!form.role_title || !form.city || !form.base_salary) {
      setError('Please fill in role, city, and base salary at minimum.')
      return
    }

    setLoading(true)

    const payload = {
      role_title: form.role_title,
      role_normalized: roleSlugs[form.role_title] || form.role_title.toLowerCase().replace(/ /g, '-'),
      company_name: form.company_name || null,
      city: form.city.toLowerCase(),
      country: 'India',
      experience_years: form.experience_years ? parseInt(form.experience_years) : null,
      base_salary: parseFloat(form.base_salary),
      bonus: form.bonus ? parseFloat(form.bonus) : 0,
      total_comp: form.total_comp ? parseFloat(form.total_comp) : parseFloat(form.base_salary),
      currency: 'INR',
      source: 'user'
    }

    const { error: dbError } = await supabase
      .from('salary_submissions')
      .insert([payload])

    setLoading(false)

    if (dbError) {
      setError('Something went wrong. Please try again.')
      console.error(dbError)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-white">
        <header className="border-b border-gray-100 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <a href="/" className="text-xl font-semibold text-gray-900">CompTrack</a>
          </div>
        </header>
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank you for contributing!</h2>
          <p className="text-gray-500 mb-8">
            Your salary data has been submitted anonymously and helps thousands
            of professionals benchmark their compensation.
          </p>
          <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Back to search
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-semibold text-gray-900">CompTrack</a>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit your salary</h1>
          <p className="text-gray-500 text-sm">
            Anonymous. Takes 60 seconds. Helps everyone negotiate better.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div style={{ display: 'none' }}>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Role *
            </label>
            <select
              name="role_title"
              value={form.role_title}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your role...</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              placeholder="e.g. Infosys, HDFC Bank, TCS"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your city...</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              placeholder="e.g. 5"
              min="0"
              max="40"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Salary (Annual, INR) *
            </label>
            <input
              type="number"
              name="base_salary"
              value={form.base_salary}
              onChange={handleChange}
              placeholder="e.g. 1200000 for 12 LPA"
              min="0"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Enter full amount in rupees. 12 LPA = 1200000</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Bonus (INR) <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              name="bonus"
              value={form.bonus}
              onChange={handleChange}
              placeholder="e.g. 200000"
              min="0"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total CTC (INR) <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="number"
              name="total_comp"
              value={form.total_comp}
              onChange={handleChange}
              placeholder="e.g. 1500000"
              min="0"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit anonymously'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Your data is completely anonymous. We never store your name or email with your salary.
          </p>
        </form>
      </div>
    </main>
  )
}