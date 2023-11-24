import { NextResponse } from 'next/server'

import { supabase } from '../../../../lib/supabaseClient'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const data = await request.json()
  const email = String(data.email)
  const password = String(data.password)

  const authTokenResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  console.log('authTokenResponse', authTokenResponse)
  const user = await supabase.auth.getUser()
  console.log('')
  console.log('user ', user)

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  })
}
