import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { supabase } from '../../../../lib/supabaseClient'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  const cookieStore = cookies()

  if (file) {
    const { data, error } = await supabase.storage
      .from('learning-phase')
      .upload(file?.name + '2' || '', file)
    console.log('upload data', data)
    console.log('upload error', error)
  }

  // const { data, error } = await supabase.storage.from('learning-phase').list()
  // console.log('data from supabase', data)
  // console.log('error from supabase', error)

  // const { data: publicUrlData } = supabase.storage
  //   .from('learning-phase')
  //   .getPublicUrl('miru.jpg')
  // console.log(publicUrlData.publicUrl)

  return NextResponse.json({})
}
