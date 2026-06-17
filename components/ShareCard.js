'use client'
import { useState, useRef } from 'react'

function formatSalary(amount) {
  if (!amount) return 'N/A'
  if (amount >= 100000) return 'Rs.' + (amount / 100000).toFixed(1) + 'L'
  return 'Rs.' + (amount / 1000).toFixed(0) + 'K'
}

export default function ShareCard({ role, city, allSalaries }) {
  const [userSalary, setUserSalary] = useState('')
  const [percentile, setPercentile] = useState(null)
  const [showCard, setShowCard] = useState(false)
  const canvasRef = useRef(null)

  const calculatePercentile = () => {
    const salary = parseFloat(userSalary)
    if (!salary || !allSalaries || allSalaries.length === 0) return

    const sorted = allSalaries.slice().sort(function(a, b) { return a - b })
    let belowCount = 0
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] <= salary) belowCount++
    }
    const pct = Math.round((belowCount / sorted.length) * 100)
    setPercentile(pct)
    setShowCard(true)

    setTimeout(function() { drawCard(pct, salary) }, 50)
  }

  const drawCard = (pct, salary) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width = 1080
    canvas.height = 1080

    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080)
    gradient.addColorStop(0, '#2563eb')
    gradient.addColorStop(1, '#1e40af')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1080, 1080)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('CompTrack', 540, 120)

    ctx.font = 'bold 220px sans-serif'
    ctx.fillText(pct + 'th', 540, 460)

    ctx.font = '500 48px sans-serif'
    ctx.fillText('percentile', 540, 540)

    ctx.font = '500 40px sans-serif'
    ctx.fillText(role, 540, 680)
    ctx.fillText('in ' + city, 540, 740)

    ctx.font = '400 36px sans-serif'
    ctx.fillStyle = '#bfdbfe'
    ctx.fillText('at ' + formatSalary(salary) + ' per year', 540, 820)

    ctx.font = '400 28px sans-serif'
    ctx.fillStyle = '#93c5fd'
    ctx.fillText('comptrack.in', 540, 1000)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'comptrack-percentile.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-10">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        See your percentile and share it
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter your salary to see where you rank, then download a shareable card.
      </p>

      <div className="flex gap-3 mb-4">
        <input
          type="number"
          value={userSalary}
          onChange={function(e) { setUserSalary(e.target.value) }}
          placeholder="Your annual base salary in INR"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={calculatePercentile}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
        >
          See my percentile
        </button>
      </div>

      {showCard && percentile !== null && (
        <div className="mt-4">
          <p className="text-sm text-gray-700 mb-3">
            You are in the <span className="font-bold text-blue-700">{percentile}th percentile</span> for {role} in {city}.
          </p>
          <canvas
            ref={canvasRef}
            className="w-full max-w-xs rounded-xl shadow-md mb-3"
          />
          <button
            onClick={handleDownload}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Download card to share
          </button>
        </div>
      )}
    </div>
  )
}