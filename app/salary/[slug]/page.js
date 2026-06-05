import { supabase } from '../../../lib/supabase'

const cityLabels = {
  'bangalore': 'Bangalore', 'mumbai': 'Mumbai', 'delhi': 'Delhi',
  'pune': 'Pune', 'hyderabad': 'Hyderabad', 'chennai': 'Chennai',
  'kolkata': 'Kolkata', 'ahmedabad': 'Ahmedabad', 'noida': 'Noida',
  'gurgaon': 'Gurgaon'
}

const roleLabels = {
  'software-engineer': 'Software Engineer',
  'senior-software-engineer': 'Senior Software Engineer',
  'product-manager': 'Product Manager',
  'data-analyst': 'Data Analyst',
  'finance-manager': 'Finance Manager',
  'hr-manager': 'HR Manager',
  'marketing-manager': 'Marketing Manager',
  'business-analyst': 'Business Analyst',
  'devops-engineer': 'DevOps Engineer',
  'data-scientist': 'Data Scientist'
}

function parseSlug(slug) {
  const cityKeys = Object.keys(cityLabels)
  for (const city of cityKeys) {
    if (slug.endsWith('-' + city)) {
      const roleSlug = slug.replace('-salary-' + city, '').replace('-' + city, '')
      return { roleSlug, citySlug: city }
    }
  }
  return { roleSlug: slug, citySlug: '' }
}

function formatSalary(amount) {
  if (!amount) return 'N/A'
  if (amount >= 100000) return 'Rs.' + (amount / 100000).toFixed(1) + 'L'
  return 'Rs.' + (amount / 1000).toFixed(0) + 'K'
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { roleSlug, citySlug } = parseSlug(slug)
  const role = roleLabels[roleSlug] || roleSlug
  const city = cityLabels[citySlug] || citySlug
  return {
    title: role + ' Salary in ' + city + ' 2025 | CompTrack',
    description: 'Real ' + role + ' salary data in ' + city + '. See P25, P50, P75 benchmarks from verified professionals.'
  }
}

export default async function SalaryPage({ params }) {
  const { slug } = await params
  const { roleSlug, citySlug } = parseSlug(slug)
  const role = roleLabels[roleSlug] || roleSlug
  const city = cityLabels[citySlug] || citySlug

  const { data: benchmark } = await supabase
    .from('benchmark_snapshots')
    .select('*')
    .eq('role_slug', roleSlug)
    .eq('city', citySlug)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  const { data: submissions } = await supabase
    .from('salary_submissions')
    .select('base_salary, total_comp, experience_years, company_name')
    .eq('role_normalized', roleSlug)
    .eq('city', citySlug)
    .order('submitted_at', { ascending: false })
    .limit(10)

  let p25 = null, p50 = null, p75 = null, sampleSize = 0

  if (submissions && submissions.length >= 3) {
    const salaries = submissions.map(function(s) { return s.base_salary }).sort(function(a, b) { return a - b })
    sampleSize = salaries.length
    p25 = salaries[Math.floor(sampleSize * 0.25)]
    p50 = salaries[Math.floor(sampleSize * 0.5)]
    p75 = salaries[Math.floor(sampleSize * 0.75)]
  }

  if (benchmark) {
    p25 = benchmark.percentile_25
    p50 = benchmark.percentile_50
    p75 = benchmark.percentile_75
    sampleSize = benchmark.sample_size
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-semibold text-gray-900">CompTrack</a>
          <a href="/submit" className="text-sm text-blue-600 hover:underline">
            Submit your salary
          </a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-sm text-gray-500 mb-2">
            <a href="/" className="hover:underline">Home</a> &gt; Salary &gt; {role} in {city}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {role} Salary in {city}
          </h1>
          <p className="text-gray-500">
            Based on {sampleSize > 0 ? sampleSize : 'community'} submissions. Last updated 2025.
          </p>
        </div>

        {p50 ? (
          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">25th Percentile</p>
              <p className="text-2xl font-bold text-gray-700">{formatSalary(p25)}</p>
              <p className="text-xs text-gray-400 mt-1">per year</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-100">
              <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Median (P50)</p>
              <p className="text-2xl font-bold text-blue-700">{formatSalary(p50)}</p>
              <p className="text-xs text-blue-400 mt-1">per year</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">75th Percentile</p>
              <p className="text-2xl font-bold text-gray-700">{formatSalary(p75)}</p>
              <p className="text-xs text-gray-400 mt-1">per year</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-10 text-center">
            <p className="text-amber-800 font-medium mb-2">No data yet for this role and city</p>
            <p className="text-amber-600 text-sm mb-4">
              Be the first to submit a salary for {role} in {city}.
            </p>
            <a href="/submit" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              Submit your salary
            </a>
          </div>
        )}

        {p50 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">How does your salary compare?</p>
              <p className="text-sm text-blue-600 mt-1">Submit yours anonymously in 60 seconds.</p>
            </div>
            <a href="/submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm ml-4">
              Submit salary
            </a>
          </div>
        )}

        {submissions && submissions.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent submissions</h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Company</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Experience</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">Base Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(function(s, i) {
                    return (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="px-4 py-3 text-gray-700">{s.company_name || 'Anonymous'}</td>
                        <td className="px-4 py-3 text-gray-500">{s.experience_years ? s.experience_years + ' yrs' : '-'}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{formatSalary(s.base_salary)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            About {role} salaries in {city}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {role} is one of the most sought-after roles in {city}. Salaries vary based on
            experience, company size, and specific skills. Use the benchmarks above to understand
            where you stand and prepare for your next salary negotiation.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            All data on CompTrack is submitted anonymously by verified professionals.
            The more people contribute, the more accurate the benchmarks become.
          </p>
        </div>
      </div>
    </main>
  )
}