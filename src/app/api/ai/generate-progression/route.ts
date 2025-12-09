import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { analyzeProgress } from '@/lib/ai/progress-analyzer'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Get user's workout history
    const { data: workoutLogs } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(30)

    // Get user's current measurements
    const { data: measurements } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('measured_at', { ascending: false })
      .limit(10)

    // Analyze progress and generate recommendations
    const analysis = await analyzeProgress({
      workoutLogs: workoutLogs || [],
      measurements: measurements || []
    })

    // If progression is needed, update workout plan
    if (analysis.shouldProgress) {
      const { data: currentWorkouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('week', analysis.currentWeek)

      // Generate next week's progression
      const progressedWorkouts = currentWorkouts?.map(workout => ({
        ...workout,
        week: analysis.currentWeek + 1,
        exercises: workout.exercises.map((ex: any) => ({
          ...ex,
          sets: ex.sets + (analysis.recommendations.increaseSets ? 1 : 0),
          weight: ex.weight ? ex.weight * 1.05 : ex.weight // 5% increase
        }))
      }))

      // Save progressed workouts
      if (progressedWorkouts) {
        await Promise.all(
          progressedWorkouts.map(workout =>
            supabase.from('workouts').insert(workout)
          )
        )
      }
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    console.error('Erro ao gerar progressão:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar progressão' },
      { status: 500 }
    )
  }
}
