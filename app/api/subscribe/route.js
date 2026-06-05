import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  const { email, role, city } = await request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('email_subscribers')
    .insert([{ email, role, city, subscribed_at: new Date().toISOString() }])

  if (error) {
    if (error.code === '23505') {
      return Response.json({ message: 'Already subscribed' }, { status: 200 })
    }
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  return Response.json({ message: 'Subscribed successfully' }, { status: 200 })
}