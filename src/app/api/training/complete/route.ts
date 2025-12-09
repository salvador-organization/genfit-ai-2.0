import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { workoutId, duration } = await request.json()

    const { error } = await supabase
      .from('workouts')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        duration
      })
      .eq('id', workoutId)
      .eq('user_id', user.id)

    if (error) throw error

    // Log workout completion for analytics
    await supabase.from('workout_logs').insert({
      user_id: user.id,
      workout_id: workoutId,
      completed_at: new Date().toISOString(),
      duration
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao completar treino:', error)
    return NextResponse.json(
      { error: 'Erro ao completar treino' },
      { status: 500 }
    )
  }
}
