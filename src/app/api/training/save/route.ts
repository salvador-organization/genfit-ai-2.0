import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { workoutId, exercises } = await request.json()

    const { error } = await supabase
      .from('workouts')
      .update({ exercises })
      .eq('id', workoutId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar treino:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar treino' },
      { status: 500 }
    )
  }
}
