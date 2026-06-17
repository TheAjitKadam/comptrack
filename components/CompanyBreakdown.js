function formatSalary(amount) {
  if (!amount) return 'N/A'
  if (amount >= 100000) return 'Rs.' + (amount / 100000).toFixed(1) + 'L'
  return 'Rs.' + (amount / 1000).toFixed(0) + 'K'
}

export default function CompanyBreakdown({ submissions, role, city }) {
  if (!submissions || submissions.length === 0) {
    return null
  }

  const companyMap = {}

  submissions.forEach(function(s) {
    if (!s.company_name) return
    const key = s.company_name.trim()
    if (!companyMap[key]) {
      companyMap[key] = { total: 0, count: 0 }
    }
    companyMap[key].total += s.base_salary
    companyMap[key].count += 1
  })

  const companies = Object.keys(companyMap).map(function(name) {
    return {
      name: name,
      avgSalary: companyMap[name].total / companyMap[name].count,
      count: companyMap[name].count
    }
  })

  companies.sort(function(a, b) {
    return b.avgSalary - a.avgSalary
  })

  const topCompanies = companies.slice(0, 10)

  if (topCompanies.length === 0) {
    return null
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        Top paying companies for {role} in {city}
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Average base salary by company, based on submitted data.
      </p>
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Rank</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Company</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Avg. Base Salary</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Submissions</th>
            </tr>
          </thead>
          <tbody>
            {topCompanies.map(function(c, i) {
              return (
                <tr key={c.name} className="border-t border-gray-50">
                  <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatSalary(c.avgSalary)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{c.count}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}