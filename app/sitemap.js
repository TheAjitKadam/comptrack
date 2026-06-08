export default function sitemap() {
  const roles = [
    'software-engineer', 'senior-software-engineer', 'product-manager',
    'data-analyst', 'finance-manager', 'hr-manager',
    'marketing-manager', 'business-analyst', 'devops-engineer', 'data-scientist'
  ]

  const cities = [
    'bangalore', 'mumbai', 'delhi', 'pune', 'hyderabad',
    'chennai', 'kolkata', 'ahmedabad', 'noida', 'gurgaon'
  ]
  
  const baseUrl = 'https://comptrack.in'

  const salaryPages = []
  for (const role of roles) {
    for (const city of cities) {
      salaryPages.push({
        url: `${baseUrl}/salary/${role}-salary-${city}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8
      })
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    ...salaryPages
  ]
}