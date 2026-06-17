'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function formatSalary(amount) {
  if (!amount) return 'N/A'
  if (amount >= 100000) return 'Rs.' + (amount / 100000).toFixed(1) + 'L'
  return 'Rs.' + (amount / 1000).toFixed(0) + 'K'
}

const bands = [
  { label: 'All experience', min: 0, max: 100 },
  { label: '0-2 years', min: 0, max: 2 },
  { label: '3-5 years', min: 3, max: 5 },
  { label: '6-10 years', min: 6, max: 10 },
  { label: '10+ years', min: 10, max: 100 }
]

export default function ExperienceFilter({ roleSlug, citySlug, initialP25, initialP50, initialP75, initialSampleSize }) {
  const [activeBand, setActiveBand] = useState(0)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    p25: initialP25,
    p50: initialP50,
    p75: initialP75,
    sampleSize: initialSampleSize
  })

  const handleBandClick = async (index) => {
    setActiveBand(index)

    if (index === 0) {
      setStats({
        p25: initialP25,
        p50: initialP50,
        p75: initialP75,
        sampleSize: initialSampleSize
      })
      return
    }

    setLoading(true)
    const band = bands[index]

    const { data } = await supabase
      .from('salary_submissions')
      .select('base_salary')
      .eq('role_normalized', roleSlug)
      .eq('city', citySlug)
      .gte('experience_years', band.min)
      .lte('experience_years', band.max)

    setLoading(false)

    if (!data || data.length < 3) {
      setStats({ p25: null, p50: null, p75: null, sampleSize: data ? data.length : 0 })
      return
    }

    const salaries = data
      .map(function(s) { return s.base_salary })
      .filter(function(s) { return s > 0 })
      .sort(function(a, b) { return a - b })

    const n = salaries.length
    setStats({
      p25: salaries[Math.floor(n * 0.25)],
      p50: salaries[Math.floor(n * 0.5)],
      p75: salaries[Math.floor(n * 0.75)],
      sampleSize: n
    })
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 flex-wrap mb-6">
        {bands.map(function(band, index) {
          return (
            <button
              key={band.label}
              onClick={function() { handleBandClick(index) }}
              className={
                activeBand === index
                  ? "bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              }
            >
              {band.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-50 rounded-xl p-5 text-center animate-pulse h-24"></div>
          <div className="bg-gray-50 rounded-xl p-5 text-center animate-pulse h-24"></div>
          <div className="bg-gray-50 rounded-xl p-5 text-center animate-pulse h-24"></div>
        </div>
      ) : stats.p50 ? (
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-50 rounded-xl p-5 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">25th Percentile</p>
            <p className="text-2xl font-bold text-gray-700">{formatSalary(stats.p25)}</p>
            <p className="text-xs text-gray-400 mt-1">per year</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 text-center border border-blue-100">
            <p className="text-xs text-blue-600 uppercase tracking-wide mb-2">Median (P50)</p>
            <p className="text-2xl font-bold text-blue-700">{formatSalary(stats.p50)}</p>
            <p className="text-xs text-blue-400 mt-1">per year</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">75th Percentile</p>
            <p className="text-2xl font-bold text-gray-700">{formatSalary(stats.p75)}</p>
            <p className="text-xs text-gray-400 mt-1">per year</p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-10 text-center">
          <p className="text-amber-800 font-medium">Not enough data for this experience range yet.</p>
          <p className="text-amber-600 text-sm mt-1">Only {stats.sampleSize} submission(s) found. Try a different band.</p>
        </div>
      )}

      <p className="text-sm text-gray-400 -mt-4 mb-8">
        Based on {stats.sampleSize > 0 ? stats.sampleSize : 0} submissions in this range.
      </p>
    </div>
  )
}